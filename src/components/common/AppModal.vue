<script setup lang="ts">
defineProps<{ title?: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="card w-full max-w-lg mx-4 p-6 relative">
        <button
          class="absolute top-4 right-4 text-site-gray-lighter hover:text-cream transition-colors"
          @click="emit('close')"
        >
          ✕
        </button>
        <h3 v-if="title" class="font-bebas text-2xl tracking-wider mb-4 text-cream">{{ title }}</h3>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
