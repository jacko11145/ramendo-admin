import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { UserSession } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserSession | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('adminAccessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('adminRefreshToken'))

  const isLoggedIn = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('adminAccessToken', access)
    localStorage.setItem('adminRefreshToken', refresh)
  }

  function clearAuth() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
  }

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password })
    const data = res.data.data!
    if (data.user.role !== 'Admin') throw new Error('無管理員權限')
    setTokens(data.accessToken, data.refreshToken)
    user.value = data.user
  }

  async function logout() {
    if (refreshToken.value) {
      await authApi.logout(refreshToken.value).catch(() => {})
    }
    clearAuth()
  }

  async function fetchMe() {
    if (!accessToken.value) return
    const res = await authApi.me()
    const u = res.data.data
    if (!u || u.role !== 'Admin') throw new Error('無管理員權限')
    user.value = u
  }

  return { user, accessToken, isLoggedIn, isAdmin, login, logout, fetchMe, clearAuth }
})
