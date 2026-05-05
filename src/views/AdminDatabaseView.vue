<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { adminSettingsApi } from '@/api/admin/settings'
import AppSpinner from '@/components/common/AppSpinner.vue'

const { data, isLoading, refetch } = useQuery({
  queryKey: ['admin-database-stats'],
  queryFn: () => adminSettingsApi.getDatabaseStats().then((r) => r.data.data),
})

const total = () => data.value?.reduce((acc, t) => acc + t.rowCount, 0) ?? 0
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">資料庫統計</h1>
      <button class="btn-ghost text-sm" @click="refetch()">重新整理</button>
    </div>

    <AppSpinner v-if="isLoading" />

    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header text-left">資料表</th>
            <th class="table-header text-right">資料筆數</th>
            <th class="table-header text-right">大小 (KB)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in data" :key="t.tableName" class="hover:bg-ink/50 transition-colors">
            <td class="table-cell font-mono text-sm">{{ t.tableName }}</td>
            <td class="table-cell text-right font-mono text-cream">{{ t.rowCount.toLocaleString() }}</td>
            <td class="table-cell text-right font-mono text-site-gray-lighter">{{ t.sizeKb.toLocaleString() }}</td>
          </tr>
          <tr class="border-t-2 border-site-gray">
            <td class="table-cell font-mono text-sm text-site-gray-lighter">總計</td>
            <td class="table-cell text-right font-mono text-cream font-bold">{{ total().toLocaleString() }}</td>
            <td class="table-cell" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
