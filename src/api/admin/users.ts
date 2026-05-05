import { apiClient } from '../client'
import type { ApiResponse, PagedResult, AdminUser, UserRole } from '@/types'

export const adminUsersApi = {
  getList: (params: { page?: number; limit?: number; search?: string; role?: string } = {}) =>
    apiClient.get<ApiResponse<PagedResult<AdminUser>>>('/api/admin/users', { params }),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/admin/users/${id}`),

  updateRole: (id: string, role: UserRole) =>
    apiClient.put<ApiResponse<null>>(`/api/admin/users/${id}/role`, { role }),

  updateStatus: (id: string, isActive: boolean) =>
    apiClient.put<ApiResponse<null>>(`/api/admin/users/${id}/status`, { isActive }),

  setVip: (id: string, isVip: boolean, expiryDays?: number) =>
    apiClient.put<ApiResponse<null>>(`/api/admin/users/${id}/vip`, { isVip, expiryDays }),

  adjustExperience: (id: string, delta: number, reason: string) =>
    apiClient.put<ApiResponse<null>>(`/api/admin/users/${id}/experience`, { delta, reason }),
}
