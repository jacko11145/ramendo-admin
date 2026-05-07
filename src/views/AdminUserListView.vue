<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminUsersApi } from '@/api/admin/users'
import { useUiStore } from '@/stores/ui.store'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppModal from '@/components/common/AppModal.vue'
import type { AdminUser, UserRole } from '@/types'

const ui = useUiStore()
const qc = useQueryClient()
const page = ref(1)
const search = ref('')
const selectedRole = ref('')
const editUser = ref<AdminUser | null>(null)
const expDelta = ref(0)
const expReason = ref('')

const { data, isLoading } = useQuery({
  queryKey: ['admin-users', page, search, selectedRole],
  queryFn: () => adminUsersApi.getList({
    page: page.value, limit: 20,
    search: search.value || undefined,
    role: selectedRole.value || undefined,
  }).then((r) => r.data.data),
})

const { mutate: updateRole } = useMutation({
  mutationFn: ({ id, role }: { id: string; role: UserRole }) => adminUsersApi.updateRole(id, role),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); ui.toast.success('角色已更新') },
  onError: () => ui.toast.error('更新失敗'),
})

const { mutate: toggleStatus } = useMutation({
  mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminUsersApi.updateStatus(id, isActive),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); ui.toast.success('狀態已更新') },
  onError: () => ui.toast.error('更新失敗'),
})

const { mutate: adjustExp, isPending: adjusting } = useMutation({
  mutationFn: ({ id, delta, reason }: { id: string; delta: number; reason: string }) =>
    adminUsersApi.adjustExperience(id, delta, reason),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-users'] })
    ui.toast.success('經驗值已調整')
    editUser.value = null
  },
  onError: () => ui.toast.error('調整失敗'),
})

const ROLES: UserRole[] = ['Admin', 'ShopOwner', 'VIP', 'User']
const ROLE_COLORS: Record<UserRole, string> = {
  Admin: 'bg-red/20 text-red-light',
  ShopOwner: 'bg-blue-900/50 text-blue-300',
  VIP: 'bg-yellow-900/50 text-yellow-300',
  User: 'bg-site-gray text-cream-dark',
}
</script>

<template>
  <div>
    <div class="mb-6">
      <p class="text-[10px] font-mono text-site-gray-lighter tracking-widest uppercase">User Management</p>
      <h1 class="page-title">用戶管理</h1>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4 flex-wrap">
      <input v-model="search" class="input-field w-56" placeholder="搜尋 Email / 暱稱..." @input="page = 1" />
      <select v-model="selectedRole" class="input-field w-36" @change="page = 1">
        <option value="">全部角色</option>
        <option v-for="r in ROLES" :key="r" :value="r">{{ r }}</option>
      </select>
    </div>

    <AppSpinner v-if="isLoading" />

    <template v-else>
      <div class="card overflow-hidden mb-4">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header text-left">用戶</th>
              <th class="table-header text-left">角色</th>
              <th class="table-header text-center">等級</th>
              <th class="table-header text-center">評論</th>
              <th class="table-header text-center">狀態</th>
              <th class="table-header text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in data?.items" :key="u.id" class="hover:bg-ink/50 transition-colors">
              <td class="table-cell">
                <p class="text-sm">{{ u.name ?? '—' }}</p>
                <p class="text-xs text-site-gray-lighter font-mono">{{ u.email }}</p>
              </td>
              <td class="table-cell">
                <select
                  :value="u.role"
                  class="input-field text-sm py-1 px-2 w-32"
                  :class="ROLE_COLORS[u.role]"
                  @change="updateRole({ id: u.id, role: ($event.target as HTMLSelectElement).value as UserRole })"
                >
                  <option v-for="r in ROLES" :key="r" :value="r">{{ r }}</option>
                </select>
              </td>
              <td class="table-cell text-center font-mono text-sm">Lv.{{ u.level }}</td>
              <td class="table-cell text-center text-site-gray-lighter">{{ u.reviewCount }}</td>
              <td class="table-cell text-center">
                <button
                  class="badge cursor-pointer transition-colors"
                  :class="u.isActive ? 'bg-green-900/50 text-green-300' : 'bg-red/20 text-red-light'"
                  @click="toggleStatus({ id: u.id, isActive: !u.isActive })"
                >
                  {{ u.isActive ? '正常' : '停用' }}
                </button>
              </td>
              <td class="table-cell text-right">
                <button class="btn-ghost text-xs px-2 py-1" @click="editUser = u; expDelta = 0; expReason = ''">調整經驗</button>
              </td>
            </tr>
            <tr v-if="!data?.items.length">
              <td colspan="6" class="table-cell text-center text-site-gray-lighter py-8">無用戶資料</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination v-if="data" :total="data.total" :page="page" :limit="20" @update:page="page = $event" />
    </template>

    <!-- Adjust XP Modal -->
    <AppModal v-if="editUser" :title="`調整 ${editUser.name ?? editUser.email} 的經驗值`" @close="editUser = null">
      <div class="space-y-4">
        <p class="text-sm text-site-gray-lighter">目前：{{ editUser.experiencePoints }} XP (Lv.{{ editUser.level }})</p>
        <div>
          <label class="block text-xs text-site-gray-lighter mb-1">調整值（正數增加，負數扣除）</label>
          <input v-model.number="expDelta" type="number" class="input-field" placeholder="例：50 或 -20" />
        </div>
        <div>
          <label class="block text-xs text-site-gray-lighter mb-1">原因</label>
          <input v-model="expReason" class="input-field" placeholder="管理員手動調整" />
        </div>
        <div class="flex gap-3 justify-end">
          <button class="btn-ghost" @click="editUser = null">取消</button>
          <button
            class="btn-primary"
            :disabled="!expDelta || !expReason || adjusting"
            @click="adjustExp({ id: editUser!.id, delta: expDelta, reason: expReason })"
          >
            確認調整
          </button>
        </div>
      </div>
    </AppModal>
  </div>
</template>
