# Admin Submissions

Route: `/submissions`  
View: `src/views/AdminSubmissionListView.vue`  
Layout: `AdminLayout`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 列表 | `GET /api/admin/submissions` | 支援 status / page |
| 審核通過 | `PUT /api/admin/submissions/{id}/approve` | 建立正式店家 |
| 審核拒絕 | `PUT /api/admin/submissions/{id}/reject` | body: `{ reason }` |

## Features

- Status 篩選 tab：全部 / 待審核 / 已通過 / 已拒絕
- 表格欄位：提案者 / 店名 / 城市 / 提案時間 / 狀態 / 操作
- 展開查看完整提案資訊
- 拒絕需輸入原因（Modal 內 textarea）
- 通過後自動在店家列表出現（`isVerified = true`）

## Business Logic

- `Approve`：後端從提案資料建立 `RamenShop` 並設 `isVerified = true`
- `Reject`：記錄拒絕原因，用戶在 `/dashboard` 可查看
- 審核後狀態不可回溯（已通過/已拒絕不再顯示操作按鈕）
