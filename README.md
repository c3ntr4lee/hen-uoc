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

## Đăng nhập & đồng bộ (Firebase)

- `sync.js`: đăng nhập Google, lưu kế hoạch lên Firestore, nhận cập nhật từ người cùng sửa.
- `firebase-config.js`: cấu hình web (công khai theo thiết kế của Firebase). Đặt `null` để tắt đăng nhập.
- `firestore.rules`: chỉ thành viên kế hoạch đọc/ghi được; người có link mời chỉ tự thêm mình vào.
  Cập nhật quy tắc: `npx firebase-tools deploy --only firestore:rules --project hen-uoc-t4574`

## Dữ liệu khách thật

`data.js` chỉ chứa tên mẫu. Danh sách thật ở `private/` (không đưa lên git).
Chuyển dữ liệu giữa các máy: Cài đặt → **Xuất file sao lưu** → máy kia **Nhập file**.
