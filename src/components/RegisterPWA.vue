<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue"

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

function close() {
    offlineReady.value = false
    needRefresh.value = false
}

async function updateSW() {
    await updateServiceWorker()
}
</script>

<template>
    <div v-if="offlineReady || needRefresh" 
        class="flex flex-wrap bg-primary items-center justify-center p-2 text-base-100 font-medium gap-4" role="alert">
        <div class="text-center">
            <span v-if="offlineReady">App pronta per funzionare offline</span>
            <span v-else>L'app può essere aggiornata, per favore clicca 'Aggiorna'.</span>
        </div>
        <div class="flex gap-2">
            <button v-if="needRefresh" @click="updateSW()" class="btn btn-xs btn-success">
                Aggiorna
            </button>
            <button @click="close()" class="btn btn-xs btn-error">
                Chiudi
            </button>
        </div>
    </div>
</template>