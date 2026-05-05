# Admin Shops

## Shop List

Route: `/shops`  
View: `src/views/shops/AdminShopListView.vue`

### API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 列表 | `GET /api/admin/shops` | 支援 search / city / page |
| 刪除 | `DELETE /api/admin/shops/{guid}` | 同時刪除相關評論、菜單項目 |

### Features

- 搜尋欄（shop name）
- 城市篩選下拉
- 「新增店家」按鈕導向 `/shops/create`
- 表格欄位：名稱 / 城市 / 類型 / 評分 / 操作（編輯/刪除）
- 刪除需 Modal 確認

---

## Shop Create / Edit

Route: `/shops/create` | `/shops/:guid/edit`  
View: `src/views/shops/AdminShopFormView.vue`

### API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 取得 (edit) | `GET /api/admin/shops/{guid}` | 載入現有資料 |
| 新增 | `POST /api/admin/shops` | 建立店家 |
| 更新 | `PUT /api/admin/shops/{guid}` | 修改店家 |
| 上傳封面 | `POST /api/admin/shops/{guid}/cover-image` | Cloudinary |
| 新增菜單項目 | `POST /api/admin/shops/{guid}/menu` | |
| 排序菜單 | `PUT /api/admin/shops/{guid}/menu/reorder` | 拖拉排序 |
| 刪除菜單項目 | `DELETE /api/admin/shops/{guid}/menu/{itemId}` | |

### Form Tabs

1. **基本資訊** — name / city / district / address / phone / types[] / googleRating / isVerified
2. **營業時間** — 每天 open / close，isOpen toggle
3. **公告** — 新增/刪除 newsItems（title / content / startDate / endDate）

### Business Logic

- `types` 為陣列（多選 checkbox）
- `businessHours` 序列化為 JSON 送出
- 封面圖上傳後回傳 Cloudinary URL，存入 `coverImage` 欄位
