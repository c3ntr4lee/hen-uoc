(function () {
  const C = window.THIEP;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const [a, b] = C.tenNgan;
  const mono = a[0] + b[0];
  const [Y, M, D] = C.ngay.split("-").map(Number);
  const when = new Date(Y, M - 1, D, ...C.gio.split(":").map(Number));
  const THU = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

  // ----- chữ -----
  $$("[data-names]").forEach((e) => (e.textContent = `${a} & ${b}`));
  $$("[data-names-stack]").forEach((e) => (e.innerHTML = `<span>${esc(a)}</span><span>&amp;</span><span>${esc(b)}</span>`));
  $$("[data-mono]").forEach((e) => (e.textContent = mono));
  $$("[data-date]").forEach((e) => (e.textContent = `${String(D).padStart(2, "0")} · ${String(M).padStart(2, "0")} · ${Y}`));
  $$("[data-date-long]").forEach((e) => (e.textContent = `${THU[when.getDay()]}, ngày ${D} tháng ${M} năm ${Y}`));
  if (window.Lunar) {
    const l = Lunar.solarToLunar(D, M, Y);
    $$("[data-lunar]").forEach((e) => (e.textContent = `Tức ngày ${l.day} tháng ${l.month}${l.leap ? " nhuận" : ""} năm ${Lunar.canChi(l.year)}`));
  }
  $$("[data-city]").forEach((e) => (e.textContent = C.thanhPho));
  const dl = new Date(when); dl.setDate(dl.getDate() - 14);
  $$("[data-deadline]").forEach((e) => (e.textContent = `${dl.getDate()}/${dl.getMonth() + 1}/${dl.getFullYear()}`));
  const contact = [C.dienThoai && `<a href="tel:${esc(C.dienThoai)}">${esc(C.dienThoai)}</a>`, C.lienHeEmail && `<a href="mailto:${esc(C.lienHeEmail)}">${esc(C.lienHeEmail)}</a>`].filter(Boolean).join(" · ");
  $$("[data-contact]").forEach((e) => (e.innerHTML = `${contact ? `Có gì thắc mắc, bạn liên hệ chúng mình qua<br>${contact}<br><br>` : ""}<span class="caps">Thương mến</span><br><span class="script" style="font-size:44px;color:var(--ink)">${esc(a)} &amp; ${esc(b)}</span>`));

  const mapLink = (e) => e.banDo || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([e.noi, e.diaChi].filter(Boolean).join(", "))}`;
  $("[data-events]").innerHTML = C.suKien.map((e) => `<div class="ev"><p class="caps label">${esc(e.ten)}</p>
    <p class="it">${esc(e.gio)} tại ${esc(e.noi)}<br>${esc(e.diaChi)}</p><a href="${esc(mapLink(e))}" target="_blank" rel="noopener">Xem bản đồ</a></div>`).join("");

  const ICON = {
    nhan: '<circle cx="28" cy="40" r="14"/><circle cx="42" cy="40" r="14"/><path d="M24 26l4-8 4 8M38 26l4-8 4 8"/>',
    ly: '<path d="M20 12h14l-2 18a5 5 0 0 1-10 0zM27 35v18M21 53h12M38 14h14l-2 18a5 5 0 0 1-10 0zM45 37v16M39 53h12"/>',
    anh: '<rect x="10" y="20" width="50" height="34" rx="4"/><circle cx="35" cy="37" r="10"/><path d="M24 20l4-6h14l4 6"/>',
    banh: '<path d="M16 54h38M18 54V40h34v14M23 40V30h24v10M28 30v-8h14v8M35 22v-8"/><path d="M18 46c6 4 11-4 17 0s11 4 17 0"/>',
    nhac: '<path d="M26 50V16l26-6v34"/><circle cx="20" cy="50" r="6"/><circle cx="46" cy="44" r="6"/>',
    tim: '<path d="M35 56S12 42 12 26a11 11 0 0 1 23-4 11 11 0 0 1 23 4c0 16-23 30-23 30z"/>',
  };
  $("[data-timeline]").innerHTML = C.lichTrinh.map((t) => `<li><svg viewBox="0 0 70 70" aria-hidden="true">${ICON[t.icon] || ICON.tim}</svg><b>${esc(t.gio)}</b><span>${esc(t.viec)}</span></li>`).join("");
  $("[data-dress]").textContent = C.trangPhuc;
  $("[data-swatch]").innerHTML = C.mauTrangPhuc.map((c) => `<i style="background:${esc(c)}" title="${esc(c)}"></i>`).join("");
  const banks = C.taiKhoan.filter((t) => t.stk);
  if (!C.mungCuoi || !banks.length) $("[data-gift-wrap]").hidden = true; // chưa điền số tài khoản thì ẩn mục mừng cưới
  $("[data-gift]").textContent = C.mungCuoi;
  $("[data-banks]").innerHTML = banks.map((t) => `<div class="bank"><span class="caps tiny">${esc(t.ten)} · ${esc(t.nganHang)}</span><b>${esc(t.stk)}</b><button type="button" class="btn" data-copy="${esc(t.stk)}">Chép số</button></div>`).join("");
  $("[data-story]").innerHTML = C.chuyenTinh.map((p) => `<p>${esc(p)}</p>`).join("");

  // ----- ảnh: thiếu file thì hiện khung trống -----
  if (C.anhDenTrang) document.body.classList.add("bw");
  $$("[data-photo]").forEach((el) => {
    const src = C.anh[+el.dataset.photo];
    el.classList.add("empty");
    if (!src) return;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${src}")`; el.classList.remove("empty"); };
    img.src = src;
  });

  // ----- hình viền lượn: thiệp chính + bông tròn -----
  function scallopRect(w, h, m, r) {
    const nx = Math.round((w - 2 * m) / (2 * r)), ny = Math.round((h - 2 * m) / (2 * r));
    const rx = (w - 2 * m) / (2 * nx), ry = (h - 2 * m) / (2 * ny);
    let d = `M${m} ${m}`;
    for (let i = 0; i < nx; i++) d += `a${rx} ${rx} 0 0 1 ${2 * rx} 0`;
    for (let i = 0; i < ny; i++) d += `a${ry} ${ry} 0 0 1 0 ${2 * ry}`;
    for (let i = 0; i < nx; i++) d += `a${rx} ${rx} 0 0 1 ${-2 * rx} 0`;
    for (let i = 0; i < ny; i++) d += `a${ry} ${ry} 0 0 1 0 ${-2 * ry}`;
    return d + "z";
  }
  $$(".scallop").forEach((s) => {
    $(".sc-out", s).setAttribute("d", scallopRect(400, 560, 22, 22));
    const inn = $(".sc-in", s);
    inn.setAttribute("d", scallopRect(400, 560, 22, 22));
    inn.setAttribute("transform", "translate(200 280) scale(.955 .968) translate(-200 -280)");
  });
  function scallopCircle(cx, cy, R, n) {
    const p = (i) => [cx + R * Math.cos((i / n) * 2 * Math.PI - Math.PI / 2), cy + R * Math.sin((i / n) * 2 * Math.PI - Math.PI / 2)];
    const r = R * Math.sin(Math.PI / n) * 1.15;
    let d = `M${p(0).join(" ")}`;
    for (let i = 1; i <= n; i++) d += `A${r} ${r} 0 0 1 ${p(i).join(" ")}`;
    return d + "z";
  }
  $$(".ros").forEach((p) => p.setAttribute("d", scallopCircle(150, 150, 118, 12)));

  // ----- cành lá vẽ tay -----
  function sprig(seed) {
    let s = seed; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    let out = "";
    const stems = [[60, 180, 120, 20], [100, 185, 190, 60], [40, 175, 20, 70]];
    stems.forEach(([x1, y1, x2, y2], k) => {
      const cx = (x1 + x2) / 2 + (k - 1) * 30, cy = (y1 + y2) / 2;
      out += `<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" stroke="#6F7A55" stroke-width="1.6" fill="none"/>`;
      for (let t = 0.2; t < 0.95; t += 0.14) {
        const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2, y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2;
        const ang = (rnd() * 60 + 20) * (rnd() > .5 ? 1 : -1) - 90;
        out += `<ellipse cx="${x}" cy="${y}" rx="11" ry="4.2" fill="${rnd() > .4 ? "#7C875F" : "#A9B094"}" transform="rotate(${ang} ${x} ${y}) translate(9 0)"/>`;
      }
      const fl = (x, y, r) => [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - r}" rx="${r * .55}" ry="${r}" fill="#FBF8F0" stroke="#D8D2C2" stroke-width=".6" transform="rotate(${a + rnd() * 10} ${x} ${y})"/>`).join("") + `<circle cx="${x}" cy="${y}" r="${r * .35}" fill="#D9C78F"/>`;
      out += fl(x2, y2, 9 + rnd() * 4);
    });
    return `<svg viewBox="0 0 220 200" aria-hidden="true">${out}</svg>`;
  }
  $$("[data-sprig]").forEach((e, i) => (e.innerHTML = sprig(7 + i * 13)));

  // ----- chuyển trang -----
  function route() {
    const r = location.hash.slice(1);
    const page = $$("[data-page]").find((p) => p.dataset.page === r) || $('[data-page=""]');
    $$("[data-page]").forEach((p) => (p.hidden = p !== page));
    window.scrollTo(0, 0);
    document.title = (page.getAttribute("aria-label") || "Thiệp cưới") + ` — ${a} & ${b}`;
  }
  addEventListener("hashchange", route);
  route();

  $("#env").addEventListener("click", (e) => {
    e.currentTarget.classList.add("open");
    tryMusic();
    setTimeout(() => (location.hash = "thiep"), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1900);
  });

  // ----- nhạc: có file thiep/nhac.mp3 thì hiện đĩa -----
  const audio = $("#music"), disc = $("#disc");
  if (C.nhac) {
    audio.src = C.nhac;
    audio.addEventListener("canplay", () => (disc.hidden = false), { once: true });
    audio.load();
  }
  const sync = () => { disc.classList.toggle("playing", !audio.paused); disc.setAttribute("aria-label", audio.paused ? "Phát nhạc" : "Tạm dừng nhạc"); };
  audio.addEventListener("play", sync); audio.addEventListener("pause", sync);
  disc.addEventListener("click", () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
  function tryMusic() { if (C.nhac && audio.readyState > 0) audio.play().catch(() => {}); }

  // ----- đếm ngược -----
  const cd = $("#cd");
  function tick() {
    let s = Math.max(0, Math.floor((when - Date.now()) / 1000));
    if (s === 0) { cd.innerHTML = `<span class="script" style="font-size:60px">Hôm nay là ngày vui!</span>`; return; }
    const parts = [[Math.floor(s / 86400), "ngày"], [Math.floor(s / 3600) % 24, "giờ"], [Math.floor(s / 60) % 60, "phút"], [s % 60, "giây"]];
    cd.innerHTML = parts.map(([v, l]) => `<div><span>${String(v).padStart(2, "0")}</span><small>${l}</small></div>`).join('<span class="sep">:</span>');
  }
  tick(); setInterval(tick, 1000);

  // ----- xác nhận tham dự -----
  const form = $("#rsvp"), note = $("#rsvpNote");
  $("[data-rsvp-actions]").innerHTML = (C.linkXacNhan ? `<a class="btn solid" href="${esc(C.linkXacNhan)}" target="_blank" rel="noopener">Điền phiếu xác nhận</a>` : "")
    + (C.dienThoai ? `<button class="btn solid" type="submit" value="sms">Gửi tin nhắn cho chúng mình</button>` : "")
    + `<button class="btn" type="submit" value="copy">Chép lời nhắn${C.dienThoai ? " để gửi Zalo" : ""}</button>`;
  const message = () => {
    const f = Object.fromEntries(new FormData(form));
    return `Mình là ${f.ten} (khách ${f.ben.toLowerCase()}). ${f.den === "Sẽ đến" ? `Mình sẽ đến dự, đi ${f.so} người.` : "Tiếc quá, mình không đến được."}${f.loi ? ` Lời nhắn: ${f.loi}` : ""}`;
  };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = message();
    if (e.submitter && e.submitter.value === "sms") { location.href = `sms:${C.dienThoai}?&body=${encodeURIComponent(text)}`; return; }
    try { await navigator.clipboard.writeText(text); note.textContent = "Đã chép lời nhắn — dán vào Zalo gửi chúng mình nhé!"; }
    catch { note.textContent = text; }
    if (C.dienThoai) window.open(`https://zalo.me/${C.dienThoai}`, "_blank", "noopener");
  });
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = "Đã chép"; } catch { b.textContent = b.dataset.copy; }
  });
})();
