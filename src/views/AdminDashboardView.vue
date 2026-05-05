<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { adminSettingsApi } from '@/api/admin/settings'
import AdminStatsCard from '@/components/admin/AdminStatsCard.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

const { data, isLoading } = useQuery({
  queryKey: ['admin-dashboard'],
  queryFn: () => adminSettingsApi.getDashboardStats().then((r) => r.data.data),
})
</script>

<template>
  <div>
    <div class="mb-6">
      <p class="text-[10px] font-mono text-site-gray-lighter tracking-widest uppercase">Dashboard</p>
      <h1 class="page-title">儀表板</h1>
    </div>

    <AppSpinner v-if="isLoading" />

    <div v-else-if="data" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminStatsCard label="總用戶數" :value="data.totalUsers" />
      <AdminStatsCard label="總店家數" :value="data.totalShops" />
      <AdminStatsCard label="總評論數" :value="data.totalReviews" />
      <AdminStatsCard label="待審提案" :value="data.pendingSubmissions" accent />
      <AdminStatsCard label="本月新用戶" :value="data.newUsersThisMonth" :sub="`有效邀請碼 ${data.activeInvitationCodes} 組`" />
      <AdminStatsCard label="本月新評論" :value="data.newReviewsThisMonth" />
    </div>
  </div>
</template>
