<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminSettingsApi } from '@/api/admin/settings'
import { useUiStore } from '@/stores/ui.store'
import AppSpinner from '@/components/common/AppSpinner.vue'
import type { PermissionSettings } from '@/types'

const ui = useUiStore()
const qc = useQueryClient()

const { data, isLoading } = useQuery({
  queryKey: ['admin-permission-settings'],
  queryFn: () => adminSettingsApi.getPermissions().then((r) => r.data.data),
})

const form = ref<PermissionSettings>({ minLevelToReview: 1, minLevelToSubmitShop: 2, minLevelToFavorite: 1 })

watch(data, (v) => { if (v) form.value = { ...v } }, { immediate: true })

const { mutate: save, isPending: saving } = useMutation({
  mutationFn: () => adminSettingsApi.updatePermissions(form.value),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-permission-settings'] }); ui.toast.success('設定已儲存') },
  onError: () => ui.toast.error('儲存失敗'),
})
</script>

<template>
  <div class="max-w-lg">
    <h1 class="page-title mb-6">權限設定</h1>

    <AppSpinner v-if="isLoading" />

    <form v-else class="card p-6 space-y-5" @submit.prevent="save()">
      <p class="text-xs text-site-gray-lighter">設定各功能所需的最低等級（等級 = XP / 100 + 1）</p>

      <div v-for="field in [
        { key: 'minLevelToReview', label: '撰寫評論最低等級' },
        { key: 'minLevelToSubmitShop', label: '提案店家最低等級' },
        { key: 'minLevelToFavorite', label: '加入收藏最低等級' },
      ]" :key="field.key">
        <label class="block text-xs text-site-gray-lighter mb-1">{{ field.label }}</label>
        <input
          v-model.number="form[field.key as keyof PermissionSettings]"
          type="number"
          min="1"
          max="100"
          class="input-field w-32"
        />
      </div>

      <button type="submit" class="btn-primary" :disabled="saving">
        <span v-if="saving" class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
        <span v-else>儲存設定</span>
      </button>
    </form>
  </div>
</template>
