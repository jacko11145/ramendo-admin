# ramendo-admin — CLAUDE.md

## 專案簡介

拉麵道後台管理系統 (ramendo-admin)，Vue 3 + Vite + TypeScript + Tailwind CSS。
管理員專用，呼叫 `ramendo-api` 的 `/api/admin/*` 端點。

---

## 本地執行

```bash
cd ramendo-admin
cp .env.example .env.development   # 第一次
npm run dev                         # http://localhost:3001
npm run build                       # 正式建置
```

### 前置需求

- Node.js 20+
- `ramendo-api` 在 `http://localhost:5000` 運行
- 具有 Admin 角色的帳號

---

## 環境變數

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## Solution 結構

```
ramendo-admin/
├── src/
│   ├── api/
│   │   ├── client.ts             ← Axios + JWT auto-refresh (adminAccessToken)
│   │   ├── auth.ts               ← 登入/登出
│   │   └── admin/
│   │       ├── shops.ts          ← 店家 CRUD + 菜單
│   │       ├── users.ts          ← 用戶管理
│   │       ├── reviews.ts        ← 評論管理
│   │       ├── submissions.ts    ← 提案審核
│   │       ├── invitationCodes.ts← 邀請碼管理
│   │       └── settings.ts       ← 設定 + 統計
│   ├── types/index.ts            ← TypeScript 型別
│   ├── stores/
│   │   ├── auth.store.ts         ← Admin 限定（role === 'Admin' 才能登入）
│   │   └── ui.store.ts           ← Toast
│   ├── router/index.ts           ← admin.guard（非 Admin → /unauthorized）
│   ├── layouts/AdminLayout.vue   ← Sidebar（可收合）+ Header
│   ├── views/
│   │   ├── AdminLoginView.vue
│   │   ├── AdminDashboardView.vue
│   │   ├── shops/
│   │   │   ├── AdminShopListView.vue
│   │   │   └── AdminShopFormView.vue    ← 新增/編輯（3 tabs: 基本/營業時間/公告）
│   │   ├── AdminUserListView.vue
│   │   ├── AdminReviewListView.vue
│   │   ├── AdminSubmissionListView.vue
│   │   ├── AdminInvitationCodesView.vue
│   │   ├── AdminSettingsView.vue        ← 權限等級設定
│   │   ├── AdminRankingsView.vue        ← 排名權重設定
│   │   ├── AdminDatabaseView.vue        ← 資料表統計
│   │   └── UnauthorizedView.vue
│   └── components/
│       ├── common/  ← AppToast / AppSpinner / AppModal / AppPagination
│       └── admin/   ← AdminStatsCard
├── _redirects
└── CLAUDE.md
```

---

## 設計規範（與 ramendo-web 相同）

| Token | 值 |
|-------|-----|
| `--ink` | `#0C0C0C` |
| `--red` | `#C8201A` |
| `--cream` | `#F0E9D6` |
| `sidebar` | `#111111` |

---

## 元件慣例

```vue
<button class="btn-primary">主要動作</button>
<button class="btn-outline">次要</button>
<button class="btn-ghost">輔助</button>
<button class="btn-danger">危險操作</button>
<div class="card p-4">...</div>
<h1 class="page-title">頁面標題</h1>
<input class="input-field" />
<span class="badge">標籤</span>
<th class="table-header text-left">欄位</th>
<td class="table-cell">資料</td>
```

---

## 路由規則

- 所有 `/` 下的路由都需要 `Admin` 角色
- 非 Admin 已登入 → `/unauthorized`
- 未登入 → `/login`
- `/login` 為 `guestOnly`（已登入自動重導到 `/`）

---

## LocalStorage 鍵

| 鍵 | 說明 |
|----|------|
| `adminAccessToken` | JWT access token |
| `adminRefreshToken` | JWT refresh token |

（與 ramendo-web 的 `accessToken`/`refreshToken` 分開，避免衝突）

---

## 實作進度 Checklist

### 基礎建設 ✅
- [x] Vite + Vue 3 + TypeScript + vue-tsc 初始化
- [x] Tailwind CSS 3 + 設計 token
- [x] `vite.config.ts` (@ alias, port 3001)
- [x] `tsconfig.app.json` (paths + ignoreDeprecations)
- [x] `src/style.css` (全域樣式 + 元件 class)

### Types ✅
- [x] `src/types/index.ts` (全部 admin 型別)

### API ✅
- [x] `src/api/client.ts` (Axios + adminAccessToken + auto-refresh)
- [x] `src/api/auth.ts`
- [x] `src/api/admin/shops.ts`
- [x] `src/api/admin/users.ts`
- [x] `src/api/admin/reviews.ts`
- [x] `src/api/admin/submissions.ts`
- [x] `src/api/admin/invitationCodes.ts`
- [x] `src/api/admin/settings.ts`

### Stores ✅
- [x] `src/stores/auth.store.ts` (Admin 限定)
- [x] `src/stores/ui.store.ts`

### Router ✅
- [x] `src/router/index.ts` (admin guard)

### Layout ✅
- [x] `src/layouts/AdminLayout.vue` (可收合側邊欄 + Header)

### Components ✅
- [x] `src/components/common/AppToast.vue`
- [x] `src/components/common/AppSpinner.vue`
- [x] `src/components/common/AppModal.vue`
- [x] `src/components/common/AppPagination.vue`
- [x] `src/components/admin/AdminStatsCard.vue`

### Views ✅
- [x] `src/views/AdminLoginView.vue`
- [x] `src/views/UnauthorizedView.vue`
- [x] `src/views/AdminDashboardView.vue`
- [x] `src/views/shops/AdminShopListView.vue`
- [x] `src/views/shops/AdminShopFormView.vue`
- [x] `src/views/AdminUserListView.vue`
- [x] `src/views/AdminReviewListView.vue`
- [x] `src/views/AdminSubmissionListView.vue`
- [x] `src/views/AdminInvitationCodesView.vue`
- [x] `src/views/AdminSettingsView.vue`
- [x] `src/views/AdminRankingsView.vue`
- [x] `src/views/AdminDatabaseView.vue`

### Docs ✅
- [x] `docs/pages/admin-dashboard.md`
- [x] `docs/pages/admin-shops.md`
- [x] `docs/pages/admin-users.md`
- [x] `docs/pages/admin-reviews.md`
- [x] `docs/pages/admin-invitation-codes.md`
- [x] `docs/pages/admin-submissions.md`
- [x] `docs/pages/admin-settings.md`
- [x] `docs/pages/admin-rankings.md`
- [x] `docs/pages/admin-database.md`

### 部署 ✅
- [x] `.env.example`
- [x] `_redirects` (Cloudflare Pages SPA)
- [x] `.github/workflows/ci.yml`
- [x] `.github/workflows/deploy.yml`

---

## 部署

- **平台**: Cloudflare Pages（獨立 CF project，與 ramendo-web 分開）
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **環境變數**: `VITE_API_BASE_URL=https://ramendo-api.onrender.com`
