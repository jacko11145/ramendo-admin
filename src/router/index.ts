import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/AdminLoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: () => import('@/views/AdminDashboardView.vue') },
        { path: 'shops', name: 'shops', component: () => import('@/views/shops/AdminShopListView.vue') },
        { path: 'shops/create', name: 'shop-create', component: () => import('@/views/shops/AdminShopFormView.vue') },
        { path: 'shops/:guid/edit', name: 'shop-edit', component: () => import('@/views/shops/AdminShopFormView.vue') },
        { path: 'users', name: 'users', component: () => import('@/views/AdminUserListView.vue') },
        { path: 'reviews', name: 'reviews', component: () => import('@/views/AdminReviewListView.vue') },
        { path: 'submissions', name: 'submissions', component: () => import('@/views/AdminSubmissionListView.vue') },
        { path: 'invitation-codes', name: 'invitation-codes', component: () => import('@/views/AdminInvitationCodesView.vue') },
        { path: 'settings', name: 'settings', component: () => import('@/views/AdminSettingsView.vue') },
        { path: 'rankings', name: 'rankings', component: () => import('@/views/AdminRankingsView.vue') },
        { path: 'database', name: 'database', component: () => import('@/views/AdminDatabaseView.vue') },
      ],
    },
    { path: '/unauthorized', name: 'unauthorized', component: () => import('@/views/UnauthorizedView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Token 存在但 user 尚未載入（如 F5 刷新），先還原 session
  if (auth.accessToken && !auth.user) {
    try {
      await auth.fetchMe()
    } catch {
      auth.clearAuth()
    }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    if (!auth.isLoggedIn) return { name: 'login' }
    return { name: 'unauthorized' }
  }
  if (to.meta.guestOnly && auth.isLoggedIn) return { path: '/' }
})

export default router
