<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminInvitationCodesApi } from '@/api/admin/invitationCodes'
import { useUiStore } from '@/stores/ui.store'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppModal from '@/components/common/AppModal.vue'

const ui = useUiStore()
const qc = useQueryClient()
const showCreate = ref(false)
const newMaxUses = ref<number | undefined>(undefined)
const newExpiresAt = ref('')

const { data, isLoading } = useQuery({
  queryKey: ['admin-invitation-codes'],
  queryFn: () => adminInvitationCodesApi.getList().then((r) => r.data.data),
})

const { mutate: create, isPending: creating } = useMutation({
  mutationFn: () => adminInvitationCodesApi.create({
    maxUses: newMaxUses.value,
    expiresAt: newExpiresAt.value || undefined,
  }),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-invitation-codes'] })
    ui.toast.success('邀請碼已建立')
    showCreate.value = false
    newMaxUses.value = undefined
    newExpiresAt.value = ''
  },
  onError: () => ui.toast.error('建立失敗'),
})

const { mutate: toggle } = useMutation({
  mutationFn: (code: string) => adminInvitationCodesApi.toggle(code),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-invitation-codes'] }); ui.toast.success('狀態已更新') },
  onError: () => ui.toast.error('更新失敗'),
})

const { mutate: deleteCode, isPending: deleting } = useMutation({
  mutationFn: (code: string) => adminInvitationCodesApi.delete(code),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-invitation-codes'] }); ui.toast.success('已刪除') },
  onError: () => ui.toast.error('刪除失敗'),
})

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
  ui.toast.info(`已複製：${code}`)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">邀請碼管理</h1>
      <button class="btn-primary" @click="showCreate = true">+ 產生邀請碼</button>
    </div>

    <AppSpinner v-if="isLoading" />

    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header text-left">邀請碼</th>
            <th class="table-header text-center">使用次數</th>
            <th class="table-header text-center">到期日</th>
            <th class="table-header text-center">狀態</th>
            <th class="table-header text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in data" :key="c.code" class="hover:bg-ink/50 transition-colors">
            <td class="table-cell">
              <div class="flex items-center gap-2">
                <span class="font-mono text-sm text-cream">{{ c.code }}</span>
                <button class="text-site-gray-lighter hover:text-cream text-xs" @click="copyCode(c.code)">⊕</button>
              </div>
              <p class="text-xs text-site-gray-lighter">建立者：{{ c.createdByName }}</p>
            </td>
            <td class="table-cell text-center font-mono text-sm">
              {{ c.usedCount }}{{ c.maxUses ? ` / ${c.maxUses}` : ' / ∞' }}
            </td>
            <td class="table-cell text-center text-xs font-mono text-site-gray-lighter">
              {{ c.expiresAt ? c.expiresAt.slice(0, 10) : '無限期' }}
            </td>
            <td class="table-cell text-center">
              <button
                class="badge cursor-pointer"
                :class="c.isActive ? 'bg-green-900/50 text-green-300' : 'bg-site-gray text-cream-dark'"
                @click="toggle(c.code)"
              >
                {{ c.isActive ? '啟用' : '停用' }}
              </button>
            </td>
            <td class="table-cell text-right">
              <button class="btn-danger text-xs px-2 py-1" :disabled="deleting" @click="deleteCode(c.code)">刪除</button>
            </td>
          </tr>
          <tr v-if="!data?.length">
            <td colspan="5" class="table-cell text-center text-site-gray-lighter py-8">無邀請碼</td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal v-if="showCreate" title="產生邀請碼" @close="showCreate = false">
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-site-gray-lighter mb-1">最大使用次數（留空表示無限）</label>
          <input v-model.number="newMaxUses" type="number" min="1" class="input-field" placeholder="例：10" />
        </div>
        <div>
          <label class="block text-xs text-site-gray-lighter mb-1">到期日（留空表示無限期）</label>
          <input v-model="newExpiresAt" type="date" class="input-field" />
        </div>
        <div class="flex gap-3 justify-end">
          <button class="btn-ghost" @click="showCreate = false">取消</button>
          <button class="btn-primary" :disabled="creating" @click="create()">產生</button>
        </div>
      </div>
    </AppModal>
  </div>
</template>
