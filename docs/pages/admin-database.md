# Admin Database

Route: `/database`  
View: `src/views/AdminDatabaseView.vue`  
Layout: `AdminLayout`

## API Calls

| Query key | Endpoint | 說明 |
|-----------|----------|------|
| `['db-stats']` | `GET /api/admin/database/stats` | 所有資料表統計 |

## Features

- 顯示 17 個資料表的列數統計
- 自動每 30 秒重新整理（`refetchInterval: 30_000`）
- 手動重新整理按鈕

## Tables Displayed

| 資料表 | 說明 |
|--------|------|
| users | 用戶 |
| ramen_shops | 拉麵店 |
| menu_items | 菜單項目 |
| option_types | 選項類型 |
| option_values | 選項值 |
| item_options | 菜單項目選項關聯 |
| menu_item_option_values | 菜單項目選項值關聯 |
| reviews | 評論 |
| menu_item_ratings | 菜單項目評分 |
| review_options | 評論選項標記 |
| favorites | 收藏 |
| shop_submissions | 店家提案 |
| invitation_codes | 邀請碼 |
| refresh_tokens | Refresh Token |
| system_settings | 系統設定 |

## Components

- 資料表格（table name + row count）
- 重新整理按鈕
