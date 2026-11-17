# Hẹn Ước — sổ tay kế hoạch cưới

Web tĩnh (HTML/CSS/JS thuần, không cần build). Dữ liệu lưu trong trình duyệt (localStorage) của từng máy.

## Chạy ở máy

```
python -m http.server 5178
```

Mở http://localhost:5178

## Đưa lên mạng

Cloudflare Pages nối với repo này: mỗi lần `git push` lên `main` web tự cập nhật;
đẩy nhánh khác (vd. `thu-nghiem`) sẽ có link xem thử riêng.
Cài đặt Pages: Framework preset **None**, Build command **để trống**, Output directory **/**.

Sau mỗi lần sửa file JS/CSS, tăng số `?v=` trong `index.html` để trình duyệt tải bản mới.

## Dữ liệu khách thật

`data.js` chỉ chứa tên mẫu. Danh sách thật ở `private/` (không đưa lên git).
Chuyển dữ liệu giữa các máy: Cài đặt → **Xuất file sao lưu** → máy kia **Nhập file**.
