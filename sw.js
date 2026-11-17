// Mở được khi mất mạng: lấy bản mới từ mạng trước, mất mạng thì dùng bản đã lưu.
// Không đụng tới dữ liệu đồng bộ (Firestore/đăng nhập) — Firebase tự lo phần ngoại tuyến của nó.
const CACHE = "henuoc-v2";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./data.js", "./lunar.js", "./sync.js", "./firebase-config.js", "./seating3d.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/logo.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  // thư viện cố định phiên bản (Firebase, font, three.js): dùng bản đã lưu nếu có
  const pinned = /(^|\.)gstatic\.com$|fonts\.googleapis\.com$|cdnjs\.cloudflare\.com$|cdn\.jsdelivr\.net$/.test(url.hostname) && !url.pathname.includes("/__/");
  if (!same && !pinned) return; // Firestore, đăng nhập Google… đi thẳng ra mạng
  if (same && url.pathname.includes("/private/")) return;
  e.respondWith(
    pinned
      ? caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; }))
      : fetch(req).then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("./index.html")))
  );
});
