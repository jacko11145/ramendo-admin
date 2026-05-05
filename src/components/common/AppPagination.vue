<script setup lang="ts">
import { computed, toRefs } from 'vue'

const props = defineProps<{ total: number; page: number; limit: number }>()
const emit = defineEmits<{ (e: 'update:page', page: number): void }>()

const { total, page, limit } = toRefs(props)
const totalPages = computed(() => Math.ceil(total.value / limit.value))
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center gap-2 text-sm">
    <span class="text-site-gray-lighter">第 {{ page }} / {{ totalPages }} 頁，共 {{ total }} 筆</span>
    <div class="flex gap-1 ml-auto">
      <button
        class="btn-ghost px-2 py-1 text-xs"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      >
        ‹ 上一頁
      </button>
      <button
        class="btn-ghost px-2 py-1 text-xs"
        :disabled="page >= totalPages"
        @click="emit('update:page', page + 1)"
      >
        下一頁 ›
      </button>
    </div>
  </div>
</template>
