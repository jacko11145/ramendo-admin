<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminShopsApi } from '@/api/admin/shops'
import { useUiStore } from '@/stores/ui.store'
import AppSpinner from '@/components/common/AppSpinner.vue'
import type { CreateUpdateShopDto, BusinessHours } from '@/types'

// ─── Image state ─────────────────────────────────────────────────────────────
const shopGuid = computed(() => route.params.guid as string)
const currentCover = ref<string | null>(null)
const currentGallery = ref<string[]>([])
const coverFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const galleryFiles = ref<File[]>([])
const galleryPreviews = ref<string[]>([])
const uploadingCover = ref(false)
const uploadingGallery = ref(false)

function onCoverChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
}

function onGalleryChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  galleryFiles.value = files
  galleryPreviews.value = files.map((f) => URL.createObjectURL(f))
}

async function uploadCover() {
  if (!coverFile.value || !shopGuid.value) return
  uploadingCover.value = true
  try {
    const res = await adminShopsApi.uploadCover(shopGuid.value, coverFile.value)
    currentCover.value = res.data.data ?? null
    coverFile.value = null
    coverPreview.value = null
    ui.toast.success('封面圖片已上傳')
  } catch {
    ui.toast.error('上傳失敗')
  } finally { uploadingCover.value = false }
}

async function removeCover() {
  if (!shopGuid.value) return
  uploadingCover.value = true
  try {
    await adminShopsApi.deleteCover(shopGuid.value)
    currentCover.value = null
    ui.toast.success('封面圖片已刪除')
  } catch {
    ui.toast.error('刪除失敗')
  } finally { uploadingCover.value = false }
}

async function uploadGallery() {
  if (!galleryFiles.value.length || !shopGuid.value) return
  uploadingGallery.value = true
  try {
    const res = await adminShopsApi.uploadGallery(shopGuid.value, galleryFiles.value)
    currentGallery.value = res.data.data ?? []
    galleryFiles.value = []
    galleryPreviews.value = []
    ui.toast.success('圖片已上傳')
  } catch {
    ui.toast.error('上傳失敗')
  } finally { uploadingGallery.value = false }
}

async function removeGalleryImage(url: string) {
  if (!shopGuid.value) return
  try {
    const res = await adminShopsApi.deleteGalleryImage(shopGuid.value, url)
    currentGallery.value = res.data.data ?? []
    ui.toast.success('圖片已刪除')
  } catch {
    ui.toast.error('刪除失敗')
  }
}

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const isEdit = computed(() => !!route.params.guid)
const loading = ref(false)
const saving = ref(false)

const DAYS: { key: keyof BusinessHours; label: string }[] = [
  { key: 'monday', label: '週一' }, { key: 'tuesday', label: '週二' },
  { key: 'wednesday', label: '週三' }, { key: 'thursday', label: '週四' },
  { key: 'friday', label: '週五' }, { key: 'saturday', label: '週六' },
  { key: 'sunday', label: '週日' },
]

const SHOP_TYPES = ['豚骨', '醬油', '鹽味', '味噌', '沾麵', '冷麵', '台式', '創意']
const CITIES = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '新竹市', '基隆市']

const form = ref<CreateUpdateShopDto>({
  name: '', city: '', district: '', detailAddress: '',
  phone: '', website: '', instagram: '', facebookPageId: '',
  types: [], description: '', googleRating: undefined,
  isVerified: false, isActive: true,
  businessHours: {
    monday: null, tuesday: null, wednesday: null, thursday: null,
    friday: null, saturday: null, sunday: null,
  },
  newsItems: [],
})

onMounted(async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const res = await adminShopsApi.getByGuid(route.params.guid as string)
    const shop = res.data.data!
    form.value = {
      name: shop.name, city: shop.city, district: shop.district, detailAddress: shop.detailAddress,
      phone: shop.phone ?? '', website: shop.website ?? '',
      instagram: shop.instagram ?? '', facebookPageId: shop.facebookPageId ?? '',
      types: [...shop.types], description: shop.description ?? '',
      googleRating: shop.googleRating || undefined,
      isVerified: shop.isVerified, isActive: shop.isActive,
      businessHours: shop.businessHours ?? { monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null, sunday: null },
      newsItems: [...shop.newsItems],
    }
    currentCover.value = shop.coverImage
    currentGallery.value = [...shop.images]
  } finally { loading.value = false }
})

async function handleSubmit() {
  saving.value = true
  try {
    if (isEdit.value) {
      await adminShopsApi.update(route.params.guid as string, form.value)
      ui.toast.success('店家已更新')
    } else {
      await adminShopsApi.create(form.value)
      ui.toast.success('店家已新增')
    }
    router.push('/shops')
  } catch {
    ui.toast.error('儲存失敗，請稍後再試')
  } finally { saving.value = false }
}

function toggleType(t: string) {
  const idx = form.value.types.indexOf(t)
  if (idx >= 0) form.value.types.splice(idx, 1)
  else form.value.types.push(t)
}

function toggleDay(key: keyof BusinessHours) {
  const bh = form.value.businessHours!
  bh[key] = bh[key] ? null : { isOpen: true, isSplit: false, open: '11:00', close: '21:00' }
}

function addNews() {
  form.value.newsItems!.push({ title: '', content: '', startDate: '', endDate: '' })
}

function removeNews(i: number) { form.value.newsItems!.splice(i, 1) }

const activeTab = ref<'basic' | 'hours' | 'news' | 'images'>('basic')
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <button class="btn-ghost text-sm" @click="router.back()">← 返回</button>
      <div>
        <p class="text-[10px] font-mono text-site-gray-lighter tracking-widest uppercase">{{ isEdit ? 'Edit Shop' : 'New Shop' }}</p>
        <h1 class="page-title">{{ isEdit ? '編輯店家' : '新增店家' }}</h1>
      </div>
    </div>

    <AppSpinner v-if="loading" />

    <form v-else @submit.prevent="handleSubmit">
      <!-- Tab Nav -->
      <div class="flex gap-1 border-b border-site-gray mb-6">
        <button
          v-for="tab in [{ key: 'basic', label: '基本資訊' }, { key: 'hours', label: '營業時間' }, { key: 'news', label: '公告' }, { key: 'images', label: '圖片' }]"
          :key="tab.key"
          type="button"
          class="font-bebas text-base tracking-wider px-5 py-2 border-b-2 transition-colors"
          :class="activeTab === tab.key ? 'border-red text-cream' : 'border-transparent text-site-gray-lighter hover:text-cream'"
          @click="activeTab = tab.key as 'basic' | 'hours' | 'news' | 'images'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Basic Info -->
      <div v-if="activeTab === 'basic'" class="space-y-4 max-w-2xl">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-xs text-site-gray-lighter mb-1">店家名稱 *</label>
            <input v-model="form.name" class="input-field" required />
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">城市 *</label>
            <select v-model="form.city" class="input-field" required>
              <option value="">選擇城市</option>
              <option v-for="c in CITIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">區域 *</label>
            <input v-model="form.district" class="input-field" required />
          </div>
          <div class="col-span-2">
            <label class="block text-xs text-site-gray-lighter mb-1">地址 *</label>
            <input v-model="form.detailAddress" class="input-field" required />
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">電話</label>
            <input v-model="form.phone" class="input-field" />
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">Google 評分</label>
            <input v-model.number="form.googleRating" type="number" step="0.1" min="0" max="5" class="input-field" />
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">Instagram</label>
            <input v-model="form.instagram" class="input-field" placeholder="@username" />
          </div>
          <div>
            <label class="block text-xs text-site-gray-lighter mb-1">Facebook</label>
            <input v-model="form.facebookPageId" class="input-field" />
          </div>
          <div class="col-span-2">
            <label class="block text-xs text-site-gray-lighter mb-1">網站</label>
            <input v-model="form.website" class="input-field" />
          </div>
          <div class="col-span-2">
            <label class="block text-xs text-site-gray-lighter mb-1">店家介紹</label>
            <textarea v-model="form.description" class="input-field resize-none h-24" />
          </div>
        </div>

        <!-- Types -->
        <div>
          <label class="block text-xs text-site-gray-lighter mb-2">湯底類型</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="t in SHOP_TYPES"
              :key="t"
              type="button"
              class="badge cursor-pointer transition-colors"
              :class="form.types.includes(t) ? 'bg-red text-white' : 'bg-site-gray text-cream-dark hover:bg-site-gray-light'"
              @click="toggleType(t)"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- Status -->
        <div class="flex gap-6">
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="form.isVerified" type="checkbox" class="w-4 h-4 accent-red" />
            <span class="text-sm text-cream">已認證店家</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="form.isActive" type="checkbox" class="w-4 h-4 accent-red" />
            <span class="text-sm text-cream">上架中</span>
          </label>
        </div>
      </div>

      <!-- Business Hours -->
      <div v-if="activeTab === 'hours'" class="card p-4 max-w-md">
        <div v-for="day in DAYS" :key="day.key" class="flex items-center gap-4 py-2 border-b border-site-gray/50 last:border-0">
          <label class="flex items-center gap-2 w-16 shrink-0 cursor-pointer">
            <input
              type="checkbox"
              class="accent-red"
              :checked="!!form.businessHours?.[day.key]"
              @change="toggleDay(day.key)"
            />
            <span class="text-sm">{{ day.label }}</span>
          </label>
          <template v-if="form.businessHours?.[day.key]">
            <input
              v-model="form.businessHours[day.key]!.open"
              type="time"
              class="input-field w-28 text-sm py-1"
            />
            <span class="text-site-gray-lighter">—</span>
            <input
              v-model="form.businessHours[day.key]!.close"
              type="time"
              class="input-field w-28 text-sm py-1"
            />
          </template>
          <span v-else class="text-sm text-site-gray-lighter">休息</span>
        </div>
      </div>

      <!-- News -->
      <div v-if="activeTab === 'news'" class="space-y-4 max-w-2xl">
        <button type="button" class="btn-ghost text-sm" @click="addNews">+ 新增公告</button>
        <div v-for="(news, i) in (form.newsItems ?? [])" :key="i" class="card p-4 space-y-3 relative">
          <button type="button" class="absolute top-3 right-3 text-site-gray-lighter hover:text-red text-xs" @click="removeNews(i)">✕</button>
          <input v-model="news.title" class="input-field" placeholder="公告標題" />
          <textarea v-model="news.content" class="input-field resize-none h-16" placeholder="公告內容" />
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-site-gray-lighter mb-1">開始日期</label>
              <input v-model="news.startDate" type="date" class="input-field" />
            </div>
            <div>
              <label class="block text-xs text-site-gray-lighter mb-1">結束日期</label>
              <input v-model="news.endDate" type="date" class="input-field" />
            </div>
          </div>
        </div>
        <p v-if="!form.newsItems?.length" class="text-site-gray-lighter text-sm">尚無公告</p>
      </div>

      <!-- Images Tab -->
      <div v-if="activeTab === 'images'" class="space-y-8 max-w-2xl">
        <div v-if="!isEdit" class="text-site-gray-lighter text-sm">請先儲存店家後，再上傳圖片。</div>
        <template v-else>
          <!-- Cover Image -->
          <div>
            <h3 class="font-bebas text-lg tracking-wider text-cream mb-3">封面圖片</h3>
            <div class="flex flex-col gap-3">
              <div class="relative w-full aspect-video bg-ink rounded-lg overflow-hidden border border-site-gray">
                <img
                  v-if="coverPreview || currentCover"
                  :src="coverPreview ?? currentCover!"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-site-gray-lighter text-sm">
                  尚無封面圖片
                </div>
                <span v-if="coverPreview" class="absolute top-2 left-2 text-xs bg-amber-700 text-white px-2 py-0.5 rounded">待上傳</span>
              </div>
              <div class="flex gap-2 flex-wrap">
                <label class="btn-outline text-sm cursor-pointer">
                  選擇圖片
                  <input type="file" accept="image/*" class="hidden" @change="onCoverChange" />
                </label>
                <button
                  v-if="coverFile"
                  type="button"
                  class="btn-primary text-sm"
                  :disabled="uploadingCover"
                  @click="uploadCover"
                >
                  {{ uploadingCover ? '上傳中...' : '確認上傳' }}
                </button>
                <button
                  v-if="currentCover && !coverFile"
                  type="button"
                  class="btn-danger text-sm"
                  :disabled="uploadingCover"
                  @click="removeCover"
                >
                  刪除封面
                </button>
              </div>
            </div>
          </div>

          <!-- Gallery Images -->
          <div>
            <h3 class="font-bebas text-lg tracking-wider text-cream mb-3">相簿圖片</h3>

            <!-- Existing gallery -->
            <div v-if="currentGallery.length" class="grid grid-cols-3 gap-2 mb-4">
              <div
                v-for="url in currentGallery"
                :key="url"
                class="relative aspect-square bg-ink rounded overflow-hidden group"
              >
                <img :src="url" class="w-full h-full object-cover" />
                <button
                  type="button"
                  class="absolute inset-0 bg-ink/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red text-sm font-bebas tracking-wider"
                  @click="removeGalleryImage(url)"
                >
                  刪除
                </button>
              </div>
            </div>
            <p v-else class="text-site-gray-lighter text-sm mb-4">尚無相簿圖片</p>

            <!-- New uploads preview -->
            <div v-if="galleryPreviews.length" class="grid grid-cols-3 gap-2 mb-3">
              <div
                v-for="(src, i) in galleryPreviews"
                :key="i"
                class="relative aspect-square bg-ink rounded overflow-hidden"
              >
                <img :src="src" class="w-full h-full object-cover" />
                <span class="absolute top-1 left-1 text-xs bg-amber-700 text-white px-1.5 py-0.5 rounded">待上傳</span>
              </div>
            </div>

            <div class="flex gap-2 flex-wrap">
              <label class="btn-outline text-sm cursor-pointer">
                選擇多張圖片
                <input type="file" accept="image/*" multiple class="hidden" @change="onGalleryChange" />
              </label>
              <button
                v-if="galleryFiles.length"
                type="button"
                class="btn-primary text-sm"
                :disabled="uploadingGallery"
                @click="uploadGallery"
              >
                {{ uploadingGallery ? '上傳中...' : `上傳 ${galleryFiles.length} 張` }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-8">
        <button type="button" class="btn-ghost" @click="router.back()">取消</button>
        <button type="submit" class="btn-primary" :disabled="saving">
          <span v-if="saving" class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
          <span v-else>{{ isEdit ? '儲存變更' : '新增店家' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
