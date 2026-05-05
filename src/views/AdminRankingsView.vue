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

const form = ref<RankingSettings>({
  allowUser: true,
  allowGoogle: true,
  allowCombined: true,
  defaultType: 'user',
  userWeight: 1.0,
  googleWeight: 0.8,
  displayLimit: 20,
  minReviews: 5,
  minRating: 3.5,
  mustBeVerified: true,
})

watch(data, (v) => { if (v) form.value = { ...v } }, { immediate: true })

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

    <form v-else class="space-y-4" @submit.prevent="save()">

      <!-- 允許排名類型 -->
      <div class="card p-6 space-y-3">
        <h2 class="text-sm font-semibold text-site-cream">允許排名類型</h2>
        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="form.allowUser" type="checkbox" class="w-4 h-4 accent-red" />
          <span class="text-sm text-site-gray-lighter">用戶評分排行</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="form.allowGoogle" type="checkbox" class="w-4 h-4 accent-red" />
          <span class="text-sm text-site-gray-lighter">Google 評分排行</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="form.allowCombined" type="checkbox" class="w-4 h-4 accent-red" />
          <span class="text-sm text-site-gray-lighter">綜合評分排行</span>
        </label>
      </div>

      <!-- 預設排名類型 -->
      <div class="card p-6 space-y-3">
        <h2 class="text-sm font-semibold text-site-cream">預設排名類型</h2>
        <select v-model="form.defaultType" class="input-field w-48">
          <option value="user">用戶評分</option>
          <option value="google">Google 評分</option>
          <option value="combined">綜合評分</option>
        </select>
      </div>

      <!-- 綜合分數權重 -->
      <div class="card p-6 space-y-3">
        <h2 class="text-sm font-semibold text-site-cream">綜合分數權重</h2>
        <p class="text-xs text-site-gray-lighter">僅影響「綜合評分」排行的計算</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">用戶評分權重</label>
            <input v-model.number="form.userWeight" type="number" step="0.05" min="0" max="1" class="input-field w-full" />
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">Google 評分權重</label>
            <input v-model.number="form.googleWeight" type="number" step="0.05" min="0" max="1" class="input-field w-full" />
          </div>
        </div>
      </div>

      <!-- 篩選條件 -->
      <div class="card p-6 space-y-3">
        <h2 class="text-sm font-semibold text-site-cream">篩選條件</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">最多顯示幾間</label>
            <input v-model.number="form.displayLimit" type="number" min="1" max="100" class="input-field w-full" />
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">最低評論數</label>
            <input v-model.number="form.minReviews" type="number" min="0" class="input-field w-full" />
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">最低評分</label>
            <input v-model.number="form.minRating" type="number" step="0.1" min="0" max="5" class="input-field w-full" />
          </div>
        </div>
        <label class="flex items-center gap-3 cursor-pointer pt-1">
          <input v-model="form.mustBeVerified" type="checkbox" class="w-4 h-4 accent-red" />
          <span class="text-sm text-site-gray-lighter">僅顯示已驗證店家</span>
        </label>
      </div>

      <button type="submit" class="btn-primary w-full" :disabled="saving">
        <span v-if="saving" class="inline-block w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
        <span v-else>儲存設定</span>
      </button>

    </form>
  </div>
</template>
