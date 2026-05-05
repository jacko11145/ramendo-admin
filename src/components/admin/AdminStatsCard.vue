<script setup lang="ts">
defineProps<{ label: string; value: string | number; sub?: string; accent?: boolean }>()
</script>

<template>
  <div class="card p-5">
    <p class="text-xs font-mono text-site-gray-lighter uppercase tracking-wider mb-2">{{ label }}</p>
    <p class="font-bebas text-4xl" :class="accent ? 'text-red' : 'text-cream'">{{ value }}</p>
    <p v-if="sub" class="text-xs text-site-gray-lighter mt-1">{{ sub }}</p>
  </div>
</template>
