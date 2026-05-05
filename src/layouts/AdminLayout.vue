<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const route = useRoute()
const { user } = storeToRefs(auth)
const sidebarOpen = ref(true)

const NAV_ITEMS = [
  { to: '/dashboard', label: '儀表板', icon: '▦' },
  { to: '/shops', label: '店家管理', icon: '⊞' },
  { to: '/users', label: '用戶管理', icon: '⊙' },
  { to: '/reviews', label: '評論管理', icon: '◈' },
  { to: '/submissions', label: '提案審核', icon: '◉' },
  { to: '/invitation-codes', label: '邀請碼', icon: '◆' },
  { to: '/settings', label: '權限設定', icon: '⚙' },
  { to: '/rankings', label: '排名設定', icon: '◇' },
  { to: '/database', label: '資料庫', icon: '⬡' },
]

async function handleLogout() {
  await auth.logout()
  ui.toast.info('已登出')
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-ink overflow-hidden">
    <!-- Sidebar -->
    <aside
      class="bg-sidebar border-r border-[rgba(217,43,43,0.3)] flex flex-col transition-all duration-200 shrink-0"
      :class="sidebarOpen ? 'w-56' : 'w-14'"
    >
      <!-- Logo -->
      <div class="h-14 flex items-center px-4 border-b border-[rgba(217,43,43,0.3)]">
        <div class="flex flex-col justify-center">
          <div class="flex items-baseline">
            <span class="font-bebas text-2xl tracking-widest text-red leading-none">拉</span>
            <span v-if="sidebarOpen" class="font-bebas text-2xl tracking-widest text-cream leading-none">麵道</span>
          </div>
          <p v-if="sidebarOpen" class="text-[10px] text-site-gray-lighter tracking-widest leading-none mt-0.5">管理系統</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-3 overflow-y-auto">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
          :class="route.path.startsWith(item.to) && item.to !== '/'
            ? 'text-cream bg-ink-light border-l-2 border-red'
            : 'text-site-gray-lighter hover:text-cream hover:bg-ink-light border-l-2 border-transparent'"
        >
          <span class="text-base w-5 text-center shrink-0">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="truncate">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- User -->
      <div class="border-t border-[rgba(217,43,43,0.3)] p-3 space-y-2">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-red flex items-center justify-center text-xs font-bebas shrink-0">
            {{ user?.name?.charAt(0) ?? 'A' }}
          </div>
          <div v-if="sidebarOpen" class="flex-1 min-w-0">
            <p class="text-xs text-cream truncate">{{ user?.name }}</p>
            <p class="text-[10px] text-site-gray-lighter font-mono">Admin</p>
          </div>
        </div>
        <button
          v-if="sidebarOpen"
          class="w-full btn-ghost text-xs py-1.5"
          @click="handleLogout"
        >
          登出
        </button>
        <button
          v-else
          class="w-full flex justify-center items-center text-site-gray-lighter hover:text-red transition-colors py-1.5"
          title="登出"
          @click="handleLogout"
        >
          <span class="text-base">⏏</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="h-14 bg-ink-light border-b border-[rgba(217,43,43,0.3)] flex items-center px-4 gap-4 shrink-0">
        <button
          class="text-site-gray-lighter hover:text-cream transition-colors"
          @click="sidebarOpen = !sidebarOpen"
        >
          ☰
        </button>
        <span class="flex-1" />
        <span class="text-xs font-mono text-site-gray-lighter">{{ user?.email }}</span>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
