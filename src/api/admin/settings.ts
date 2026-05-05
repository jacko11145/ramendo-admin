import { apiClient } from '../client'
import type { ApiResponse, PermissionSettings, RankingSettings, DashboardStats, TableStats } from '@/types'

export const adminSettingsApi = {
  getPermissions: () =>
    apiClient.get<ApiResponse<PermissionSettings>>('/api/admin/settings/permissions'),

  updatePermissions: (data: PermissionSettings) =>
    apiClient.put<ApiResponse<null>>('/api/admin/settings/permissions', data),

  getRankingSettings: () =>
    apiClient.get<ApiResponse<RankingSettings>>('/api/admin/rankings/settings'),

  updateRankingSettings: (data: RankingSettings) =>
    apiClient.put<ApiResponse<null>>('/api/admin/rankings/settings', data),

  getDashboardStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/api/admin/dashboard/stats'),

  getDatabaseStats: () =>
    apiClient.get<ApiResponse<TableStats[]>>('/api/admin/database/stats'),
}
