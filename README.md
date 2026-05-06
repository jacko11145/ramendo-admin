# 拉麵道後台 — ramendo-admin

拉麵道管理員後台，Vue 3 + Vite + TypeScript + Tailwind CSS。  
僅限 Admin 角色登入，管理店家、用戶、評論、提案等所有資料。

---

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | Vue 3 (Composition API) + Vite |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS 3（與 ramendo-web 共用設計 Token） |
| 狀態管理 | Pinia |
| 伺服器狀態 | TanStack Query (Vue Query) |
| 路由 | Vue Router 4 |
| HTTP | Axios（`adminAccessToken`，與前台 Token 分開） |
| 部署 | Cloudflare Pages（獨立 CF project） |

---

## 功能

| 頁面 | 功能說明 |
|------|---------|
| 儀表板 | 總覽：用戶數、店家數、評論數、待審提案、邀請碼使用量 |
| 店家管理 | 列表篩選、新增/編輯（基本資訊、營業時間、公告）、刪除、認證切換 |
| 用戶管理 | 列表搜尋、角色變更、啟用/停用、VIP 設定、**經驗值增減** |
| 評論管理 | 列表（含店家名、評分、留言）、刪除 |
| 提案審核 | 待審/已審列表、核准、駁回（附原因） |
| 邀請碼管理 | 新增、啟用/停用、刪除，控制註冊門檻 |
| 排行榜設定 | 各評分來源權重、顯示上限、最低評論數、是否需認證 |
| 系統設定 | 各功能所需最低用戶等級（評論/提案/收藏） |
| 資料庫統計 | 各資料表筆數與磁碟佔用 |

---

## 本地執行

```bash
cp .env.example .env.development   # 第一次
npm install
npm run dev                         # http://localhost:3001
npm run build                       # 正式建置
```

### 前置需求

- Node.js 20+
- `ramendo-api` 在 `http://localhost:5000` 運行
- 具有 `Admin` 角色的帳號

---

## 環境變數

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## 專案結構

```
src/
  api/
    client.ts             ← Axios + JWT auto-refresh（adminAccessToken）
    auth.ts               ← 登入/登出
    admin/
      shops.ts            ← 店家 CRUD + 菜單
      users.ts            ← 用戶管理（含經驗值調整）
      reviews.ts          ← 評論管理
      submissions.ts      ← 提案審核
      invitationCodes.ts  ← 邀請碼管理
      settings.ts         ← 系統設定 + Dashboard 統計
  types/index.ts          ← TypeScript 型別
  stores/
    auth.store.ts         ← Admin 限定（role === 'Admin'）
    ui.store.ts           ← Toast
  router/index.ts         ← admin guard（非 Admin → /unauthorized）
  layouts/
    AdminLayout.vue       ← 可收合側邊欄 + Header
  views/
    AdminLoginView.vue
    AdminDashboardView.vue
    shops/AdminShopListView.vue
    shops/AdminShopFormView.vue
    AdminUserListView.vue
    AdminReviewListView.vue
    AdminSubmissionListView.vue
    AdminInvitationCodesView.vue
    AdminSettingsView.vue
    AdminRankingsView.vue
    AdminDatabaseView.vue
  components/
    common/               ← AppToast / AppSpinner / AppModal / AppPagination
    admin/                ← AdminStatsCard
```

---

## 路由邏輯

- 所有 `/` 路由需要 `Admin` 角色
- 已登入但非 Admin → `/unauthorized`
- 未登入 → `/login`
- `/login` 為 `guestOnly`（已登入自動導向 `/`）

---

## LocalStorage

| 鍵 | 說明 |
|----|------|
| `adminAccessToken` | JWT access token |
| `adminRefreshToken` | JWT refresh token |

與 `ramendo-web` 使用的 `accessToken`/`refreshToken` 分開，不互相影響。

---

## 用戶經驗值調整

在「用戶管理」頁面，每位用戶有「調整經驗」按鈕：

- 輸入**增減值**（正數加、負數扣）
- 填寫調整原因
- 調用 `PUT /api/admin/users/{id}/experience`，body：`{ "delta": 50, "reason": "..." }`
- 不可低於 0，不觸發自動等級事件

---

## 部署

| 項目 | 說明 |
|------|------|
| 平台 | Cloudflare Pages（獨立 project，與 ramendo-web 分開） |
| Build command | `npm run build` |
| Output directory | `dist` |
| 正式 API | `VITE_API_BASE_URL=https://ramendo-api.onrender.com` |

CI/CD 透過 GitHub Actions 自動部署（push to `main`）。
