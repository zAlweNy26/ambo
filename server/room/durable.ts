/// <reference path="./workers.d.ts" />
import type { Connection, RoomHost, RoomState, Session } from './core'
import { DurableObject } from 'cloudflare:workers'
import { createDb } from 'void/db'
import { createRoom, dispatch, ROOM_TTL, saveFinalStats } from './core'
import { saveStats } from './stats'

export interface Env {
  DB: Parameters<typeof createDb>[0]
  ROOMS: DurableObjectNamespace<GameRoom>
}

function connection(ws: WebSocket): Connection {
  return {
    session: (ws.deserializeAttachment() ?? {}) as Session,
    setSession: session => ws.serializeAttachment(session),
    send(message) {
      try {
        ws.send(JSON.stringify(message))
      }
      catch {} // the socket closed meanwhile; it reconnects and gets the full state
    },
  }
}

// One live game in production: its state survives restarts in the object's storage, and sockets hibernate between draws
export class GameRoom extends DurableObject<Env> {
  private state: RoomState | undefined

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    // Heartbeats are answered without waking the object
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'))
    ctx.blockConcurrencyWhile(async () => {
      this.state = await ctx.storage.get<RoomState>('state')
    })
  }

  async init(id: string, host: string) {
    if (this.state) return false
    this.state = createRoom(id, host)
    await this.ctx.storage.put('state', this.state)
    // Cards and players' names are kept for a day at most
    await this.ctx.storage.setAlarm(this.state.createdAt + ROOM_TTL)
    return true
  }

  async fetch(request: Request) {
    if (request.headers.get('upgrade') !== 'websocket') return new Response('Expected a WebSocket', { status: 426 })
    const { 0: client, 1: server } = new WebSocketPair()
    this.ctx.acceptWebSocket(server)
    return new Response(null, { status: 101, webSocket: client })
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message === 'string') await dispatch(this.host(), connection(ws), message)
  }

  async alarm() {
    await saveFinalStats(this.host())
    await this.host().clear()
  }

  private host(): RoomHost {
    return {
      state: this.state,
      connections: () => this.ctx.getWebSockets().map(connection),
      save: () => this.ctx.storage.put('state', this.state),
      clear: async () => {
        this.state = undefined
        await this.ctx.storage.deleteAlarm()
        await this.ctx.storage.deleteAll()
        for (const ws of this.ctx.getWebSockets()) ws.close(1000, 'closed')
      },
      stats: () => saveStats(createDb(this.env.DB), this.state!),
    }
  }
}
