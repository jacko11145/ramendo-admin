import { apiClient } from '../client'
import type { ApiResponse, InvitationCode } from '@/types'

export const adminInvitationCodesApi = {
  getList: () =>
    apiClient.get<ApiResponse<InvitationCode[]>>('/api/admin/invitation-codes'),

  create: (data: { maxUses?: number; expiresAt?: string }) =>
    apiClient.post<ApiResponse<InvitationCode>>('/api/admin/invitation-codes', data),

  toggle: (code: string) =>
    apiClient.patch<ApiResponse<null>>(`/api/admin/invitation-codes/${code}/toggle`),

  delete: (code: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/admin/invitation-codes/${code}`),
}
