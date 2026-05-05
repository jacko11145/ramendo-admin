import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 0

  function showToast(type: Toast['type'], message: string, duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, type, message })
    setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id) }, duration)
  }

  const toast = {
    success: (msg: string) => showToast('success', msg),
    error: (msg: string) => showToast('error', msg),
    info: (msg: string) => showToast('info', msg),
  }

  return { toasts, toast }
})
