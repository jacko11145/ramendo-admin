# Admin Invitation Codes

Route: `/invitation-codes`  
View: `src/views/AdminInvitationCodesView.vue`  
Layout: `AdminLayout`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 列表 | `GET /api/admin/invitation-codes` | 所有邀請碼 |
| 新增 | `POST /api/admin/invitation-codes` | body: `{ note?, maxUses? }` |
| 切換啟用 | `PATCH /api/admin/invitation-codes/{code}/toggle` | isActive toggle |
| 刪除 | `DELETE /api/admin/invitation-codes/{code}` | |

## Features

- 一鍵複製邀請碼到剪貼簿
- 表格欄位：代碼 / 備註 / 已使用次數 / 最大次數 / 狀態 / 建立時間 / 操作
- 狀態 badge 點擊切換（Active ↔ Disabled）
- 新增 Modal：備註欄位 + maxUses（空白 = 無限次）
- 刪除需 Modal 確認

## Business Logic

- 邀請碼由後端隨機產生（前端不需輸入 code 字串）
- `maxUses = null` 表示無限次使用
- `usedCount >= maxUses` 時自動標記為用完（後端判斷）
