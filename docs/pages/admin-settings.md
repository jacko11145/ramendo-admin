# Admin Settings

Route: `/settings`  
View: `src/views/AdminSettingsView.vue`  
Layout: `AdminLayout`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 取得 | `GET /api/admin/settings/permissions` | 目前權限設定 |
| 更新 | `PUT /api/admin/settings/permissions` | 儲存新設定 |

## Permission Settings Fields

| 欄位 | 說明 | 預設值 |
|------|------|--------|
| `minLevelToReview` | 可發表評論的最低等級 | 2 |
| `minLevelToRateMenuItem` | 可評分菜單項目的最低等級 | 1 |
| `minLevelToSubmitShop` | 可提案店家的最低等級 | 3 |

## Business Logic

- 設定存放於 DB `system_settings` 表（key = `permission_settings`，value = JSONB）
- 更新後立即生效（前台 API 每次都從 DB 讀取）
- 數字輸入欄位，最小值 1

## Components

- 數字 input 群組（每個設定項目一列）
- `AppButton` — 儲存按鈕
- 成功後顯示 toast 通知
