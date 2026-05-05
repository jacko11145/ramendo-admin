import { apiClient } from '../client'
import type { ApiResponse, PagedResult, AdminReview } from '@/types'

export const adminReviewsApi = {
  getList: (params: { page?: number; limit?: number; shopGuid?: string } = {}) =>
    apiClient.get<ApiResponse<PagedResult<AdminReview>>>('/api/admin/reviews', { params }),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/admin/reviews/${id}`),
}
