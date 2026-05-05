<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui.store'

const { toasts } = storeToRefs(useUiStore())
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[10000] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="px-4 py-3 rounded shadow-lg text-sm pointer-events-auto"
          :class="{
            'bg-green-800 text-green-100': t.type === 'success',
            'bg-red text-white': t.type === 'error',
            'bg-site-gray text-cream': t.type === 'info',
          }"
        >
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>
