# Admin Users

Route: `/users`  
View: `src/views/AdminUserListView.vue`  
Layout: `AdminLayout`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 列表 | `GET /api/admin/users` | 支援 search / role / page |
| 更新角色 | `PUT /api/admin/users/{id}/role` | body: `{ role }` |
| 更新狀態 | `PUT /api/admin/users/{id}/status` | body: `{ isActive }` |
| 設定 VIP | `PUT /api/admin/users/{id}/vip` | body: `{ isVip, membershipExpiry }` |
| 調整經驗值 | `PUT /api/admin/users/{id}/experience` | body: `{ amount }` (正負值) |
| 刪除用戶 | `DELETE /api/admin/users/{id}` | 同時刪除其評論 |

## Features

- 搜尋欄（displayName / email）
- Role 篩選下拉
- 表格欄位：名稱 / Email / 角色 / 等級 / VIP / 狀態 / 操作
- **角色** inline 下拉：`Admin` / `ShopOwner` / `VIP` / `User`
- **狀態** badge 點擊切換（Active ↔ Suspended）
- **調整 XP** Modal：輸入正負整數
- **設定 VIP** Modal：toggle + 到期日 datepicker
- 刪除需 Modal 確認

## Business Logic

- 管理員不能刪除自己
- Level = `Math.floor(exp / 100) + 1`（前端計算，僅展示用）
