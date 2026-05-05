# Admin Reviews

Route: `/reviews`  
View: `src/views/AdminReviewListView.vue`  
Layout: `AdminLayout`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 列表 | `GET /api/admin/reviews` | 支援 shopGuid / page |
| 刪除 | `DELETE /api/admin/reviews/{id}` | 強制刪除（不管作者） |

## Features

- 依店家篩選（shop name 搜尋）
- 表格欄位：用戶 / 店家 / 評分 / 評論內容（截斷）/ 日期 / 操作
- 展開查看完整評論
- 刪除需 Modal 確認

## Business Logic

- 管理員可刪除任何評論（內容違規管理）
- 刪除評論後後端自動重算店家平均評分
