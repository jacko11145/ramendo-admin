import { apiClient } from './client'
import type { ApiResponse, AuthTokens, UserSession } from '@/types'

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthTokens>>('/api/auth/login', data),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/api/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    apiClient.post<ApiResponse<null>>('/api/auth/logout', { refreshToken }),

  me: () =>
    apiClient.get<ApiResponse<UserSession>>('/api/auth/me'),
}
