# KẾ HOẠCH XÂY DỰNG WEBSITE QUÁN CÀ PHÊ
*(Phong cách hiện đại – sang trọng – gần gũi thiên nhiên)*

> Tài liệu này là bản kế hoạch (plan) trước khi bắt tay code. Sau khi bạn duyệt, ta sẽ triển khai theo từng giai đoạn ở mục 8.

---

## 0. Thông tin thương hiệu (placeholder tạm thời — sửa lại sau khi có web)

Theo yêu cầu, mình điền tạm các thông tin dưới đây để có thể bắt tay dựng web ngay. Đây **không phải thông tin thật của quán bạn** — chỉ là placeholder hợp lý để lấp đầy giao diện/nội dung; toàn bộ có thể chỉnh sửa dễ dàng sau này (qua trang admin với menu, hoặc sửa trực tiếp với Claude Code với các phần còn lại như tên quán, địa chỉ, logo...).

| Hạng mục | Giá trị placeholder |
|---|---|
| Tên quán | **MỘC Coffee House** *(Mộc = gỗ/mộc mạc, gợi liên tưởng thiên nhiên; kết hợp "Coffee House" cho cảm giác hiện đại)* |
| Tagline | "Chậm lại giữa nhịp sống — Cà phê & thiên nhiên" |
| Địa chỉ | 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh |
| Số điện thoại | 0901 234 567 |
| Email liên hệ | contact@moccoffee.vn |
| Giờ mở cửa | 07:00 – 22:00, tất cả các ngày trong tuần |
| Facebook | facebook.com/moccoffee.vn |
| Instagram | @moccoffee.vn |
| Zalo | 0901 234 567 |
| Domain dự kiến | moccoffee.vn *(cần kiểm tra còn trống và mua khi triển khai thật)* |
| Logo | Chưa có — đề xuất: icon line-art lá cây lồng trong hình tách cà phê, màu xanh rêu (`#2F3E2E`) trên nền kem (`#F5F1E8`), đi kèm bảng màu ở mục 3 |
| Câu chuyện thương hiệu | Mộc Coffee House lấy cảm hứng từ cà phê Việt truyền thống, kết hợp không gian mộc mạc với chất liệu gỗ, cây xanh và ánh sáng tự nhiên — nơi khách "chậm lại" giữa nhịp sống hiện đại. |
| Project Supabase | Bạn đã có sẵn — gửi Project URL + anon/public key khi bắt đầu triển khai kỹ thuật (không cần đưa vào plan) |

> Sau khi web hoàn thành, bạn chỉ cần cung cấp thông tin thật (tên, địa chỉ, SĐT, logo, ảnh món thật...) là mình thay thế toàn bộ placeholder này — phần menu thì sửa ngay trên trang admin, phần còn lại (tên quán, logo, trang "Về chúng tôi"...) nhờ Claude Code chỉnh lại code/nội dung.

---

## 1. Tổng quan dự án

| Hạng mục | Quyết định |
|---|---|
| Loại website | Website giới thiệu quán cà phê (showcase), **không có** giỏ hàng/đặt hàng online |
| Ngôn ngữ | Tiếng Việt là chính (có thể mở rộng song ngữ Anh–Việt sau) |
| Trang admin | Có, yêu cầu đăng nhập bảo mật (chỉ chủ quán/nhân viên được cấp quyền) |
| Lưu trữ dữ liệu & hình ảnh | Supabase (Database + Storage + Auth) — bạn đã có project sẵn |
| Số lượng món khởi tạo | ~25 món, đa dạng loại (cà phê phin, espresso, trà, đá xay, bánh...) |

---

## 2. Công nghệ đề xuất (Claude quyết định theo yêu cầu của bạn)

Vì bạn không rành kỹ thuật và để mình chọn, đây là stack mình đề xuất — tối ưu cho một website nhà hàng/quán cà phê vừa đẹp, vừa nhanh, vừa dễ bảo trì lâu dài:

- **Frontend**: Next.js 14+ (React) + TypeScript + Tailwind CSS
  - Lý do: SEO tốt (khách tìm quán trên Google dễ thấy), tải trang nhanh, hình ảnh tối ưu tự động, dễ deploy miễn phí trên Vercel.
- **UI components**: shadcn/ui + Framer Motion (hiệu ứng chuyển động mượt, sang trọng)
- **Backend/Database/Auth/Storage**: Supabase
  - Bảng dữ liệu menu, danh mục món
  - Supabase Storage: lưu ảnh sản phẩm (bucket `menu-images`)
  - Supabase Auth: đăng nhập cho trang admin (email/password)
- **Hosting**: Vercel (frontend) — miễn phí cho quy mô nhỏ, tự động deploy khi cập nhật code
- **Domain**: gắn tên miền riêng của quán vào Vercel (khi bạn có domain)

---

## 3. Định hướng thiết kế (Design system)

**Tinh thần**: sang trọng, hiện đại, nhưng gần gũi thiên nhiên — tránh cảm giác lạnh/công nghiệp, hướng tới sự ấm áp của gỗ, đất, cây xanh.

**Bảng màu đề xuất** (tham khảo xu hướng thiết kế quán cà phê cao cấp 2026):

| Vai trò | Màu | Mã gợi ý |
|---|---|---|
| Nền chính | Kem ngà / Ivory | `#F5F1E8` |
| Màu chủ đạo (thương hiệu) | Xanh rêu đậm (Forest green) | `#2F3E2E` |
| Màu nhấn ấm | Đất nung / Terracotta | `#B5652A` |
| Màu nhấn sang trọng | Vàng đồng / Gold accent | `#C9A15B` |
| Chữ chính | Than đậm | `#2A2520` |
| Nền phụ / card | Trắng kem | `#FFFFFF` / `#FAF7F0` |

**Typography**:
- Heading: font serif có nét sang trọng — VD *Fraunces* hoặc *Playfair Display*
- Body: font sans-serif dễ đọc, hỗ trợ tốt dấu tiếng Việt — VD *Be Vietnam Pro* hoặc *Inter*

**Ngôn ngữ hình ảnh**:
- Ảnh chụp thật (không dùng ảnh 3D giả) — chất liệu gỗ, mây tre, cây xanh, ánh sáng tự nhiên
- Nhiều khoảng trắng (whitespace), bố cục thoáng
- Họa tiết lá cây/thực vật mảnh (line-art) làm điểm nhấn trang trí, không lạm dụng
- Hiệu ứng parallax nhẹ, fade-in khi cuộn trang để tạo cảm giác cao cấp

> ⚠️ Lưu ý bản quyền: hình ảnh/tên món "tham khảo từ internet" mình sẽ dùng làm **ảnh placeholder tạm thời** khi dựng giao diện (nguồn ảnh miễn phí bản quyền như Unsplash/Pexels). Với website thương mại chính thức, khuyến nghị thay bằng **ảnh chụp thật của quán** (chụp món thật) để tránh vi phạm bản quyền và tăng độ tin cậy thương hiệu — trang admin sẽ cho phép bạn tự upload ảnh thật bất cứ lúc nào.

---

## 4. Sơ đồ trang web (Sitemap)

**Website công khai:**
1. **Trang chủ** — Hero giới thiệu quán, món nổi bật, câu chuyện ngắn, CTA xem menu/chỉ đường
2. **Menu** — Danh sách 25 món, lọc theo danh mục, tìm kiếm, mỗi món có ảnh/giá/mô tả
3. **Về chúng tôi** — Câu chuyện thương hiệu, không gian quán, giá trị cốt lõi
4. **Không gian quán** (Gallery) — Ảnh không gian, nội thất
5. **Liên hệ** — Địa chỉ, bản đồ (Google Maps embed), giờ mở cửa, form liên hệ, mạng xã hội

**Trang quản trị (Admin) — `/admin`:**
1. **Đăng nhập** (Supabase Auth)
2. **Dashboard** — Tổng quan số món, danh mục
3. **Quản lý menu**:
   - Danh sách món (bảng, tìm kiếm, lọc theo danh mục)
   - Thêm/sửa/xóa món: tên, mô tả, giá, danh mục, ảnh (upload lên Supabase Storage), trạng thái (còn bán / hết hàng), món nổi bật (featured)
   - Sắp xếp thứ tự hiển thị (kéo-thả)
4. **Quản lý danh mục món** (thêm/sửa/xóa danh mục)
5. **Quản lý tài khoản admin** (nếu cần nhiều nhân viên đăng nhập)

---

## 5. Danh sách 25 món trong menu (bản khởi tạo — sửa lại sau qua trang admin)

Danh sách dưới đây được xây dựng đa dạng theo 6 nhóm, tham khảo menu các chuỗi cà phê hiện đại tại Việt Nam (Highlands, Phúc Long...) và xu hướng cà phê trái cây 2026. Giá lấy theo mặt bằng thị trường quán cà phê hiện đại — dùng làm dữ liệu khởi tạo cho database, **sau khi web xong bạn vào trang admin đổi giá/món theo thực tế bất cứ lúc nào**, không cần sửa code.

### A. Cà phê phin truyền thống (5 món)
1. Cà Phê Đen Đá / Nóng — 39.000đ
2. Cà Phê Sữa Đá / Nóng — 45.000đ
3. Bạc Xỉu — 45.000đ
4. Cà Phê Muối — 49.000đ
5. Cà Phê Trứng — 55.000đ

### B. Espresso & cà phê máy hiện đại (5 món)
6. Espresso — 45.000đ
7. Americano — 49.000đ
8. Cappuccino — 55.000đ
9. Latte — 58.000đ
10. Caramel Macchiato — 65.000đ

### C. Cold Brew & Đặc biệt (3 món)
11. Cold Brew Nguyên Bản — 55.000đ
12. Cold Brew Sữa Dừa — 62.000đ
13. Espresso Tonic — 60.000đ

### D. Cà phê & trà trái cây (xu hướng 2026) (4 món)
14. Cà Phê Xoài Sữa Dừa — 62.000đ
15. Americano Quýt Vải — 58.000đ
16. Cold Brew Đào — 58.000đ
17. Trà Đào Cam Sả — 55.000đ

### E. Trà & thức uống thảo mộc (4 món)
18. Trà Sen Vàng — 45.000đ
19. Trà Thái Xanh Kem Cheese — 55.000đ
20. Matcha Latte — 58.000đ
21. Trà Gừng Mật Ong — 45.000đ

### F. Đá xay / Sinh tố & Bánh (4 món)
22. Sinh Tố Bơ — 55.000đ
23. Chocolate Đá Xay — 60.000đ
24. Bánh Tiramisu — 65.000đ
25. Bánh Croissant Bơ — 35.000đ

**Mỗi món trong hệ thống sẽ có đầy đủ**: tên món (VN + có thể thêm tên EN), mô tả ngắn (2–3 câu gợi cảm giác/nguyên liệu), giá bán, danh mục, ảnh sản phẩm, trạng thái còn/hết hàng, gắn nhãn "món nổi bật" (tùy chọn).

---

## 6. Cấu trúc dữ liệu Supabase (đề xuất)

**Bảng `categories`**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid (PK) | |
| name | text | VD: "Cà phê phin", "Trà trái cây" |
| slug | text | dùng cho URL/lọc |
| display_order | int | thứ tự hiển thị |

**Bảng `menu_items`**
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid (PK) | |
| category_id | uuid (FK → categories) | |
| name | text | Tên món |
| description | text | Mô tả ngắn |
| price | numeric | Giá (VNĐ) |
| image_url | text | Link ảnh trong Supabase Storage |
| is_available | boolean | Còn bán / hết hàng |
| is_featured | boolean | Món nổi bật (hiển thị trang chủ) |
| display_order | int | Thứ tự trong danh mục |
| created_at / updated_at | timestamp | |

**Supabase Storage**
- Bucket `menu-images` (public read) — admin upload ảnh trực tiếp khi thêm/sửa món, ảnh được resize/tối ưu tự động phía frontend trước khi hiển thị.

**Supabase Auth**
- Bảng người dùng mặc định của Supabase Auth, giới hạn 1 role `admin` để truy cập `/admin`. Bảo vệ route admin bằng middleware kiểm tra session.

**Row Level Security (RLS)**:
- `categories`, `menu_items`: cho phép **đọc công khai** (public SELECT) để trang chủ hiển thị menu không cần đăng nhập; **chỉ admin đã đăng nhập** mới được INSERT/UPDATE/DELETE.

---

## 7. Yêu cầu phi chức năng

- Responsive hoàn chỉnh trên mobile/tablet/desktop (đa số khách xem menu bằng điện thoại)
- Tốc độ tải nhanh (ảnh tối ưu qua Next.js Image + Supabase transform)
- SEO cơ bản: meta title/description, sitemap.xml, dữ liệu có cấu trúc (structured data) cho địa điểm quán ăn
- Tích hợp Google Maps để khách chỉ đường
- Hỗ trợ font tiếng Việt đầy đủ dấu, không lỗi hiển thị
- Bảo mật trang admin: chỉ tài khoản được cấp quyền mới đăng nhập được

---

## 8. Lộ trình triển khai (các giai đoạn tiếp theo)

1. **Giai đoạn 1 — Chốt nội dung** *(cần bạn xác nhận mục 0 & mục 5)*
2. **Giai đoạn 2 — Thiết lập Supabase**: tạo bảng, bucket ảnh, RLS, tài khoản admin đầu tiên
3. **Giai đoạn 3 — Dựng giao diện công khai**: Trang chủ, Menu, Về chúng tôi, Không gian, Liên hệ
4. **Giai đoạn 4 — Dựng trang Admin**: đăng nhập, CRUD menu, upload ảnh, quản lý danh mục
5. **Giai đoạn 5 — Nhập liệu khởi tạo**: 25 món (ảnh placeholder chất lượng cao trước, thay ảnh thật sau)
6. **Giai đoạn 6 — Kiểm thử & tối ưu**: responsive, tốc độ, SEO
7. **Giai đoạn 7 — Deploy**: đưa lên Vercel, gắn domain thật, bàn giao tài khoản admin

---

## Nguồn tham khảo đã dùng để xây dựng plan này

- [Menu Highland Coffee Mới Nhất 2026](https://nhahanghonghanh.vn/menu-highland-coffee-moi-nhat/)
- [Cà phê trái cây: Xu hướng menu 2026](https://mqflavor.com/ca-phe-trai-cay-xu-huong-moi-2026/)
- [25 Best Coffee Shop Website Design Examples 2026 - Colorlib](https://colorlib.com/wp/coffee-shop-websites/)
