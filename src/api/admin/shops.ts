import { apiClient } from '../client'
import type { ApiResponse, PagedResult, AdminShop, CreateUpdateShopDto, MenuItem } from '@/types'

export const adminShopsApi = {
  getList: (params: { page?: number; limit?: number; search?: string } = {}) =>
    apiClient.get<ApiResponse<PagedResult<AdminShop>>>('/api/admin/shops', { params }),

  getByGuid: (guid: string) =>
    apiClient.get<ApiResponse<AdminShop>>(`/api/admin/shops/${guid}`),

  create: (data: CreateUpdateShopDto) =>
    apiClient.post<ApiResponse<AdminShop>>('/api/admin/shops', data),

  update: (guid: string, data: CreateUpdateShopDto) =>
    apiClient.put<ApiResponse<AdminShop>>(`/api/admin/shops/${guid}`, data),

  delete: (guid: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/admin/shops/${guid}`),

  uploadCover: (guid: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post<ApiResponse<{ url: string }>>(`/api/admin/shops/${guid}/cover-image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  addMenuItem: (guid: string, data: Omit<MenuItem, 'id' | 'optionGroups'>) =>
    apiClient.post<ApiResponse<string>>(`/api/admin/shops/${guid}/menu`, data),

  reorderMenuItems: (guid: string, order: Array<{ id: string; position: number }>) =>
    apiClient.put<ApiResponse<null>>(`/api/admin/shops/${guid}/menu/reorder`, { order }),

  deleteMenuItem: (guid: string, itemId: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/admin/shops/${guid}/menu/${itemId}`),
}
