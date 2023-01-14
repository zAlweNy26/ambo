<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@components/Header.vue'
import Footer from '@components/Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen transition-colors selection:bg-secondary-focus bg-base-100 scroll-smooth">
    <Header />
    <main class="flex flex-col items-center p-4 text-neutral grow">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
