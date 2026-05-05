import { apiClient } from '../client'
import type { ApiResponse, PagedResult, AdminSubmission } from '@/types'

export const adminSubmissionsApi = {
  getList: (params: { page?: number; limit?: number; status?: string } = {}) =>
    apiClient.get<ApiResponse<PagedResult<AdminSubmission>>>('/api/admin/submissions', { params }),

  approve: (id: string) =>
    apiClient.put<ApiResponse<null>>(`/api/admin/submissions/${id}/approve`),

  reject: (id: string, reason: string) =>
    apiClient.put<ApiResponse<null>>(`/api/admin/submissions/${id}/reject`, { reason }),
}
