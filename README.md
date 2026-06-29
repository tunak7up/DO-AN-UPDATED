# Hướng dẫn cài đặt và chạy dự án

Dự án này bao gồm 2 phần: Frontend (`fe`) và Backend (`be`).
Để chạy dự án, bạn cần cài đặt thư viện (dependencies) và khởi động cả hai phần.

## Yêu cầu hệ thống

- Đã cài đặt Node.js trên máy của bạn.
- Đã cài đặt hệ quản trị cơ sở dữ liệu MySQL.

---

## 1. Cấu hình Cơ sở dữ liệu (MySQL)

Dự án đã có sẵn file `db.sql` chứa toàn bộ cấu trúc bảng và dữ liệu mẫu (bao gồm các phân quyền/roles bắt buộc để hệ thống không bị lỗi). Bạn **phải** import file này vào MySQL trước khi chạy code.

Bước 1: Mở công cụ quản lý MySQL của bạn (như MySQL Workbench, phpMyAdmin, Navicat, v.v.).
Bước 2: Tạo một database rỗng với tên là `websale`.

```sql
CREATE DATABASE websale CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Bước 3: Thực hiện import file `db.sql` (nằm ở thư mục gốc của dự án) vào database vừa tạo.
- **Nếu dùng MySQL Workbench:** Chọn menu **Server** > **Data Import**, chọn **Import from Self-Contained File**, trỏ đường dẫn đến file `db.sql`. Trong mục **Default Target Schema**, chọn `websale` rồi nhấn **Start Import**.
- **Nếu dùng phpMyAdmin:** Chọn database `websale`, qua tab **Import** (Nhập), chọn file `db.sql` và nhấn **Go** (Thực hiện).

Bước 4: (Tuỳ chọn) Bạn có thể vào file `be/.env` để kiểm tra và sửa đổi `DB_USER` và `DB_PASSWORD` sao cho đúng với cấu hình MySQL trên máy của bạn (mặc định đang để `DB_USER=root` và `DB_PASSWORD=123456`).

---

## 2. Cài đặt và khởi chạy Backend (`be`)

Bước 1: Mở một terminal (cmd/powershell) mới và di chuyển vào thư mục `be`:

```bash
cd be
```

Bước 2: Cài đặt các gói thư viện cần thiết:

```bash
npm install
```

Bước 3: Khởi động server backend:

```bash
npm run dev
```

---

## 3. Cài đặt và khởi chạy Frontend (`fe`)

Bước 1: Mở một terminal mới (giữ terminal cũ đang chạy backend) và di chuyển vào thư mục `fe`:

```bash
cd fe
```

Bước 2: Cài đặt các gói thư viện cần thiết:

```bash
npm install
```

Bước 3: Khởi động ứng dụng frontend:

```bash
npm run dev
```

---

**Lưu ý:** Bạn cần phải chạy song song cả 2 terminal (một cái chạy `be`, một cái chạy `fe`) để toàn bộ hệ thống hoạt động bình thường.
