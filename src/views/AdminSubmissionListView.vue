<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminSubmissionsApi } from '@/api/admin/submissions'
import { useUiStore } from '@/stores/ui.store'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppModal from '@/components/common/AppModal.vue'
import type { AdminSubmission } from '@/types'

const ui = useUiStore()
const qc = useQueryClient()
const page = ref(1)
const statusFilter = ref('Pending')
const rejectTarget = ref<AdminSubmission | null>(null)
const rejectReason = ref('')

const { data, isLoading } = useQuery({
  queryKey: ['admin-submissions', page, statusFilter],
  queryFn: () => adminSubmissionsApi.getList({
    page: page.value, limit: 20, status: statusFilter.value || undefined,
  }).then((r) => r.data.data),
})

const { mutate: approve, isPending: approving } = useMutation({
  mutationFn: (id: string) => adminSubmissionsApi.approve(id),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-submissions'] }); ui.toast.success('已核准提案') },
  onError: () => ui.toast.error('操作失敗'),
})

const { mutate: reject, isPending: rejecting } = useMutation({
  mutationFn: ({ id, reason }: { id: string; reason: string }) => adminSubmissionsApi.reject(id, reason),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-submissions'] })
    ui.toast.success('已拒絕提案')
    rejectTarget.value = null
  },
  onError: () => ui.toast.error('操作失敗'),
})

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-900/50 text-yellow-300',
  Approved: 'bg-green-900/50 text-green-300',
  Rejected: 'bg-red/20 text-red-light',
}
const STATUS_LABELS: Record<string, string> = { Pending: '待審核', Approved: '已通過', Rejected: '已拒絕' }
</script>

<template>
  <div>
    <div class="mb-6">
      <p class="text-[10px] font-mono text-site-gray-lighter tracking-widest uppercase">Submissions</p>
      <h1 class="page-title">提案審核</h1>
    </div>

    <div class="flex gap-2 mb-4">
      <button
        v-for="s in ['Pending', 'Approved', 'Rejected', '']"
        :key="s"
        class="badge cursor-pointer transition-colors"
        :class="statusFilter === s ? 'bg-red text-white' : 'bg-site-gray text-cream-dark hover:bg-site-gray-light'"
        @click="statusFilter = s; page = 1"
      >
        {{ s ? STATUS_LABELS[s] : '全部' }}
      </button>
    </div>

    <AppSpinner v-if="isLoading" />

    <template v-else>
      <div class="space-y-3 mb-4">
        <div v-for="sub in data?.items" :key="sub.id" class="card p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <p class="font-bebas text-lg">{{ sub.shopName }}</p>
                <span class="badge" :class="STATUS_COLORS[sub.status]">{{ STATUS_LABELS[sub.status] }}</span>
              </div>
              <p class="text-xs text-site-gray-lighter">{{ sub.city }} {{ sub.district }} · {{ sub.address }}</p>
              <p class="text-xs text-site-gray-lighter mt-1">提案者：{{ sub.submittedByName }} · {{ sub.submittedAt.slice(0, 10) }}</p>
              <p v-if="sub.note" class="text-sm text-cream-dark mt-2">{{ sub.note }}</p>
              <p v-if="sub.rejectionReason" class="text-xs text-red-light mt-1">拒絕原因：{{ sub.rejectionReason }}</p>
            </div>
            <div v-if="sub.status === 'Pending'" class="flex gap-2 shrink-0">
              <button class="btn-primary text-sm px-3 py-1.5" :disabled="approving" @click="approve(sub.id)">核准</button>
              <button class="btn-danger text-sm px-3 py-1.5" @click="rejectTarget = sub; rejectReason = ''">拒絕</button>
            </div>
          </div>
        </div>
        <p v-if="!data?.items.length" class="text-center py-10 text-site-gray-lighter">無提案資料</p>
      </div>
      <AppPagination v-if="data" :total="data.total" :page="page" :limit="20" @update:page="page = $event" />
    </template>

    <AppModal v-if="rejectTarget" title="拒絕提案" @close="rejectTarget = null">
      <p class="text-sm text-cream-dark mb-4">請輸入拒絕原因（將通知提案者）</p>
      <textarea v-model="rejectReason" class="input-field resize-none h-24 mb-4" placeholder="例：資訊不完整..." />
      <div class="flex gap-3 justify-end">
        <button class="btn-ghost" @click="rejectTarget = null">取消</button>
        <button
          class="btn-danger"
          :disabled="!rejectReason || rejecting"
          @click="reject({ id: rejectTarget!.id, reason: rejectReason })"
        >確認拒絕</button>
      </div>
    </AppModal>
  </div>
</template>
