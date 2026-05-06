<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: unknown) {
    const msg = (e as { message?: string; response?: { data?: { message?: string } } })
    error.value = msg?.response?.data?.message ?? msg?.message ?? '登入失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-ink flex items-center justify-center px-4">
    <div class="card w-full max-w-sm p-8">
      <div class="text-center mb-8">
        <p class="font-bebas text-4xl tracking-widest text-cream"><span class="bg-red text-white px-1">拉</span>麵道</p>
        <p class="text-xs font-mono text-site-gray-lighter mt-1">管理系統</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs text-site-gray-lighter mb-1">Email</label>
          <input v-model="email" type="email" class="input-field" placeholder="admin@ramendo.com" required />
        </div>
        <div>
          <label class="block text-xs text-site-gray-lighter mb-1">密碼</label>
          <input v-model="password" type="password" class="input-field" placeholder="••••••••" required />
        </div>
        <p v-if="error" class="text-red-light text-xs">{{ error }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <span v-if="loading" class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
          <span v-else>登入</span>
        </button>
      </form>
    </div>
  </div>
</template>
