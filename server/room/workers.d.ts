// The few Workers runtime APIs the game room uses. The full @cloudflare/workers-types clash with the DOM types of the app.
declare module 'cloudflare:workers' {
  export abstract class DurableObject<Env = unknown> {
    protected ctx: DurableObjectState
    protected env: Env
    constructor(ctx: DurableObjectState, env: Env)
  }
}

interface DurableObjectState {
  storage: {
    get: <T>(key: string) => Promise<T | undefined>
    put: (key: string, value: unknown) => Promise<void>
    deleteAll: () => Promise<void>
    setAlarm: (time: number) => Promise<void>
    deleteAlarm: () => Promise<void>
  }
  acceptWebSocket: (ws: WebSocket) => void
  getWebSockets: () => WebSocket[]
  setWebSocketAutoResponse: (pair: WebSocketRequestResponsePair) => void
  blockConcurrencyWhile: <T>(fn: () => Promise<T>) => Promise<T>
}

interface DurableObjectStub<T> {
  fetch: (request: unknown) => Promise<Response>
  init: T extends { init: (...args: infer A) => infer R } ? (...args: A) => R : never
}

interface DurableObjectNamespace<T> {
  idFromName: (name: string) => unknown
  get: (id: unknown) => DurableObjectStub<T>
}

declare class WebSocketPair {
  0: WebSocket
  1: WebSocket
}

declare class WebSocketRequestResponsePair {
  constructor(request: string, response: string)
}

interface WebSocket {
  serializeAttachment: (value: unknown) => void
  deserializeAttachment: () => any
}

interface ResponseInit {
  webSocket?: WebSocket | null
}

// Nitro virtual modules the custom entry imports (server/room/entry.ts)
declare module '#nitro-internal-pollyfills' {}
declare module '#nitro-internal-virtual/public-assets' {
  export function isPublicAssetURL(id: string): boolean
}
