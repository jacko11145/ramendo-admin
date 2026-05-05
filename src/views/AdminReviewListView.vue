<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminReviewsApi } from '@/api/admin/reviews'
import { useUiStore } from '@/stores/ui.store'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppPagination from '@/components/common/AppPagination.vue'

const ui = useUiStore()
const qc = useQueryClient()
const page = ref(1)

const { data, isLoading } = useQuery({
  queryKey: ['admin-reviews', page],
  queryFn: () => adminReviewsApi.getList({ page: page.value, limit: 20 }).then((r) => r.data.data),
})

const { mutate: deleteReview, isPending: deleting } = useMutation({
  mutationFn: (id: string) => adminReviewsApi.delete(id),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); ui.toast.success('評論已刪除') },
  onError: () => ui.toast.error('刪除失敗'),
})

function confirmDelete(id: string) {
  if (confirm('確定要刪除此評論？')) deleteReview(id)
}
</script>

<template>
  <div>
    <h1 class="page-title mb-6">評論管理</h1>

    <AppSpinner v-if="isLoading" />

    <template v-else>
      <div class="card overflow-hidden mb-4">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header text-left">店家</th>
              <th class="table-header text-left">用戶</th>
              <th class="table-header text-center">評分</th>
              <th class="table-header text-left">留言</th>
              <th class="table-header text-center">日期</th>
              <th class="table-header text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in data?.items" :key="r.id" class="hover:bg-ink/50 transition-colors">
              <td class="table-cell text-sm">{{ r.shopName }}</td>
              <td class="table-cell text-sm text-site-gray-lighter">{{ r.userName }}</td>
              <td class="table-cell text-center font-mono">★ {{ r.rating }}</td>
              <td class="table-cell text-sm text-site-gray-lighter max-w-xs truncate">{{ r.comment ?? '—' }}</td>
              <td class="table-cell text-center text-xs font-mono text-site-gray-lighter">{{ r.visitDate }}</td>
              <td class="table-cell text-right">
                <button class="btn-danger text-xs px-2 py-1" :disabled="deleting" @click="confirmDelete(r.id)">刪除</button>
              </td>
            </tr>
            <tr v-if="!data?.items.length">
              <td colspan="6" class="table-cell text-center text-site-gray-lighter py-8">無評論資料</td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppPagination v-if="data" :total="data.total" :page="page" :limit="20" @update:page="page = $event" />
    </template>
  </div>
</template>
