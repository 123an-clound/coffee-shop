# Coffee Shop Website + Admin — Design Addendum

> Nguồn chính của spec là `plan.md` (đã được người dùng viết và duyệt trước đó — chứa
> thương hiệu placeholder, tech stack, design system, sitemap, cấu trúc dữ liệu, 25 món
> khởi tạo, lộ trình triển khai). Tài liệu này chỉ ghi lại các quyết định kỹ thuật được
> chốt thêm trong phiên brainstorm ngày 2026-08-16, để `writing-plans` có đủ thông tin
> lập kế hoạch triển khai.

## 1. Supabase project

- Dùng project có sẵn **`123an-clound's Project`** (id `xsspvdgnhelzprcqaiek`, region
  `ap-southeast-1`, status ACTIVE_HEALTHY) — người dùng chọn dùng chung project này thay
  vì tạo project mới.
- Project URL: `https://xsspvdgnhelzprcqaiek.supabase.co`
- Publishable/anon key: `sb_publishable_1i_JXF8ar4zT9eCrRdch0A_9TG-UhaP` (legacy anon JWT
  cũng có sẵn nếu SDK cần). Lưu trong `.env.local`, **không** commit vào git.
- Project này đang có 2 bảng không liên quan (`kho_iphone`, `kho_hang_iphone`, RLS đã
  bật, 0 rows) — thuộc dự án khác của người dùng. Không đụng vào các bảng này.

## 2. Admin authorization — bổ sung bảo mật so với plan.md gốc

Plan gốc (mục 6) giả định "1 role admin" đơn giản dựa trên việc đã đăng nhập Supabase
Auth. Vì Auth trong Supabase là **theo cấp project, không theo app**, và project này
dùng chung với dự án khác, việc chỉ dựa vào "đã đăng nhập" là không an toàn — bất kỳ user
nào từng/sẽ được tạo trong project (kể cả cho mục đích khác) đều có thể vào `/admin`.

Quyết định: thêm bảng allowlist tường minh.

```sql
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
```

- RLS trên `categories` / `menu_items`:
  - `SELECT`: public (không cần đăng nhập) — phục vụ trang công khai.
  - `INSERT` / `UPDATE` / `DELETE`: chỉ khi `auth.uid()` tồn tại trong `admin_users`.
- RLS trên `admin_users`: `SELECT` chỉ cho phép user tự kiểm tra chính mình
  (`using (auth.uid() = user_id)`) — đủ để middleware xác nhận quyền mà không lộ danh
  sách admin khác. Không có policy `INSERT`/`UPDATE`/`DELETE` cho client (chỉ thao tác
  thủ công qua SQL editor / service role khi cấp quyền admin mới).
- Tài khoản admin đầu tiên: tạo qua Supabase Auth (email/password) rồi insert thủ công
  vào `admin_users` trong lúc setup — không tự phục vụ (self-serve) qua UI ở bản đầu.
- Middleware Next.js bảo vệ mọi route `/admin/**`: kiểm tra có session Supabase hợp lệ
  **và** user có trong `admin_users`, nếu không → redirect `/admin/login`.

## 3. Seed data (25 món + danh mục)

- Dùng đúng nội dung mục 5 của `plan.md` (25 món, 6 nhóm danh mục) làm dữ liệu khởi tạo.
- Ảnh placeholder: dùng **link ảnh trực tiếp** từ Unsplash/Pexels (miễn phí bản quyền,
  không cần tải/upload thủ công) lưu vào cột `image_url` — không upload qua Supabase
  Storage ở bước seed. Ảnh thật sau này upload qua trang admin (dùng Storage bucket
  `menu-images` như plan.md mục 6 đã định).

## 4. Git & deploy scope

- `git init` cục bộ để theo dõi lịch sử code trong quá trình implement.
- **Không** tạo remote GitHub, không push, không deploy Vercel trong phạm vi công việc
  hiện tại — để dành cho giai đoạn 7 (Deploy) khi người dùng yêu cầu.

## 5. Phạm vi không đổi so với plan.md

Tất cả phần còn lại (thương hiệu placeholder mục 0, tech stack mục 2, design system mục
3, sitemap mục 4, cấu trúc bảng `categories`/`menu_items` mục 6, yêu cầu phi chức năng
mục 7) giữ nguyên như `plan.md`. `writing-plans` sẽ tham chiếu cả hai file này.
