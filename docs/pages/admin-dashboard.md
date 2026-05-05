# Admin Dashboard

Route: `/`  
View: `src/views/AdminDashboardView.vue`  
Layout: `AdminLayout`  
Guard: `adminOnly` — 非 Admin 角色導向 `/unauthorized`

## API Calls

| Query key | Endpoint | 說明 |
|-----------|----------|------|
| `['dashboard-stats']` | `GET /api/admin/dashboard/stats` | 總覽數字 |

## Stats Cards

| 指標 | 說明 |
|------|------|
| 總店家數 | 所有已驗證店家 |
| 總用戶數 | 已註冊用戶 |
| 待審核提案 | `SubmissionStatus = Pending` 數量 |
| 本月新評論 | 本月新增評論數 |

## Components

- `AdminStatsCard` — 數字 + 標題 + 圖示卡片（4 張）
