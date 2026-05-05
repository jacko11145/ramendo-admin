# Admin Rankings

Route: `/rankings`  
View: `src/views/AdminRankingsView.vue`  
Layout: `AdminLayout`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 取得設定 | `GET /api/admin/rankings/settings` | 目前排名演算法設定 |
| 更新設定 | `PUT /api/admin/rankings/settings` | 儲存新設定 |

## Ranking Settings Fields

| 欄位 | 說明 | 預設值 |
|------|------|--------|
| `bayesianM` | 貝氏平均基準分母（全站平均評論數） | 10 |
| `bayesianC` | 貝氏平均基準分數 | 3.5 |
| `userWeight` | 用戶評分權重（0–1） | 0.6 |
| `googleWeight` | Google 評分權重（0–1） | 0.4 |

## Business Logic

- 設定存放於 DB `system_settings` 表（key = `ranking_settings`，value = JSONB）
- `userWeight + googleWeight` 應等於 1（前端提示，後端不強制）
- 排名演算法：`score = (userWeight × bayesian_user_score) + (googleWeight × google_score)`
- 更新後下次查詢排行榜即生效

## Components

- 數字 / 滑桿輸入（每個參數一列）
- `AppButton` — 儲存按鈕
- 成功後顯示 toast 通知
