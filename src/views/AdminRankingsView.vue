<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminSettingsApi } from '@/api/admin/settings'
import { useUiStore } from '@/stores/ui.store'
import AppSpinner from '@/components/common/AppSpinner.vue'
import type { RankingSettings } from '@/types'

const ui = useUiStore()
const qc = useQueryClient()

const { data, isLoading } = useQuery({
  queryKey: ['admin-ranking-settings'],
  queryFn: () => adminSettingsApi.getRankingSettings().then((r) => r.data.data),
})

const form = ref<RankingSettings>({ userRatingWeight: 0.5, googleRatingWeight: 0.3, reviewCountWeight: 0.2 })

watch(data, (v) => { if (v) form.value = { ...v } }, { immediate: true })

const total = () => form.value.userRatingWeight + form.value.googleRatingWeight + form.value.reviewCountWeight

const { mutate: save, isPending: saving } = useMutation({
  mutationFn: () => adminSettingsApi.updateRankingSettings(form.value),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-ranking-settings'] }); ui.toast.success('排名設定已儲存') },
  onError: () => ui.toast.error('儲存失敗'),
})
</script>

<template>
  <div class="max-w-lg">
    <h1 class="page-title mb-6">排名設定</h1>

    <AppSpinner v-if="isLoading" />

    <form v-else class="card p-6 space-y-5" @submit.prevent="save()">
      <p class="text-xs text-site-gray-lighter">設定綜合排名演算法的各項權重（建議三項加總為 1.0）</p>

      <div v-for="field in [
        { key: 'userRatingWeight', label: '用戶評分權重' },
        { key: 'googleRatingWeight', label: 'Google 評分權重' },
        { key: 'reviewCountWeight', label: '評論數量權重' },
      ]" :key="field.key">
        <label class="block text-xs text-site-gray-lighter mb-1">{{ field.label }}</label>
        <input
          v-model.number="form[field.key as keyof RankingSettings]"
          type="number"
          step="0.05"
          min="0"
          max="1"
          class="input-field w-32"
        />
      </div>

      <p class="text-xs font-mono" :class="Math.abs(total() - 1) < 0.01 ? 'text-green-400' : 'text-red-light'">
        權重總和：{{ total().toFixed(2) }}
        {{ Math.abs(total() - 1) < 0.01 ? '✓' : '（建議等於 1.0）' }}
      </p>

      <button type="submit" class="btn-primary" :disabled="saving">
        <span v-if="saving" class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
        <span v-else>儲存設定</span>
      </button>
    </form>
  </div>
</template>
