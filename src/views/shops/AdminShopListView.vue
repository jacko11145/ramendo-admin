<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminShopsApi } from '@/api/admin/shops'
import { useUiStore } from '@/stores/ui.store'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppPagination from '@/components/common/AppPagination.vue'

const ui = useUiStore()
const qc = useQueryClient()
const page = ref(1)
const search = ref('')

const { data, isLoading } = useQuery({
  queryKey: ['admin-shops', page, search],
  queryFn: () => adminShopsApi.getList({ page: page.value, limit: 20, search: search.value || undefined }).then((r) => r.data.data),
})

const { mutate: deleteShop, isPending: deleting } = useMutation({
  mutationFn: (guid: string) => adminShopsApi.delete(guid),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-shops'] })
    ui.toast.success('已刪除店家')
  },
  onError: () => ui.toast.error('刪除失敗'),
})

function confirmDelete(guid: string, name: string) {
  if (confirm(`確定要刪除「${name}」嗎？此操作無法復原。`)) deleteShop(guid)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">店家管理</h1>
      <RouterLink to="/shops/create" class="btn-primary">+ 新增店家</RouterLink>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input v-model="search" class="input-field max-w-xs" placeholder="搜尋店家名稱..." @input="page = 1" />
    </div>

    <AppSpinner v-if="isLoading" />

    <template v-else>
      <div class="card overflow-hidden mb-4">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header text-left">店家</th>
              <th class="table-header text-left">城市/區域</th>
              <th class="table-header text-center">評分</th>
              <th class="table-header text-center">評論</th>
              <th class="table-header text-center">狀態</th>
              <th class="table-header text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="shop in data?.items" :key="shop.id" class="hover:bg-ink/50 transition-colors">
              <td class="table-cell">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-site-gray overflow-hidden shrink-0">
                    <img v-if="shop.coverImage" :src="shop.coverImage" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="font-bebas tracking-wide">{{ shop.name }}</p>
                    <p class="text-xs text-site-gray-lighter">{{ shop.types.slice(0, 2).join('・') }}</p>
                  </div>
                </div>
              </td>
              <td class="table-cell text-site-gray-lighter">{{ shop.city }} {{ shop.district }}</td>
              <td class="table-cell text-center font-mono text-sm">{{ shop.rating?.toFixed(1) ?? '—' }}</td>
              <td class="table-cell text-center text-site-gray-lighter">{{ shop.reviewCount }}</td>
              <td class="table-cell text-center">
                <span class="badge" :class="shop.isVerified ? 'bg-green-900/50 text-green-300' : 'bg-site-gray text-cream-dark'">
                  {{ shop.isVerified ? '已認證' : '未認證' }}
                </span>
              </td>
              <td class="table-cell text-right">
                <div class="flex justify-end gap-2">
                  <RouterLink :to="`/shops/${shop.id}/edit`" class="btn-ghost text-xs px-2 py-1">編輯</RouterLink>
                  <button class="btn-danger text-xs px-2 py-1" :disabled="deleting" @click="confirmDelete(shop.id, shop.name)">刪除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!data?.items.length">
              <td colspan="6" class="table-cell text-center text-site-gray-lighter py-8">無店家資料</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination
        v-if="data"
        :total="data.total"
        :page="page"
        :limit="20"
        @update:page="page = $event"
      />
    </template>
  </div>
</template>
