<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import AppToast from '@/components/common/AppToast.vue'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (auth.accessToken) {
    await auth.fetchMe().catch(() => {
      auth.clearAuth()
      router.push('/login')
    })
  }
  window.addEventListener('auth:expired', handleExpired)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth:expired', handleExpired)
})

function handleExpired() {
  auth.clearAuth()
  router.push('/login')
}
</script>

<template>
  <RouterView />
  <AppToast />
</template>
