import axios, { type AxiosInstance } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminAccessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing: Promise<string> | null = null

apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status !== 401 || original._retry) return Promise.reject(err)
    original._retry = true

    try {
      if (!refreshing) {
        refreshing = (async () => {
          const refreshToken = localStorage.getItem('adminRefreshToken')
          if (!refreshToken) throw new Error('No refresh token')
          const res = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken })
          const { accessToken, refreshToken: newRefresh } = res.data.data
          localStorage.setItem('adminAccessToken', accessToken)
          localStorage.setItem('adminRefreshToken', newRefresh)
          return accessToken
        })()
      }
      const accessToken = await refreshing
      original.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(original)
    } catch {
      localStorage.removeItem('adminAccessToken')
      localStorage.removeItem('adminRefreshToken')
      window.dispatchEvent(new Event('auth:expired'))
      return Promise.reject(err)
    } finally {
      refreshing = null
    }
  },
)
