/* Hẹn Ước — sổ tay kế hoạch cưới. Dữ liệu lưu trong localStorage. */
(() => {
  "use strict";

  const KEY = "henuoc-v1";
  const DATA_VERSION = 2;
  const STATUSES = ["Chưa có gì", "Đang cân nhắc", "Đã tìm đơn vị", "Đã đặt cọc", "Hoàn tất"];
  const STATUS_TONE = { "Chưa có gì": "", "Đang cân nhắc": "sand", "Đã tìm đơn vị": "stone", "Đã đặt cọc": "primary", "Hoàn tất": "done" };
  const PROC_STATUSES = ["Chưa có gì", "Đang tìm hiểu", "Đã hẹn", "Hoàn tất"];
  const PROC_TONE = { "Chưa có gì": "", "Đang tìm hiểu": "sand", "Đã hẹn": "stone", "Hoàn tất": "done" };
  const VENDOR_STATUSES = ["Xem xét liên hệ", "Đã liên hệ", "Đặt cọc", "Loại"];
  const VENDOR_TONE = { "Xem xét liên hệ": "sand", "Đã liên hệ": "stone", "Đặt cọc": "done", "Loại": "" };
  const PAYERS = ["Tiền mình", "Tiền chồng", "Gia đình"];
  const PAYER_HEX = { "Tiền mình": "#B97862", "Tiền chồng": "#3F5B45", "Gia đình": "#9AA7A9" };
  const SIDES = ["Nhà gái", "Nhà trai", "Chung"];
  const SIDE_HEX = { "Nhà gái": "#B97862", "Nhà trai": "#3F5B45", "Chung": "#9AA7A9" };
  const SEND_VIA = ["Online", "Thiệp giấy", "Đến nhà"];
  const CAT_HEX = ["#3F5B45", "#A9BFA6", "#6E8B70", "#C9D6C3", "#B08A5B", "#DCC8A5", "#9AA7A9", "#7E9A7F", "#C7B08A"];
  const CAT_TONES = [["var(--primary-soft)", "var(--primary-text)"], ["var(--sand-soft)", "var(--sand-text)"], ["var(--stone-soft)", "var(--stone-text)"], ["var(--clay-soft)", "var(--clay-text)"]];
  const PROC_KIND_ICON = { "Giấy tờ": "doc", "Sức khỏe": "health", "Học": "book", "Bảo hiểm": "shield" };
  // giai đoạn → số ngày còn lại tối thiểu khi bước vào giai đoạn đó
  const PHASE_MIN_DAYS = [330, 240, 150, 90, 60, 14, 5, 1, 0];

  const ICONS = {
    home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
    checklist: "M9 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3M9 4a3 3 0 0 0 6 0M9 4a3 3 0 0 1 6 0M8.5 13l2.5 2.5 4.5-5",
    budget: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M16 15h2",
    guests: "M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6",
    seating: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
    dayof: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    vendors: "M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6",
    procedures: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
    extras: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    settings: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M16 4v4M10 10v4M18 16v4",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5",
    calendar: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M8 3v4M16 3v4",
    pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    image: "M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5-9 9",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5M12 16h.01",
    bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z",
    upload: "M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
    chevron: "m6 9 6 6 6-6",
    back: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3",
    x: "M6 6l12 12M18 6 6 18",
    check: "m5 12 5 5 9-10",
    edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
    plus: "M12 5v14M5 12h14",
    health: "M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z",
    shot: "M18 2l4 4M17 7l3-3M19 9 9 19l-4 1 1-4L16 6zM14 8l2 2",
    book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7",
    shield: "M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z",
    doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
    more: "M4 6h16M4 12h16M4 18h16",
    print: "M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z",
  };
  const icon = (n, s = 20, extra = "") => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}><path d="${ICONS[n]}"/></svg>`;

  // ---------- helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const uid = () => Math.random().toString(36).slice(2, 10);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => (Number(n) || 0).toLocaleString("vi-VN") + " đ";
  const short = (n) => {
    n = Number(n) || 0;
    if (Math.abs(n) >= 1e9) return +(n / 1e9).toFixed(2) + " tỷ";
    if (Math.abs(n) >= 1e6) return +(n / 1e6).toFixed(1) + " triệu";
    if (Math.abs(n) >= 1e3) return +(n / 1e3).toFixed(0) + "k";
    return n + " đ";
  };
  const shortTr = (n) => (n >= 1e6 ? +(n / 1e6).toFixed(1) + "tr" : short(n));
  const pct = (a, b) => (b > 0 ? Math.min(100, Math.round((a / b) * 100)) : 0);
  const parseMoney = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;
  const toDate = (iso) => new Date(iso + "T00:00:00");
  const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const dd = (d) => `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
  const WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const WDL = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const fmtDate = (iso) => (iso ? `${WD[toDate(iso).getDay()]}, ${dd(toDate(iso))}` : "");
  const fmtLong = (iso) => (iso ? `${WDL[toDate(iso).getDay()]}, ${dd(toDate(iso))}` : "");
  const initials = (s) => String(s).trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  // ---------- state ----------
  function seedParts() {
    const tasks = [];
    Object.entries(SEED_TIMELINE).forEach(([phase, list]) =>
      list.forEach(([title, done]) => tasks.push({ id: uid(), kind: "tl", phase, title, status: done ? "Hoàn tất" : "Chưa có gì" })));
    Object.entries(SEED_CATEGORIES).forEach(([group, list]) =>
      list.forEach(([title, pic, prep, status]) => tasks.push({ id: uid(), kind: "cat", group, title, pic, prep, status })));
    const guests = [];
    // hai dạng: [số khách, số đã gửi] (tên mẫu) hoặc "Tên,*Tên chưa gửi,…" (danh sách thật, xem private/)
    Object.entries(SEED_GUESTS_BRIDE).forEach(([k, v]) => {
      const [event, group] = k.split("|");
      const rows = Array.isArray(v)
        ? Array.from({ length: v[0] }, (_, i) => ({ name: `${group} ${i + 1}`, sent: i < v[1] }))
        : v.split(",").map((raw) => ({ name: raw.replace("*", "").trim(), sent: !raw.startsWith("*") }));
      rows.forEach(({ name, sent }) => guests.push({ id: uid(), name, side: "Nhà gái", event, group, count: 1, phone: "", sendVia: event === "Lễ ăn hỏi" ? "Online" : "", sent, note: "" }));
    });
    const team = [];
    SEED_TEAM.forEach(([role, n, fee]) => { for (let i = 0; i < n; i++) team.push({ id: uid(), name: "", role, fee, size: "", phone: "", ok: false }); });
    const music = [];
    Object.entries(SEED_MUSIC).forEach(([moment, list]) => list.forEach((s) => { const [title, artist = ""] = s.split(" – "); music.push({ id: uid(), moment, title, artist }); }));
    return {
      tasks, guests, team, music,
      expenses: SEED_EXPENSES.map(([name, cat, payer, cost = 0, deposit = 0]) => ({ id: uid(), name, cat, payer, cost, deposit, date: "", due: "", vendorId: "", source: "", note: "" })),
      budgetCats: { ...SEED_BUDGET_CATS },
      events: SEED_EVENTS.map(([name, date, main]) => ({ name, date, place: "", main: !!main })),
      people: [...SEED_PEOPLE],
      procedures: SEED_PROCEDURES.map(([name, kind, pic, status, place, note]) => ({ id: uid(), name, kind, pic, status, place, date: "", cost: 0, note })),
      regDocs: SEED_REG_DOCS.map(([name, note]) => ({ id: uid(), name, note, done: false })),
      vendors: SEED_VENDORS.map(([cat, name, desc, price, status]) => ({ id: uid(), cat, name, desc, price, status, contact: "", note: "" })),
      script: { "Tiệc thân mật": SEED_SCRIPT.map(([part, time, text, mins, music, key]) => ({ id: uid(), part, time, text, mins, music, key: !!key })) },
      after: SEED_AFTER.map((name) => ({ id: uid(), name, pic: "", done: false })),
      halls: {},
    };
  }
  function seed() {
    return { v: DATA_VERSION, settings: { bride: "Thu Hương", groom: "Minh Quân", date: "2027-10-26", venue: "", budget: 200e6, guestTarget: 0, cover: "" }, ui: { seatEvent: "Tiệc nhà gái" }, ...seedParts() };
  }
  // bổ sung khoá thiếu (dữ liệu từ bản trước / file nhập)
  function normalize(s) {
    let fresh = null;
    const f = () => (fresh ||= seedParts());
    ["tasks", "guests", "expenses", "team", "music", "procedures", "regDocs", "vendors", "after", "people"].forEach((k) => { if (!Array.isArray(s[k])) s[k] = f()[k]; });
    if (!s.budgetCats) s.budgetCats = f().budgetCats;
    if (!s.script) s.script = f().script;
    if (!s.halls) s.halls = {};
    if (!Array.isArray(s.events)) {
      s.events = f().events;
      if (s.settings && s.settings.date) s.events.find((e) => e.main).date = s.settings.date;
    }
    if (!s.events.some((e) => e.main)) s.events[s.events.length - 1].main = true;
    s.settings ||= {}; s.settings.budget = +s.settings.budget || 0; s.settings.cover ||= "";
    s.ui ||= {}; s.ui.seatEvent ||= "Tiệc nhà gái";
    s.expenses.forEach((e) => { e.cost = +e.cost || 0; e.deposit = Math.min(+e.deposit || 0, e.cost || +e.deposit || 0); e.due ||= ""; e.vendorId ||= ""; e.source ||= ""; });
    s.guests.forEach((g) => { g.count = Math.max(1, +g.count || 1); g.sendVia ||= ""; });
    Object.values(s.halls).forEach((h) => { h.tables ||= []; h.assign ||= {}; });
    // nâng cấp dữ liệu cũ đúng một lần — việc người dùng đã xoá không bị thêm lại
    if ((s.v || 1) < 2 && !s.tasks.some((t) => t.group === "Dạm ngỏ · phân công gia đình"))
      s.tasks.push(...f().tasks.filter((t) => t.group === "Dạm ngỏ · phân công gia đình"));
    s.v = DATA_VERSION;
    s.settings.date = (s.events.find((e) => e.main) || {}).date || s.settings.date;
    return s;
  }

  let state;
  try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) { state = null; }
  if (!state || !state.settings) state = seed();
  normalize(state);
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { toast("Không lưu được — bộ nhớ trình duyệt đầy hoặc bị chặn"); }
  };

  const ui = {
    checklistTab: "tl", picFilter: "Tất cả", hideDone: false, collapsed: {},
    guestEvent: null, guestQ: "", unsentOnly: false, openGroups: {},
    budgetCat: null, vendorCat: VENDOR_CATS[0], dayEvent: "Tiệc thân mật", showTeam: false,
    selGuest: null, selTable: null, seatView: "2d", cam3d: null, guestFormTab: "one",
  };
  let viewCleanup = null;

  // ---------- toast & modal ----------
  let toastT;
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2200);
  }
  function openModal(title, html, onMount) {
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = html;
    $("#modal").hidden = false;
    onMount && onMount($("#modalBody"));
    const first = $("#modalBody input:not([type=radio]):not([type=checkbox]), #modalBody textarea, #modalBody select"); first && first.focus();
  }
  const closeModal = () => { $("#modal").hidden = true; };
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal" || e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  const opts = (list, cur) => list.map((o) => `<option ${o === cur ? "selected" : ""}>${esc(o)}</option>`).join("");
  // danh sách người phụ trách, giữ cả tên đang dùng nếu đã bị bỏ khỏi danh sách
  const peopleWith = (cur) => (cur && !state.people.includes(cur) ? [...state.people, cur] : state.people);
  const bar = (p, cls = "") => `<div class="bar ${cls}"><i style="width:${p}%"></i></div>`;
  const pill = (s, tone) => `<span class="pill ${tone ?? ""}">${esc(s)}</span>`;
  const seg = (name, list, cur) => `<div class="seg">${list.map((o) => `<label><input type="radio" name="${name}" value="${esc(o)}" ${o === cur ? "checked" : ""}>${esc(o)}</label>`).join("")}</div>`;
  const moneyInput = (name, val) => `<input class="input" name="${name}" inputmode="numeric" value="${val ? (+val).toLocaleString("vi-VN") : ""}" placeholder="0" data-money>`;
  function bindMoney(root) {
    $$("[data-money]", root).forEach((inp) => inp.addEventListener("input", () => {
      const n = parseMoney(inp.value); inp.value = n ? n.toLocaleString("vi-VN") : ""; inp.dispatchEvent(new Event("money"));
    }));
  }
  function download(name, text, type) {
    const a = document.createElement("a");
    a.href = typeof text === "string" && text.startsWith("data:") ? text : URL.createObjectURL(new Blob([text], { type }));
    a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  // ---------- derived ----------
  const phases = () => Object.keys(SEED_TIMELINE);
  const mainEvent = () => state.events.find((e) => e.main) || state.events[0];
  const mainDate = () => mainEvent().date || state.settings.date;
  const eventNames = () => state.events.map((e) => e.name);
  const daysLeft = () => Math.round((toDate(mainDate()) - today()) / 864e5);
  function currentPhaseIdx() {
    const d = daysLeft();
    const i = PHASE_MIN_DAYS.findIndex((m) => d >= m);
    return i === -1 ? PHASE_MIN_DAYS.length - 1 : i;
  }
  function phaseRange(i) {
    const w = toDate(mainDate());
    const end = addDays(w, -PHASE_MIN_DAYS[i]);
    if (i === PHASE_MIN_DAYS.length - 1) return fmtLong(mainDate());
    if (i === 0) return `Đến ${dd(end)}`;
    const start = addDays(w, -PHASE_MIN_DAYS[i - 1] + 1);
    return `${dd(start)} – ${dd(end)}`;
  }
  const isDone = (t) => t.status === "Hoàn tất";
  const eventKey = (name) => name.toLowerCase().replace(/^lễ\s+/, "");
  const tasksOfEvent = (name) => state.tasks.filter((t) => t.kind === "cat" && t.group.toLowerCase().includes(eventKey(name)));
  function budgetTotals() {
    const priced = state.expenses.filter((e) => e.cost > 0);
    const cost = priced.reduce((s, e) => s + e.cost, 0);
    const paid = state.expenses.reduce((s, e) => s + (+e.deposit || 0), 0);
    const byPayer = {}; PAYERS.forEach((p) => (byPayer[p] = { cost: 0, n: 0, unpriced: 0 }));
    state.expenses.forEach((e) => { const b = (byPayer[e.payer] ||= { cost: 0, n: 0, unpriced: 0 }); b.cost += e.cost; b.n++; if (!e.cost) b.unpriced++; });
    // còn phải trả tính theo từng khoản đã có giá — không bao giờ âm
    const remain = priced.reduce((s, e) => s + Math.max(0, e.cost - (+e.deposit || 0)), 0);
    return { cost, paid, remain, byPayer, priced: priced.length, total: state.expenses.length };
  }
  const budgetCatList = () => { const c = Object.keys(state.budgetCats); state.expenses.forEach((e) => { if (!c.includes(e.cat)) c.push(e.cat); }); return c; };
  const guestPeople = (list) => list.reduce((s, g) => s + (+g.count || 1), 0);
  const teamTotal = () => state.team.reduce((s, p) => s + (+p.fee || 0), 0);
  function outsideCosts() {
    const out = [];
    state.vendors.filter((v) => v.status === "Đặt cọc" && v.price > 0 && !state.expenses.some((e) => e.vendorId === v.id))
      .forEach((v) => out.push({ key: "v:" + v.id, name: `${v.name}`, src: `Nhà cung cấp · ${v.cat} · đã đặt cọc`, amt: v.price, prefill: { name: `${v.cat.split(" · ")[0]}: ${v.name}`, cost: v.price, vendorId: v.id } }));
    const tt = teamTotal();
    if (tt > 0 && !state.expenses.some((e) => e.source === "team"))
      out.push({ key: "team", name: "Bồi dưỡng đội hỗ trợ", src: `Kịch bản & đội hỗ trợ · ${state.team.length} người`, amt: tt, prefill: { name: "Bồi dưỡng đội hỗ trợ", cost: tt, source: "team" } });
    return out;
  }

  // ---------- nav & router ----------
  const NAV = [
    ["Kế hoạch", [["home", "Trang chủ"], ["checklist", "Checklist"], ["budget", "Ngân sách"]]],
    ["Khách & tiệc", [["guests", "Khách mời"], ["seating", "Sơ đồ bàn"], ["dayof", "Kịch bản & đội hỗ trợ"]]],
    ["Chuẩn bị", [["vendors", "Nhà cung cấp"], ["procedures", "Thủ tục & sức khỏe"], ["extras", "Nhạc & sau cưới"], ["settings", "Cài đặt"]]],
  ];
  function renderNav(r) {
    const badge = { checklist: state.tasks.filter((t) => !isDone(t)).length, guests: state.guests.length };
    $("#nav").innerHTML = NAV.map(([title, items]) => `<div class="nav-group"><div class="nav-title">${title}</div>${items.map(([k, label]) =>
      `<a href="#${k}" title="${label}" class="${k === r ? "active" : ""}" ${k === r ? 'aria-current="page"' : ""}>${icon(k)}<span>${label}</span>${badge[k] ? `<em>${badge[k]}</em>` : ""}</a>`).join("")}</div>`).join("");
    // thanh tab điện thoại: 4 trang chính + "Thêm" mở các trang còn lại
    const MAIN_TABS = [["home", "Trang chủ"], ["checklist", "Checklist"], ["budget", "Ngân sách"], ["guests", "Khách mời"]];
    const inMore = !MAIN_TABS.some(([k]) => k === r);
    $("#tabbar").innerHTML = MAIN_TABS.map(([k, label]) => `<a href="#${k}" class="${k === r ? "active" : ""}" ${k === r ? 'aria-current="page"' : ""}>${icon(k, 22)}<span>${label}</span></a>`).join("")
      + `<button type="button" id="moreBtn" class="${inMore ? "active" : ""}" aria-haspopup="dialog">${icon("more", 22)}<span>Thêm</span></button>`;
    $("#moreBtn").addEventListener("click", () => openModal("Tất cả trang", `<div class="sheet-links">${NAV.flatMap(([, items]) => items).map(([k, label]) =>
      `<a href="#${k}" class="${k === r ? "active" : ""}" data-close>${icon(k, 24)}<span>${label}</span></a>`).join("")}</div>`));
    const s = state.settings, d = daysLeft();
    $("#sideFoot").innerHTML = `<span class="avatar">${esc(initials(s.bride).slice(0, 1) + "&" + initials(s.groom).slice(0, 1))}</span>
      <span class="who"><b style="font-size:14px">${esc(String(s.bride).split(" ").pop())} &amp; ${esc(String(s.groom).split(" ").pop())}</b><span class="tiny muted">${d > 0 ? `Còn ${d} ngày` : d === 0 ? "Hôm nay!" : "Đã cưới"}</span></span>`;
  }
  const routes = { home: renderHome, checklist: renderChecklist, budget: renderBudget, guests: renderGuests, seating: renderSeating, dayof: renderDayOf, vendors: renderVendors, procedures: renderProcedures, extras: renderExtras, settings: renderSettings };
  const afterRender = {};
  function render() {
    let r = location.hash.slice(1) || "home";
    if (!routes[r]) r = "home";
    renderNav(r);
    if (viewCleanup) { viewCleanup(); viewCleanup = null; }
    $("#view").innerHTML = routes[r]();
    afterRender[r] && afterRender[r]();
  }
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
  const rerender = () => { save(); render(); };

  // ======================================================
  // TRANG CHỦ
  // ======================================================
  function coverHtml(cls = "photo") {
    const src = state.settings.cover;
    return `<figure class="${cls}">
      <div class="ph">${icon("image", 40)}<b>Ảnh cưới của bạn</b><span>Chọn ảnh trong Cài đặt, hoặc đặt file <b>cover.jpg</b> vào thư mục web</span></div>
      ${src ? `<img src="${esc(src)}" alt="Ảnh cưới">` : `<img src="cover.jpg" alt="Ảnh cưới" onerror="this.remove()">`}
    </figure>`;
  }
  function renderHome() {
    const s = state.settings, me = mainEvent();
    const d = daysLeft(), pi = currentPhaseIdx(), ph = phases();
    const done = state.tasks.filter(isDone).length;
    const phaseLeft = Math.max(0, d - PHASE_MIN_DAYS[pi]);
    const dueTl = state.tasks.filter((t) => t.kind === "tl" && !isDone(t) && ph.indexOf(t.phase) <= pi).sort((a, b) => ph.indexOf(a.phase) - ph.indexOf(b.phase));
    const curTl = dueTl.filter((t) => t.phase === ph[pi]).length;
    const inProg = state.tasks.filter((t) => t.kind === "cat" && ["Đang cân nhắc", "Đã tìm đơn vị", "Đã đặt cọc"].includes(t.status));
    const now = [...dueTl.slice(0, 3), ...inProg.slice(0, 5 - Math.min(3, dueTl.length))];
    const b = budgetTotals();
    const cats = budgetCatList();
    const alloc = cats.reduce((a, c) => a + (state.budgetCats[c] || 0), 0);
    let acc = 0;
    const donut = alloc ? cats.map((c, i) => { const p0 = acc; acc += ((state.budgetCats[c] || 0) / alloc) * 100; return `${CAT_HEX[i % CAT_HEX.length]} ${p0}% ${acc}%`; }).join(",") : "var(--line) 0 100%";
    // nhà cung cấp: mỗi hạng mục lấy đơn vị có tình trạng tốt nhất
    const rank = { "Đặt cọc": 0, "Đã liên hệ": 1, "Xem xét liên hệ": 2, "Loại": 9 };
    const vend = VENDOR_CATS.map((c) => {
      const list = state.vendors.filter((v) => v.cat === c && v.status !== "Loại").sort((a, b2) => rank[a.status] - rank[b2.status]);
      return list.length ? { c, v: list[0], n: list.length } : null;
    }).filter(Boolean).sort((a, b2) => rank[a.v.status] - rank[b2.v.status]).slice(0, 4);
    const evCounts = {}; state.guests.forEach((g) => (evCounts[g.event] = (evCounts[g.event] || 0) + 1));
    const topEv = Object.entries(evCounts).sort((a, b2) => b2[1] - a[1])[0];
    const topList = topEv ? state.guests.filter((g) => g.event === topEv[0]) : [];
    const sideTotal = (sd) => state.guests.filter((g) => g.side === sd);
    const evOfSide = (sd) => new Set(sideTotal(sd).map((g) => g.event)).size;

    return `<div class="wrap">
    <div class="page-head" style="align-items:center">
      <div><span class="small muted">${WDL[today().getDay()]}, ${dd(today())}</span>
        <h1>Chào ${esc(String(s.bride).split(" ").pop())} &amp; ${esc(String(s.groom).split(" ").pop())}</h1></div>
      <div class="actions">
        <button class="btn" data-go="expense">Thêm khoản chi</button>
        <button class="btn primary" data-go="task">Thêm việc</button>
      </div>
    </div>

    <section class="hero">
      <div class="hero-text">
        <span class="eyebrow">${icon("calendar", 16)} ${esc(me.name)} · ${esc(fmtLong(mainDate()))}</span>
        <div class="names">${esc(s.bride)}<br><em>&amp;</em> ${esc(s.groom)}</div>
        <span class="venue">${icon("pin", 16)} ${esc(me.place || s.venue || "Chưa có địa điểm — thêm trong Cài đặt")}</span>
        <div class="counters">
          <div class="counter"><b>${Math.max(0, d)}</b><span>${d > 0 ? "ngày nữa" : d === 0 ? "hôm nay!" : "ngày"}</span></div>
          <div class="counter"><b>${done}<small>/${state.tasks.length}</small></b><span>việc đã xong</span></div>
          <div class="counter"><b>${state.guests.length}</b><span>lượt mời</span></div>
        </div>
      </div>
      ${coverHtml()}
    </section>

    <section class="events-row" aria-label="Các lễ">
      ${state.events.map((e, i) => {
        const list = tasksOfEvent(e.name); const dn = list.filter(isDone).length;
        return `<a class="event-card ${e.main ? "main" : ""}" href="#settings">
          <span class="step">Lễ ${i + 1}</span><b>${esc(e.name.replace(/^Lễ (.)/, (_, c) => c.toUpperCase()))}</b>
          <span class="date ${e.date ? "set" : ""}">${e.date ? fmtDate(e.date) : "Chưa chọn ngày"}</span>
          ${list.length ? `<div style="margin-top:6px">${bar(pct(dn, list.length))}</div><span class="tiny" style="color:var(--text-2)">${dn}/${list.length} việc</span>` : `<span class="tiny muted" style="margin-top:6px">Chưa có việc</span>`}
        </a>`;
      }).join("")}
    </section>

    <div class="cols">
      <section class="card span-2">
        <div class="card-head"><div><h3>Việc cần làm ngay</h3><span class="sub">Giai đoạn ${esc(ph[pi])} · ${curTl ? `còn ${phaseLeft} ngày để xong ${curTl} việc` : "đã xong việc của giai đoạn này"}</span></div><a href="#checklist">Xem tất cả</a></div>
        ${now.length ? now.map((t) => taskRow(t, { late: t.kind === "tl" && ph.indexOf(t.phase) < pi, where: true })).join("") : `<div class="empty">Không có việc nào đang chờ 🎉</div>`}
      </section>
      <section class="card">
        <div class="card-head"><h3>Ngân sách</h3><a href="#budget">Chi tiết</a></div>
        <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
          <div class="donut" role="img" aria-label="Phân bổ ngân sách ${short(s.budget)} theo ${cats.length} hạng mục" style="background:conic-gradient(${donut})"><div><b style="font-size:20px">${shortTr(s.budget)}</b><span class="tiny muted">tổng</span></div></div>
          <div style="flex:1;min-width:150px;display:flex;flex-direction:column;gap:6px;font-size:13px">
            ${cats.map((c, i) => `<div style="display:flex;align-items:center;gap:8px"><i class="sq" style="background:${CAT_HEX[i % CAT_HEX.length]}"></i><span style="flex:1;color:var(--text-2)">${esc(c)}</span><b>${shortTr(state.budgetCats[c] || 0)}</b></div>`).join("")}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;border-top:1px solid var(--line-soft);padding-top:14px;margin-top:16px">
          <div style="display:flex;flex-direction:column"><span class="tiny muted">Đã nhập giá</span><b style="font-size:18px">${b.priced} / ${b.total} khoản</b></div>
          <div style="display:flex;flex-direction:column"><span class="tiny muted">Đã cọc / trả</span><b style="font-size:18px;color:var(--done)">${money(b.paid)}</b></div>
        </div>
      </section>
    </div>

    <div class="cols">
      <section class="card span-2">
        <div class="card-head"><h3>Nhà cung cấp đang làm việc</h3><a href="#vendors">Xem tất cả</a></div>
        ${vend.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">${vend.map(({ c, v, n }) => `
          <a href="#vendors" data-vcat="${esc(c)}" style="display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:16px;background:var(--bg);color:var(--ink)">
            <span class="tiny" style="font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)">${esc(c)}</span>
            <b>${esc(v.name)}</b>${pill(v.status, VENDOR_TONE[v.status])}
            <span class="small" style="color:var(--text-2)">${v.price ? money(v.price) : ""}${v.price && n > 1 ? " · " : ""}${n > 1 ? `${n} đơn vị đang so sánh` : ""}</span>
          </a>`).join("")}</div>` : `<div class="empty">Chưa có nhà cung cấp</div>`}
      </section>
      <section class="card">
        <div class="card-head"><h3>Khách mời</h3><a href="#guests">Danh sách</a></div>
        ${topEv ? `<div style="display:flex;align-items:baseline;gap:8px"><span style="font-size:40px;font-weight:700;line-height:1">${guestPeople(topList)}</span><span class="muted">khách ${esc(topEv[0].toLowerCase())}</span></div>
        <div style="margin:14px 0"><div class="bar-label"><span>Đã gửi thiệp</span><b style="color:var(--ink)">${topList.filter((g) => g.sent).length} / ${topList.length}</b></div>${bar(pct(topList.filter((g) => g.sent).length, topList.length), "lg")}</div>` : `<div class="empty">Chưa có khách</div>`}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:var(--clay-soft);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column"><span class="tiny" style="color:var(--clay-text);font-weight:600">Nhà gái</span><b style="font-size:22px">${guestPeople(sideTotal("Nhà gái"))}</b><span class="tiny" style="color:var(--clay-text)">${evOfSide("Nhà gái")} lễ</span></div>
          <div style="background:var(--primary-soft);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column"><span class="tiny" style="color:var(--primary-text);font-weight:600">Nhà trai</span><b style="font-size:22px">${guestPeople(sideTotal("Nhà trai"))}</b><span class="tiny" style="color:var(--primary-text)">${sideTotal("Nhà trai").length ? evOfSide("Nhà trai") + " lễ" : "chưa nhập"}</span></div>
        </div>
      </section>
    </div>
    </div>`;
  }
  afterRender.home = () => {
    bindTasks($("#view"));
    $$("[data-go]").forEach((b) => b.addEventListener("click", () => (b.dataset.go === "expense" ? expenseForm() : taskForm())));
    $$("[data-vcat]").forEach((a) => a.addEventListener("click", () => (ui.vendorCat = a.dataset.vcat)));
  };

  // ======================================================
  // CHECKLIST
  // ======================================================
  function taskRow(t, { late = false, where = false } = {}) {
    return `<div class="task ${isDone(t) ? "done" : ""}" data-id="${t.id}">
      <button class="check ${isDone(t) ? "on" : ""}" data-act="toggle" aria-label="${isDone(t) ? "Bỏ đánh dấu" : "Đánh dấu xong"}: ${esc(t.title)}"></button>
      <div class="task-body">
        <div class="task-title">${esc(t.title)}</div>
        <div class="task-meta">
          ${late ? pill("Trễ · " + t.phase, "clay") : ""}
          ${t.pic ? pill(t.pic, "primary") : ""}
          ${where ? pill(t.kind === "tl" ? t.phase : t.group) : ""}
          ${t.prep && !where ? pill(t.prep) : ""}
          ${t.kind === "cat" ? (where ? pill(t.status, STATUS_TONE[t.status]) : `<select class="status" data-act="status" aria-label="Tình trạng">${opts(STATUSES, t.status)}</select>`) : ""}
        </div>
      </div>
      <button class="icon-btn del" data-act="del" aria-label="Xoá việc">${icon("x", 16)}</button>
    </div>`;
  }
  function bindTasks(root) {
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]"); if (!btn) return;
      const row = btn.closest(".task"); if (!row) return;
      const t = state.tasks.find((x) => x.id === row.dataset.id); if (!t) return;
      if (btn.dataset.act === "toggle") {
        t.status = isDone(t) ? (t.kind === "cat" ? "Đang cân nhắc" : "Chưa có gì") : "Hoàn tất";
        rerender(); if (isDone(t)) toast("Xong một việc ✓");
      } else if (btn.dataset.act === "del") {
        if (confirm(`Xoá việc "${t.title}"?`)) { state.tasks = state.tasks.filter((x) => x !== t); rerender(); }
      }
    });
    root.addEventListener("change", (e) => {
      if (e.target.dataset.act !== "status") return;
      const t = state.tasks.find((x) => x.id === e.target.closest(".task").dataset.id);
      t.status = e.target.value; rerender();
    });
  }
  function renderChecklist() {
    const tab = ui.checklistTab, ph = phases(), pi = currentPhaseIdx();
    const all = state.tasks;
    const cnt = (f) => all.filter(f).length;
    const vis = (t) => !(ui.hideDone && isDone(t));
    let body;
    if (tab === "tl") {
      body = ph.map((p, i) => {
        const list = all.filter((t) => t.kind === "tl" && t.phase === p);
        const done = list.filter(isDone).length;
        const shown = list.filter(vis);
        const collapsed = ui.collapsed[p] ?? (i !== pi && i !== pi + 1);
        return `<section class="card phase ${i === pi ? "current" : ""} ${collapsed ? "collapsed" : ""}" data-phase="${esc(p)}">
          <div class="phase-head" role="button" tabindex="0" aria-expanded="${!collapsed}">
            <span class="badge ${done ? "some" : ""}">${i + 1}</span>
            <span class="title"><h3>${esc(p)} ${i === pi ? pill("Bây giờ", "solid") : ""}</h3><span class="small muted">${esc(phaseRange(i))}</span></span>
            <span class="prog">${bar(pct(done, list.length))}<span class="small" style="color:var(--text-2)">${done}/${list.length}</span></span>
            <span class="caret">${icon("chevron", 18)}</span>
          </div>
          <div class="phase-list">${shown.map((t) => taskRow(t)).join("") || `<div class="empty small">${list.length ? "Đã xong hết" : "Chưa có việc"}</div>`}</div>
        </section>`;
      }).join("");
    } else {
      const groups = [...new Set(all.filter((t) => t.kind === "cat").map((t) => t.group))];
      const f = ui.picFilter;
      body = groups.map((g) => {
        const list = all.filter((t) => t.kind === "cat" && t.group === g);
        const shown = list.filter((t) => vis(t) && (f === "Tất cả" || t.pic === f));
        if (!shown.length && f !== "Tất cả") return "";
        const done = list.filter(isDone).length;
        const collapsed = ui.collapsed["g:" + g];
        return `<section class="card phase ${collapsed ? "collapsed" : ""}" data-phase="g:${esc(g)}">
          <div class="phase-head" role="button" tabindex="0" aria-expanded="${!collapsed}">
            <span class="badge ${done ? "some" : ""}">${esc(g[0])}</span>
            <span class="title"><h3>${esc(g)}</h3><span class="small muted">${list.filter((t) => t.status !== "Chưa có gì" && !isDone(t)).length} việc đang làm</span></span>
            <span class="prog">${bar(pct(done, list.length))}<span class="small" style="color:var(--text-2)">${done}/${list.length}</span></span>
            <span class="caret">${icon("chevron", 18)}</span>
          </div>
          <div class="phase-list">${shown.map((t) => taskRow(t)).join("") || `<div class="empty small">Đã xong hết</div>`}</div>
        </section>`;
      }).join("") || `<div class="card empty">Không có việc nào khớp bộ lọc</div>`;
    }
    return `<div class="wrap">
      <div class="page-head">
        <div><h1>Checklist</h1><p>${cnt(isDone)} / ${all.length} việc đã xong · ${cnt((t) => t.kind === "tl")} việc theo mốc thời gian, ${cnt((t) => t.kind === "cat")} việc theo lễ</p></div>
        <button class="btn primary" id="addTask">${icon("plus", 18)} Thêm việc</button>
      </div>
      <div class="stats">
        <div class="stat"><span class="label">Hoàn tất</span><span class="value" style="color:var(--done)">${cnt(isDone)}</span></div>
        <div class="stat"><span class="label">Đã tìm đơn vị / đặt cọc</span><span class="value" style="color:var(--stone-text)">${cnt((t) => t.status === "Đã tìm đơn vị" || t.status === "Đã đặt cọc")}</span></div>
        <div class="stat"><span class="label">Đang cân nhắc</span><span class="value" style="color:var(--sand-text)">${cnt((t) => t.status === "Đang cân nhắc")}</span></div>
        <div class="stat"><span class="label">Chưa bắt đầu</span><span class="value">${cnt((t) => t.status === "Chưa có gì")}</span></div>
      </div>
      <div class="toolbar">
        <div class="tabs" role="tablist" aria-label="Cách xem">
          <button role="tab" aria-selected="${tab === "tl"}" class="${tab === "tl" ? "on" : ""}" data-t="tl">Theo mốc thời gian</button>
          <button role="tab" aria-selected="${tab === "cat"}" class="${tab === "cat" ? "on" : ""}" data-t="cat">Theo lễ &amp; hạng mục</button>
        </div>
        ${tab === "cat" ? `<div class="chips">${["Tất cả", ...state.people].map((c) => `<button class="chip ${c === ui.picFilter ? "on" : ""}" data-pf="${esc(c)}">${esc(c)}</button>`).join("")}</div>` : ""}
        <label class="check-label" style="margin-left:auto"><input type="checkbox" id="hideDone" ${ui.hideDone ? "checked" : ""}> Ẩn việc đã xong</label>
      </div>
      <div class="stack">${body}</div>
    </div>`;
  }
  afterRender.checklist = () => {
    bindTasks($("#view"));
    $$("[data-t]").forEach((b) => b.addEventListener("click", () => { ui.checklistTab = b.dataset.t; render(); }));
    $$("[data-pf]").forEach((b) => b.addEventListener("click", () => { ui.picFilter = b.dataset.pf; render(); }));
    $("#hideDone").addEventListener("change", (e) => { ui.hideDone = e.target.checked; render(); });
    $$(".phase-head").forEach((h) => {
      const tog = () => { const c = h.closest(".phase"); c.classList.toggle("collapsed"); ui.collapsed[c.dataset.phase] = c.classList.contains("collapsed"); h.setAttribute("aria-expanded", !ui.collapsed[c.dataset.phase]); };
      h.addEventListener("click", tog);
      h.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tog(); } });
    });
    $("#addTask").addEventListener("click", () => taskForm());
  };
  function taskForm() {
    const groups = [...new Set(state.tasks.filter((t) => t.kind === "cat").map((t) => t.group))];
    const tl = ui.checklistTab === "tl";
    openModal("Thêm việc", `
      <form id="tf" class="form-grid">
        <div class="field full"><label for="tf-title">Tên việc</label><input class="input" id="tf-title" name="title" required placeholder="VD: Đặt bánh cưới"></div>
        <div class="field full"><span>Loại</span>${seg("kind", ["Theo mốc thời gian", "Theo lễ"], tl ? "Theo mốc thời gian" : "Theo lễ")}</div>
        <div class="field full" data-k="tl"><label>Giai đoạn</label><select class="input" name="phase">${opts(phases(), phases()[currentPhaseIdx()])}</select></div>
        <div class="field" data-k="cat"><label>Lễ / hạng mục</label><input class="input" name="group" list="grpList" value="${esc(groups[0] || "")}"><datalist id="grpList">${groups.map((g) => `<option value="${esc(g)}">`).join("")}</datalist></div>
        <div class="field" data-k="cat"><label>Ai phụ trách</label><select class="input" name="pic">${opts(state.people)}</select></div>
        <div class="field" data-k="cat"><label>Thời gian chuẩn bị</label><input class="input" name="prep" placeholder="Trước 1 tháng"></div>
        <div class="field" data-k="cat"><label>Tình trạng</label><select class="input" name="status">${opts(STATUSES)}</select></div>
      </form>
      <div class="form-actions"><button class="btn" data-close>Huỷ</button><button class="btn primary" form="tf">Thêm</button></div>`,
    (m) => {
      const sync = () => { const k = $("[name=kind]:checked", m).value === "Theo lễ" ? "cat" : "tl"; $$("[data-k]", m).forEach((el) => (el.style.display = el.dataset.k === k ? "" : "none")); };
      $$("[name=kind]", m).forEach((r) => r.addEventListener("change", sync)); sync();
      $("#tf", m).addEventListener("submit", (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        state.tasks.push(f.kind === "Theo mốc thời gian" ? { id: uid(), kind: "tl", phase: f.phase, title: f.title, status: "Chưa có gì" }
          : { id: uid(), kind: "cat", group: f.group || "Khác", title: f.title, pic: f.pic, prep: f.prep, status: f.status });
        closeModal(); rerender(); toast("Đã thêm việc");
      });
    });
  }

  // ======================================================
  // NGÂN SÁCH
  // ======================================================
  function renderBudget() {
    const s = state.settings, b = budgetTotals();
    const cats = budgetCatList();
    const alloc = cats.reduce((a, c) => a + (state.budgetCats[c] || 0), 0);
    const unpriced = b.total - b.priced;
    const cur = ui.budgetCat && (cats.includes(ui.budgetCat) || ui.budgetCat === "*") ? ui.budgetCat : (cats.find((c) => state.expenses.some((e) => e.cat === c)) || "*");
    ui.budgetCat = cur;
    const rows = state.expenses.filter((e) => cur === "*" || e.cat === cur);
    const due = state.expenses.filter((e) => e.due && e.cost - e.deposit > 0).sort((a, b2) => a.due.localeCompare(b2.due));
    const out = outsideCosts();
    const paidW = pct(b.paid, s.budget), remW = pct(b.remain, s.budget);

    return `<div class="wrap">
      <div class="page-head">
        <div><h1>Ngân sách</h1><p>Tổng ${money(s.budget)} · ${alloc === s.budget ? `đã chia đủ cho ${cats.length} hạng mục` : alloc > s.budget ? `phân bổ vượt tổng ${short(alloc - s.budget)}` : `đã phân bổ ${short(alloc)}, còn ${short(s.budget - alloc)} chưa chia`}</p></div>
        <div class="actions"><button class="btn" id="addCat">Thêm hạng mục</button><button class="btn primary" id="addExp">${icon("plus", 18)} Thêm khoản chi</button></div>
      </div>

      <section class="card" style="display:flex;flex-direction:column;gap:18px">
        <div class="stats" style="gap:16px">
          <div style="display:flex;flex-direction:column"><span class="small" style="color:var(--text-2)">Tổng ngân sách</span><b style="font-size:28px">${short(s.budget)}</b><span class="tiny muted">đặt trong Cài đặt</span></div>
          <div style="display:flex;flex-direction:column"><span class="small" style="color:var(--text-2)">Chi phí đã nhập</span><b style="font-size:28px">${money(b.cost)}</b><span class="tiny muted">${b.priced} / ${b.total} khoản có giá</span></div>
          <div style="display:flex;flex-direction:column"><span class="small" style="color:var(--text-2)">Đã cọc / trả</span><b style="font-size:28px;color:var(--done)">${money(b.paid)}</b><span class="tiny muted">${pct(b.paid, b.cost)}% chi phí đã nhập</span></div>
          <div style="display:flex;flex-direction:column"><span class="small" style="color:var(--text-2)">Còn phải trả</span><b style="font-size:28px;color:var(--clay-text)">${money(b.remain)}</b><span class="tiny muted">${b.cost > s.budget ? `vượt ngân sách ${short(b.cost - s.budget)}` : `còn trống ${short(s.budget - b.cost)}`}</span></div>
        </div>
        <div>
          <div class="split" role="img" aria-label="Đã trả ${short(b.paid)}, còn phải trả ${short(b.remain)} trên ngân sách ${short(s.budget)}">
            <i style="width:${paidW}%;min-width:${b.paid ? 4 : 0}px;background:var(--primary)"></i><i style="width:${remW}%;min-width:${b.remain ? 4 : 0}px;background:#A9BFA6"></i>
          </div>
          <div class="legend" style="margin-top:8px"><span><i class="sq" style="background:var(--primary)"></i>Đã trả</span><span><i class="sq" style="background:#A9BFA6"></i>Còn phải trả</span><span><i class="sq" style="background:var(--line-soft);border:1px solid var(--field)"></i>Chưa dùng tới</span></div>
        </div>
        ${unpriced ? `<div class="note warn">${icon("info", 18)}<span>${unpriced} khoản chi chưa có giá. Nhập giá báo hoặc giá đã chốt để biết còn dư bao nhiêu.</span></div>` : ""}
      </section>

      <div class="cols">
        <section class="card span-2" style="padding-top:8px;padding-bottom:12px">
          <div class="card-head" style="padding-top:14px;margin-bottom:6px"><h3>Theo hạng mục</h3><span class="small muted">chi phí đã nhập / ngân sách</span></div>
          ${cats.map((c, i) => {
            const list = state.expenses.filter((e) => e.cat === c);
            const spent = list.reduce((a, e) => a + e.cost, 0);
            const cap = state.budgetCats[c] || 0;
            const miss = list.filter((e) => !e.cost).length;
            const tone = CAT_TONES[i % CAT_TONES.length];
            return `<div class="cat-row" data-cat="${esc(c)}" role="button" tabindex="0">
              <span class="cat-ico" style="background:${tone[0]};color:${tone[1]}">${esc(c[0])}</span>
              <span style="display:flex;flex-direction:column;gap:6px;min-width:0">
                <span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="cat-name">${esc(c)}</span><span class="tiny muted">${list.length ? list.length + " khoản" : "chưa có khoản"}</span>${miss ? pill(miss + " chưa có giá", "sand") : ""}${cap && spent > cap ? pill("vượt " + short(spent - cap), "clay") : ""}</span>
                ${bar(pct(spent, cap || spent || 1), cap && spent > cap ? "over" : "")}
              </span>
              <span class="cat-amt"><b>${money(spent)}</b><span class="small muted">/ ${short(cap)}</span></span>
            </div>`;
          }).join("")}
        </section>
        <div class="stack" style="gap:24px">
          <section class="card">
            <div class="card-head"><h3>Ai chi</h3></div>
            ${PAYERS.map((p) => { const x = b.byPayer[p]; return `<div style="display:flex;flex-direction:column;gap:4px;padding:8px 0">
              <div style="display:flex;justify-content:space-between;font-size:14px"><span style="display:inline-flex;gap:8px;align-items:center"><i class="dot" style="background:${PAYER_HEX[p]}"></i>${p}</span><b>${money(x.cost)}</b></div>
              <span class="tiny muted">${x.n ? `${x.n} khoản${x.unpriced ? ` · ${x.unpriced === x.n ? "chưa có giá" : x.unpriced + " chưa có giá"}` : ""}` : "chưa có khoản nào"}</span></div>`; }).join("")}
          </section>
          <section class="card">
            <div class="card-head"><h3>Sắp phải thanh toán</h3></div>
            ${due.length ? due.slice(0, 5).map((e) => { const dl = Math.round((toDate(e.due) - today()) / 864e5); return `<div class="row-line" data-exp="${e.id}" style="cursor:pointer">
              <span style="flex:1;display:flex;flex-direction:column;min-width:0"><b class="small">${esc(e.name)}</b><span class="tiny ${dl < 0 ? "" : "muted"}" style="${dl < 0 ? "color:var(--clay-text)" : ""}">${dl < 0 ? `Quá hạn ${-dl} ngày` : dl === 0 ? "Hôm nay" : `${fmtDate(e.due)} · còn ${dl} ngày`}</span></span>
              <b class="small">${money(e.cost - e.deposit)}</b></div>`; }).join("")
            : `<div class="empty" style="background:var(--bg);border-radius:16px;padding:18px">${icon("calendar", 26)}<div class="small" style="margin-top:6px">Chưa có hạn thanh toán nào. Thêm “hạn trả nốt” khi cọc để được nhắc.</div></div>`}
          </section>
          ${out.length ? `<section class="card">
            <div class="card-head"><div><h3>Chi phí ở nơi khác</h3><span class="sub">Có trong dữ liệu nhưng chưa nằm trong ngân sách</span></div></div>
            ${out.map((o) => `<div class="row-line"><span style="flex:1;display:flex;flex-direction:column;min-width:0"><b class="small">${esc(o.name)}</b><span class="tiny muted">${esc(o.src)}</span></span><b class="small">${money(o.amt)}</b><button class="btn sm soft" data-merge="${esc(o.key)}">Gộp</button></div>`).join("")}
          </section>` : ""}
        </div>
      </div>

      <section class="card" id="expTable">
        <div class="card-head">
          <div><h3>${cur === "*" ? "Tất cả khoản chi" : esc(cur)} <span class="muted" style="font-weight:500">· ${rows.length} khoản</span></h3><span class="sub">Bấm một dòng để sửa giá, số đã cọc và hạn trả</span></div>
          <select class="input" id="catSel" style="width:auto;min-width:200px" aria-label="Chọn hạng mục"><option value="*" ${cur === "*" ? "selected" : ""}>Tất cả hạng mục</option>${cats.map((c) => `<option ${c === cur ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
        </div>
        <div class="table-wrap"><table class="list stack" style="min-width:680px">
          <thead><tr><th>Khoản chi</th><th>Người chi</th><th class="num">Chi phí</th><th class="num">Đã cọc</th><th class="num">Còn lại</th><th>Hạn trả</th></tr></thead>
          <tbody>${rows.map((e) => `<tr class="click" data-exp="${e.id}">
            <td><div style="font-weight:500">${esc(e.name)}</div>${cur === "*" ? `<div class="tiny muted">${esc(e.cat)}</div>` : ""}</td>
            <td data-label="Người chi">${pill(e.payer, e.payer === "Tiền mình" ? "clay" : e.payer === "Tiền chồng" ? "primary" : "stone")}</td>
            <td data-label="Chi phí" class="num">${e.cost ? money(e.cost) : pill("Chưa nhập giá", "sand")}</td>
            <td data-label="Đã cọc" class="num ${e.deposit ? "" : "muted"}">${e.deposit ? money(e.deposit) : "—"}</td>
            <td data-label="Còn lại" class="num">${e.cost ? (e.cost - e.deposit > 0 ? `<b>${money(e.cost - e.deposit)}</b>` : pill("Đã trả đủ", "done")) : `<span class="muted">—</span>`}</td>
            <td data-label="Hạn trả" class="${e.due ? "" : "muted"}">${e.due ? fmtDate(e.due) : "—"}</td>
          </tr>`).join("") || `<tr><td colspan="6" class="empty">Chưa có khoản chi</td></tr>`}</tbody>
        </table></div>
      </section>
    </div>`;
  }
  afterRender.budget = () => {
    $("#addExp").addEventListener("click", () => expenseForm(null, ui.budgetCat !== "*" ? { cat: ui.budgetCat } : {}));
    $("#addCat").addEventListener("click", () => catForm());
    $("#catSel").addEventListener("change", (e) => { ui.budgetCat = e.target.value; render(); });
    $$("[data-exp]").forEach((r) => r.addEventListener("click", () => expenseForm(state.expenses.find((e) => e.id === r.dataset.exp))));
    $$("[data-cat]").forEach((r) => {
      const go = () => { ui.budgetCat = r.dataset.cat; render(); $("#expTable").scrollIntoView({ behavior: "smooth", block: "start" }); };
      r.addEventListener("click", go); r.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
      r.addEventListener("dblclick", () => catForm(r.dataset.cat));
    });
    $$("[data-merge]").forEach((b) => b.addEventListener("click", () => { const o = outsideCosts().find((x) => x.key === b.dataset.merge); o && expenseForm(null, o.prefill); }));
  };
  function expenseForm(exp, preset = {}) {
    const isNew = !exp;
    const e = exp || { name: "", cat: Object.keys(state.budgetCats)[0], payer: PAYERS[0], cost: 0, deposit: 0, date: "", due: "", vendorId: "", source: "", note: "", ...preset };
    const vendors = state.vendors.filter((v) => v.status !== "Loại" || v.id === e.vendorId);
    openModal(isNew ? "Thêm khoản chi" : "Sửa khoản chi", `
      <form id="ef" class="form-grid">
        <div class="field full"><label for="ef-name">Khoản chi</label><input class="input" id="ef-name" name="name" required value="${esc(e.name)}" placeholder="VD: Đặt cọc nhà hàng"></div>
        <div class="field"><label>Hạng mục</label><select class="input" name="cat">${opts(budgetCatList(), e.cat)}</select></div>
        <div class="field"><label>Nhà cung cấp</label><select class="input" name="vendorId"><option value="">Không gắn</option>${vendors.map((v) => `<option value="${v.id}" ${v.id === e.vendorId ? "selected" : ""}>${esc(v.name)} · ${esc(v.cat.split(" · ")[0])}</option>`).join("")}</select></div>
        <div class="field full"><span>Ai chi</span>${seg("payer", PAYERS, e.payer)}</div>
        <div class="field"><label>Chi phí</label>${moneyInput("cost", e.cost)}</div>
        <div class="field"><label>Đã cọc / trả</label>${moneyInput("deposit", e.deposit)}</div>
        <div class="full chips">${[["+1 triệu", 1e6], ["+5 triệu", 5e6], ["+10 triệu", 10e6]].map(([l, v]) => `<button type="button" class="chip" data-add="${v}">${l}</button>`).join("")}<button type="button" class="chip" data-dep="0.3">Cọc 30%</button><button type="button" class="chip" data-dep="1">Trả đủ</button></div>
        <div class="field"><label>Ngày cọc</label><input class="input" type="date" name="date" value="${esc(e.date)}"></div>
        <div class="field"><label>Hạn trả nốt</label><input class="input" type="date" name="due" value="${esc(e.due)}"></div>
        <div class="field full"><label>Ghi chú</label><input class="input" name="note" value="${esc(e.note)}" placeholder="VD: trả nốt trước cưới 30 ngày"></div>
        <div class="full" style="display:flex;justify-content:space-between;align-items:center;background:var(--surface-2);border-radius:14px;padding:12px 14px"><span class="small" style="color:var(--primary-text)">Còn phải trả</span><b id="ef-remain" style="font-size:18px;color:var(--primary-text)"></b></div>
      </form>
      <div class="form-actions">
        ${isNew ? "" : `<button class="btn ghost danger" id="delExp" style="margin-right:auto">Xoá</button>`}
        <button class="btn" data-close>Huỷ</button><button class="btn primary" form="ef">Lưu</button>
      </div>`,
    (m) => {
      bindMoney(m);
      const cost = $("[name=cost]", m), dep = $("[name=deposit]", m), rem = $("#ef-remain", m);
      const upd = () => { const r = parseMoney(cost.value) - parseMoney(dep.value); rem.textContent = parseMoney(cost.value) ? (r >= 0 ? money(r) : "Số cọc lớn hơn chi phí") : "—"; rem.style.color = r < 0 ? "var(--clay-text)" : ""; };
      [cost, dep].forEach((i) => { i.addEventListener("input", upd); }); upd();
      $$("[data-add]", m).forEach((c) => c.addEventListener("click", () => { cost.value = (parseMoney(cost.value) + +c.dataset.add).toLocaleString("vi-VN"); upd(); }));
      $$("[data-dep]", m).forEach((c) => c.addEventListener("click", () => { const v = Math.round(parseMoney(cost.value) * +c.dataset.dep); dep.value = v ? v.toLocaleString("vi-VN") : ""; upd(); }));
      $("#ef", m).addEventListener("submit", (ev) => {
        ev.preventDefault();
        const f = Object.fromEntries(new FormData(ev.target));
        const data = { ...f, cost: parseMoney(f.cost), deposit: parseMoney(f.deposit), source: e.source || "" };
        if (data.cost && data.deposit > data.cost) { toast("Số đã cọc không thể lớn hơn chi phí"); return; }
        if (isNew) state.expenses.push({ id: uid(), ...data }); else Object.assign(exp, data);
        const v = state.vendors.find((x) => x.id === data.vendorId);
        if (v && data.cost && !v.price) v.price = data.cost; // giữ giá nhà cung cấp khớp
        closeModal(); rerender(); toast("Đã lưu khoản chi");
      });
      const del = $("#delExp", m);
      del && del.addEventListener("click", () => { if (confirm("Xoá khoản chi này?")) { state.expenses = state.expenses.filter((x) => x !== exp); closeModal(); rerender(); } });
    });
  }
  function catForm(name) {
    const isNew = !name;
    openModal(isNew ? "Thêm hạng mục" : "Sửa hạng mục", `
      <form id="cf" class="form-grid">
        <div class="field"><label>Tên hạng mục</label><input class="input" name="name" required value="${esc(name || "")}" placeholder="VD: Tuần trăng mật"></div>
        <div class="field"><label>Ngân sách</label>${moneyInput("cap", state.budgetCats[name] || 0)}</div>
      </form>
      <div class="form-actions">
        ${isNew ? "" : `<button class="btn ghost danger" id="delCat" style="margin-right:auto">Xoá hạng mục</button>`}
        <button class="btn" data-close>Huỷ</button><button class="btn primary" form="cf">Lưu</button></div>`,
    (m) => {
      bindMoney(m);
      $("#cf", m).addEventListener("submit", (ev) => {
        ev.preventDefault();
        const f = Object.fromEntries(new FormData(ev.target));
        const nn = f.name.trim();
        if (!isNew && nn !== name) {
          state.budgetCats = Object.fromEntries(Object.entries(state.budgetCats).map(([k, v]) => (k === name ? [nn, v] : [k, v])));
          state.expenses.forEach((e) => { if (e.cat === name) e.cat = nn; });
          if (ui.budgetCat === name) ui.budgetCat = nn;
        }
        state.budgetCats[nn] = parseMoney(f.cap);
        closeModal(); rerender();
      });
      const del = $("#delCat", m);
      del && del.addEventListener("click", () => {
        const n = state.expenses.filter((e) => e.cat === name).length;
        if (confirm(n ? `Xoá hạng mục? ${n} khoản chi sẽ chuyển sang "Khác".` : "Xoá hạng mục?")) {
          delete state.budgetCats[name];
          if (!("Khác" in state.budgetCats)) state.budgetCats["Khác"] = 0;
          state.expenses.forEach((e) => { if (e.cat === name) e.cat = "Khác"; });
          closeModal(); rerender();
        }
      });
    });
  }

  // ======================================================
  // KHÁCH MỜI
  // ======================================================
  function tableNameOf(g) {
    const h = state.halls[g.event]; if (!h) return "";
    const t = h.tables.find((x) => x.id === h.assign[g.id]); return t ? t.name : "";
  }
  function renderGuests() {
    const g = state.guests;
    const evs = eventNames();
    const counts = {}; evs.forEach((e) => (counts[e] = guestPeople(g.filter((x) => x.event === e))));
    if (!ui.guestEvent) ui.guestEvent = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const ev = ui.guestEvent;
    const scope = ev === "*" ? g : g.filter((x) => x.event === ev);
    const label = ev === "*" ? "tất cả các lễ" : ev;
    const q = ui.guestQ.toLowerCase();
    const list = scope.filter((x) => (!ui.unsentOnly || !x.sent) && (!q || x.name.toLowerCase().includes(q) || (x.group || "").toLowerCase().includes(q)));
    const groups = {};
    scope.forEach((x) => (groups[x.group || "Chưa phân nhóm"] ||= []));
    list.forEach((x) => groups[x.group || "Chưa phân nhóm"].push(x));
    const bySide = (s) => guestPeople(scope.filter((x) => x.side === s));
    const sent = scope.filter((x) => x.sent).length;
    const unsent = scope.filter((x) => !x.sent);
    const unsentGroups = Object.entries(unsent.reduce((a, x) => ((a[x.group || "Chưa phân nhóm"] = (a[x.group || "Chưa phân nhóm"] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 2);
    const deadline = mainDate() ? dd(addDays(toDate(ev !== "*" && (state.events.find((e) => e.name === ev) || {}).date || mainDate()), -14)) : "";
    const h = ev !== "*" ? state.halls[ev] : null;
    const seated = h ? scope.filter((x) => h.tables.some((t) => t.id === h.assign[x.id])) : [];
    const cap = h ? h.tables.reduce((a, t) => a + t.seats, 0) : 0;
    const groupCount = new Set(scope.map((x) => x.group)).size;

    return `<div class="wrap">
      <div class="page-head">
        <div><h1>Khách mời</h1><p>Mỗi lễ là một danh sách riêng — số liệu bên dưới là của lễ đang chọn</p></div>
        <div class="actions"><button class="btn" id="pasteGuest">Dán từ Google Sheet</button><button class="btn primary" id="addGuest">${icon("plus", 18)} Thêm khách</button></div>
      </div>
      <div class="event-tabs" role="tablist" aria-label="Chọn lễ">
        ${evs.map((e) => `<button role="tab" aria-selected="${e === ev}" class="${e === ev ? "on" : ""} ${counts[e] ? "" : "empty"}" data-ev="${esc(e)}">${esc(e)} <span>${counts[e]}</span></button>`).join("")}
        <button role="tab" aria-selected="${ev === "*"}" class="${ev === "*" ? "on" : ""}" data-ev="*">Tất cả <span>${guestPeople(g)}</span></button>
      </div>
      <div class="stats">
        <div class="stat"><span class="label">Dự kiến tham dự</span><span class="value">${guestPeople(scope)}</span><span class="hint">${esc(label)}</span></div>
        <div class="stat"><span class="label" style="color:var(--clay-text);font-weight:600">Nhà gái</span><span class="value">${bySide("Nhà gái")}</span><span class="hint">${groupCount} nhóm</span></div>
        <div class="stat"><span class="label" style="color:var(--primary-text);font-weight:600">Nhà trai</span><span class="value">${bySide("Nhà trai")}</span><span class="hint">${bySide("Nhà trai") ? "" : "chưa nhập"}</span></div>
        <div class="stat"><span class="label">Đã gửi thiệp</span><span class="value">${sent} <small>/ ${scope.length}</small></span>${bar(pct(sent, scope.length))}</div>
      </div>
      <div class="cols">
        <section class="card span-2" style="padding-top:18px">
          <div class="toolbar" style="padding-bottom:8px">
            <label class="search soft" style="flex:1;min-width:180px">${icon("search", 18)}<input type="search" id="gq" placeholder="Tìm tên hoặc nhóm…" aria-label="Tìm khách" value="${esc(ui.guestQ)}"></label>
            <label class="check-label"><input type="checkbox" id="unsentOnly" ${ui.unsentOnly ? "checked" : ""}> Chỉ người chưa gửi thiệp</label>
          </div>
          ${Object.entries(groups).filter(([, items]) => items.length || (!q && !ui.unsentOnly)).map(([gname, items]) => {
            const all = scope.filter((x) => (x.group || "Chưa phân nhóm") === gname);
            const s2 = all.filter((x) => x.sent).length;
            const open = ui.openGroups[gname] || (!!q && items.length > 0);
            return `<div class="group-row ${open ? "open" : ""}" data-grp="${esc(gname)}">
              <div class="group-head" role="button" tabindex="0" aria-expanded="${open}">
                <span style="display:flex;flex-direction:column"><b>${esc(gname)}</b><span class="tiny muted">${guestPeople(all)} khách</span></span>
                ${bar(pct(s2, all.length))}
                <span class="small num" style="color:var(--text-2)">${s2}/${all.length}</span>
                <span class="caret">${icon("chevron", 16)}</span>
              </div>
              <div class="group-list">${items.map((x) => `<div class="guest" data-g="${x.id}">
                <i class="dot" style="background:${SIDE_HEX[x.side]}"></i>
                <span class="name">${esc(x.name)}${x.count > 1 ? ` <span class="muted small">+${x.count - 1}</span>` : ""}</span>
                ${ev === "*" ? pill(x.event) : ""}
                <span class="tiny muted">${esc(tableNameOf(x))}</span>
                <button class="pill ${x.sent ? "done" : "outline"}" data-sent>${x.sent ? "Đã gửi thiệp" : "Chưa gửi"}</button>
                <button class="icon-btn" data-edit aria-label="Sửa ${esc(x.name)}">${icon("edit", 16)}</button>
              </div>`).join("") || `<div class="empty small">Không có khách khớp bộ lọc</div>`}</div>
            </div>`;
          }).join("") || `<div class="empty">Chưa có khách nào — bấm “Thêm khách” hoặc dán danh sách từ Google Sheet</div>`}
        </section>
        <div class="stack" style="gap:24px">
          <section class="card" style="display:flex;flex-direction:column;gap:10px">
            <h3 style="font-size:17px">Còn phải gửi thiệp</h3>
            <span style="font-size:40px;font-weight:700;line-height:1">${unsent.length}</span>
            <span class="small" style="color:var(--text-2)">${unsent.length ? `${unsentGroups.length ? `Nhiều nhất ở ${unsentGroups.map(([n, c]) => `${esc(n)} (${c})`).join(" và ")}. ` : ""}Nên gửi trước 2 tuần${deadline ? ` — hạn ${deadline}` : ""}.` : "Đã gửi hết thiệp 🎉"}</span>
            ${unsent.length ? `<button class="btn soft" id="exportUnsent">Xuất danh sách chưa gửi</button>` : ""}
          </section>
          ${ev !== "*" ? `<a class="cta-card" href="#seating" id="toSeat">
            <span class="eyebrow">Sơ đồ bàn</span>
            <b style="font-size:20px">${h ? `${guestPeople(seated)} / ${guestPeople(scope)} khách có chỗ` : "Chưa xếp chỗ"}</b>
            <span class="small" style="color:var(--primary-soft)">${h ? `${h.tables.length} bàn · ${cap} ghế${cap - guestPeople(seated) > 0 ? ` · còn ${cap - guestPeople(seated)} ghế trống` : ""}` : `${esc(ev)} · bấm để bắt đầu`}</span>
            <span style="font-weight:600;margin-top:6px">Mở sơ đồ →</span>
          </a>` : ""}
        </div>
      </div>
    </div>`;
  }
  afterRender.guests = () => {
    const gq = $("#gq");
    gq.addEventListener("input", () => { ui.guestQ = gq.value; const pos = gq.selectionStart; render(); const n = $("#gq"); n.focus(); n.setSelectionRange(pos, pos); });
    $$("[data-ev]").forEach((b) => b.addEventListener("click", () => { ui.guestEvent = b.dataset.ev; render(); }));
    $("#unsentOnly").addEventListener("change", (e) => { ui.unsentOnly = e.target.checked; render(); });
    $("#addGuest").addEventListener("click", () => { ui.guestFormTab = "one"; guestForm(); });
    $("#pasteGuest").addEventListener("click", () => { ui.guestFormTab = "paste"; guestForm(); });
    const toSeat = $("#toSeat"); toSeat && toSeat.addEventListener("click", () => { state.ui.seatEvent = ui.guestEvent; save(); });
    const ex = $("#exportUnsent");
    ex && ex.addEventListener("click", () => {
      const scope = state.guests.filter((x) => !x.sent && (ui.guestEvent === "*" || x.event === ui.guestEvent));
      download("khach-chua-gui-thiep.csv", "﻿" + [["Họ tên", "Khách của", "Mời dự", "Nhóm", "SĐT"].map(csvCell).join(","), ...scope.map((x) => [x.name, x.side, x.event, x.group, x.phone].map(csvCell).join(","))].join("\n"), "text/csv");
    });
    $$(".group-head").forEach((h) => {
      const tog = () => { const r = h.closest(".group-row"); r.classList.toggle("open"); ui.openGroups[r.dataset.grp] = r.classList.contains("open"); h.setAttribute("aria-expanded", ui.openGroups[r.dataset.grp]); };
      h.addEventListener("click", tog); h.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tog(); } });
    });
    $$("[data-g]").forEach((row) => {
      const x = state.guests.find((g) => g.id === row.dataset.g);
      $("[data-sent]", row).addEventListener("click", () => { x.sent = !x.sent; rerender(); });
      $("[data-edit]", row).addEventListener("click", () => guestForm(x));
    });
  };
  function guestForm(guest) {
    const isNew = !guest;
    const defEv = ui.guestEvent && ui.guestEvent !== "*" ? ui.guestEvent : eventNames()[0];
    const x = guest || { name: "", side: "Nhà gái", event: defEv, group: "", count: 1, phone: "", sendVia: "", note: "", sent: false };
    const groups = [...new Set(state.guests.map((g) => g.group).filter(Boolean))];
    const paste = isNew && ui.guestFormTab === "paste";
    openModal(isNew ? "Thêm khách mời" : "Sửa khách mời", `
      ${isNew ? `<div class="tabs" role="tablist" style="display:grid;grid-template-columns:1fr 1fr;margin-bottom:16px">
        <button role="tab" aria-selected="${!paste}" class="${!paste ? "on" : ""}" data-gt="one">Từng người</button>
        <button role="tab" aria-selected="${paste}" class="${paste ? "on" : ""}" data-gt="paste">Dán từ Google Sheet</button></div>` : ""}
      <form id="gf" class="form-grid">
        ${paste
          ? `<div class="field full"><label for="gf-names">Dán cột tên — mỗi dòng một người</label><textarea class="input" id="gf-names" name="names" rows="6" required></textarea><span class="small" id="gf-parse" style="color:var(--done)"></span></div>`
          : `<div class="field full"><label for="gf-name">Họ tên</label><input class="input" id="gf-name" name="name" required value="${esc(x.name)}"></div>`}
        <div class="field"><span>Khách của</span>${seg("side", SIDES.slice(0, 2), x.side)}</div>
        <div class="field"><label>Mời dự</label><select class="input" name="event">${opts(eventNames(), x.event)}</select></div>
        <div class="field"><label>Nhóm / quan hệ</label><input class="input" name="group" list="gl" value="${esc(x.group)}" placeholder="VD: Bạn đại học"><datalist id="gl">${groups.map((g) => `<option value="${esc(g)}">`).join("")}</datalist></div>
        <div class="field"><label>Gửi thiệp qua</label><select class="input" name="sendVia"><option value="">—</option>${opts(SEND_VIA, x.sendVia)}</select></div>
        ${paste ? "" : `
        <div class="field"><label>Số người</label><input class="input" type="number" min="1" max="20" name="count" value="${x.count || 1}"></div>
        <div class="field"><label>SĐT / Zalo</label><input class="input" name="phone" value="${esc(x.phone)}"></div>
        <div class="field full"><label>Ghi chú</label><input class="input" name="note" value="${esc(x.note)}" maxlength="200"></div>
        <label class="check-label full"><input type="checkbox" name="sent" ${x.sent ? "checked" : ""}> Đã gửi thiệp</label>`}
      </form>
      <div class="form-actions">
        ${isNew ? "" : `<button class="btn ghost danger" id="delG" style="margin-right:auto">Xoá</button>`}
        <button class="btn" data-close>Huỷ</button><button class="btn primary" form="gf" id="gf-submit">${isNew ? (paste ? "Thêm khách" : "Thêm") : "Lưu"}</button></div>`,
    (m) => {
      $$("[data-gt]", m).forEach((b) => b.addEventListener("click", () => { ui.guestFormTab = b.dataset.gt; guestForm(); }));
      const parse = () => {
        const ev = $("[name=event]", m).value;
        const names = [...new Set($("#gf-names", m).value.split(/\r?\n/).map((s) => s.split("\t")[0].trim()).filter(Boolean))];
        const existing = new Set(state.guests.filter((g) => g.event === ev).map((g) => g.name.toLowerCase()));
        const fresh = names.filter((n) => !existing.has(n.toLowerCase()));
        return { fresh, dup: names.length - fresh.length };
      };
      if (paste) {
        const upd = () => { const { fresh, dup } = parse(); $("#gf-parse", m).textContent = fresh.length || dup ? `Nhận được ${fresh.length} tên${dup ? ` · bỏ qua ${dup} tên đã có trong lễ này` : " · không trùng với danh sách hiện có"}` : ""; $("#gf-submit", m).textContent = fresh.length ? `Thêm ${fresh.length} khách` : "Thêm khách"; };
        $("#gf-names", m).addEventListener("input", upd); $("[name=event]", m).addEventListener("change", upd);
      }
      $("#gf", m).addEventListener("submit", (ev) => {
        ev.preventDefault();
        const f = Object.fromEntries(new FormData(ev.target));
        if (paste) {
          const { fresh } = parse();
          fresh.forEach((name) => state.guests.push({ id: uid(), name, side: f.side, event: f.event, group: f.group, count: 1, phone: "", sendVia: f.sendVia, note: "", sent: false }));
          ui.guestEvent = f.event; closeModal(); rerender(); toast(`Đã thêm ${fresh.length} khách`); return;
        }
        const data = { name: f.name.trim(), side: f.side, event: f.event, group: f.group, sendVia: f.sendVia, count: Math.max(1, +f.count || 1), phone: f.phone, note: f.note, sent: !!f.sent };
        if (isNew) state.guests.push({ id: uid(), ...data }); else Object.assign(guest, data);
        closeModal(); rerender(); toast(isNew ? "Đã thêm khách" : "Đã lưu");
      });
      const del = $("#delG", m);
      del && del.addEventListener("click", () => {
        if (confirm(`Xoá ${guest.name}?`)) {
          state.guests = state.guests.filter((g) => g !== guest);
          Object.values(state.halls).forEach((h) => delete h.assign[guest.id]);
          closeModal(); rerender();
        }
      });
    });
  }

  // ======================================================
  // SƠ ĐỒ BÀN
  // ======================================================
  function defaultTables(n = 12, seats = 10) {
    const cols = [13, 31, 69, 87];
    return Array.from({ length: n }, (_, i) => ({ id: uid(), name: "Bàn " + (i + 1), seats, x: cols[i % 4], y: 32 + Math.floor(i / 4) * 22 }));
  }
  function hall() {
    const ev = state.ui.seatEvent;
    state.halls[ev] ||= { tables: defaultTables(), assign: {} };
    return state.halls[ev];
  }
  // chỉ tính khách của lễ đang xem — tránh khách đã đổi sang lễ khác vẫn chiếm ghế
  function seatedAt(h, tid) { const ev = state.ui.seatEvent; return state.guests.filter((g) => g.event === ev && h.assign[g.id] === tid); }

  function renderSeating() {
    if (!eventNames().includes(state.ui.seatEvent)) state.ui.seatEvent = eventNames()[0];
    const ev = state.ui.seatEvent, h = hall();
    const invited = state.guests.filter((g) => g.event === ev);
    const pool = invited.filter((g) => !h.tables.some((t) => t.id === h.assign[g.id]));
    const seatedPeople = guestPeople(invited) - guestPeople(pool);
    const capacity = h.tables.reduce((a, t) => a + t.seats, 0);
    const byGroup = {};
    pool.forEach((g) => (byGroup[g.group || "Khác"] ||= []).push(g));
    const sel = h.tables.find((t) => t.id === ui.selTable);

    const tablesHtml = h.tables.map((t) => {
      const seated = seatedAt(h, t.id), used = guestPeople(seated);
      const colors = [];
      seated.forEach((g) => { for (let c = 0; c < (g.count || 1); c++) colors.push(SIDE_HEX[g.side]); });
      const n = Math.max(t.seats, used);
      const dots = Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return `<span class="seat" style="left:${50 + Math.cos(a) * 44}%;top:${50 + Math.sin(a) * 44}%;${colors[i] ? `background:${colors[i]}` : ""}"></span>`;
      }).join("");
      return `<div class="tbl ${used === t.seats ? "full" : ""} ${used > t.seats ? "over" : ""} ${ui.selTable === t.id ? "sel" : ""}" data-tid="${t.id}" style="left:${t.x}%;top:${t.y}%" role="button" aria-label="${esc(t.name)}, ${used} trên ${t.seats} ghế">
        ${dots}<div class="disc"><div><b>${esc(t.name.replace(/^Bàn\s*/, ""))}</b><small>${used}/${t.seats}</small></div></div></div>`;
    }).join("");

    return `<div class="wrap" style="max-width:1400px">
      <div class="page-head" style="align-items:center">
        <div><h1>Sơ đồ bàn</h1><p>${esc(ev)} · ${seatedPeople} / ${guestPeople(invited)} khách có chỗ · ${h.tables.length} bàn · ${capacity} ghế</p></div>
        <div class="actions">
          <label class="search" style="min-width:auto"><span class="small muted">Lễ</span><select id="sev" aria-label="Chọn lễ" style="border:0;background:transparent;font-weight:600">${opts(eventNames(), ev)}</select></label>
          <div class="tabs" role="tablist" aria-label="Kiểu xem">
            <button role="tab" aria-selected="${ui.seatView !== "3d"}" class="${ui.seatView !== "3d" ? "on" : ""}" data-sv="2d">Mặt bằng 2D</button>
            <button role="tab" aria-selected="${ui.seatView === "3d"}" class="${ui.seatView === "3d" ? "on" : ""}" data-sv="3d">Phối cảnh 3D</button>
          </div>
          <button class="btn" id="autoSeat">Tự xếp theo nhóm</button>
          <button class="btn primary" id="addTbl">${icon("plus", 18)} Thêm bàn</button>
        </div>
      </div>
      <div class="seat-layout">
        <section class="card seat-side">
          ${sel ? `
            <div class="card-head"><div><b style="font-size:18px">${esc(sel.name)}</b><span class="sub">${guestPeople(seatedAt(h, sel.id))} / ${sel.seats} ghế${[...new Set(seatedAt(h, sel.id).map((g) => g.group))].slice(0, 2).map((x) => " · " + esc(x)).join("")}</span></div><button class="icon-btn" id="deselT" aria-label="Đóng">${icon("x", 18)}</button></div>
            <div class="form-grid" style="margin-bottom:10px">
              <div class="field"><label for="tName">Tên bàn</label><input class="input" id="tName" value="${esc(sel.name)}"></div>
              <div class="field"><label for="tSeats">Số ghế</label><input class="input" id="tSeats" type="number" min="2" max="20" value="${sel.seats}"></div>
            </div>
            <div class="scroll">${seatedAt(h, sel.id).map((g) => `<div class="pool-item" style="cursor:default"><i class="dot" style="background:${SIDE_HEX[g.side]}"></i><span class="n">${esc(g.name)}${g.count > 1 ? ` +${g.count - 1}` : ""}</span><button class="icon-btn" data-unseat="${g.id}" aria-label="Đưa ${esc(g.name)} về danh sách chờ">${icon("back", 16)}</button></div>`).join("") || `<div class="empty small">Kéo khách vào bàn này</div>`}</div>
            <button class="btn sm ghost danger" id="delTbl" style="margin-top:12px;align-self:flex-start">Xoá bàn</button>`
          : `
            <div class="card-head" style="margin-bottom:4px"><h3>Chưa xếp chỗ <span class="muted small">(${guestPeople(pool)})</span></h3></div>
            <p class="small muted" style="margin:0 0 8px">Kéo tên thả vào bàn, hoặc chạm tên rồi chạm bàn.</p>
            <div class="scroll">${Object.entries(byGroup).map(([gname, items]) => `
              <div class="tiny muted" style="font-weight:600;margin:10px 0 2px">${esc(gname)} · ${guestPeople(items)}</div>
              ${items.map((g) => `<div class="pool-item ${ui.selGuest === g.id ? "sel" : ""}" draggable="true" data-gid="${g.id}" tabindex="0"><i class="dot" style="background:${SIDE_HEX[g.side]}"></i><span class="n">${esc(g.name)}</span>${g.count > 1 ? pill(g.count) : ""}</div>`).join("")}`).join("")
              || `<div class="empty small">${invited.length ? "Tất cả khách đã có chỗ 🎉" : `Chưa có khách nào mời dự “${esc(ev)}”.`}</div>`}</div>`}
        </section>
        <div>
          ${ui.seatView === "3d" ? `<div class="toolbar" style="margin-bottom:10px">
              <div class="chips">
                <button class="chip" data-cam="overview">Toàn cảnh</button><button class="chip" data-cam="door">Từ cửa vào</button><button class="chip" data-cam="side">Từ bên hông</button>
                ${sel ? `<button class="chip on" data-cam="table">Nhìn từ ${esc(sel.name)}</button>` : ""}
              </div><div class="spacer"></div><button class="btn sm" id="shot3d">Tải ảnh</button></div>
            <div class="hall hall3d" id="hall3d"><div class="empty" id="load3d">Đang dựng phối cảnh 3D…</div></div>
            <div class="hall-hint">Kéo để xoay · cuộn / chụm 2 ngón để phóng to · bấm vào bàn để xem khách · thả tên khách lên bàn để xếp chỗ</div>`
          : `<div class="hall" id="hall">
              <div class="stage"><small>SÂN KHẤU</small>${esc(state.settings.bride)} &amp; ${esc(state.settings.groom)}</div>
              <div class="aisle"><span>Lối đi · Cửa chính</span></div>
              ${tablesHtml}
            </div>
            <div class="hall-hint"><span><i class="dot" style="background:${SIDE_HEX["Nhà gái"]}"></i> Nhà gái</span><span><i class="dot" style="background:${SIDE_HEX["Nhà trai"]}"></i> Nhà trai</span><span><i class="dot" style="background:#DDE3D9"></i> Ghế trống</span><span>Kéo bàn để đổi vị trí · bấm bàn để xem khách</span></div>`}
        </div>
      </div>
    </div>`;
  }
  afterRender.seating = () => {
    const h = hall(), hallEl = $("#hall");
    $("#sev").addEventListener("change", (e) => { state.ui.seatEvent = e.target.value; ui.selTable = null; ui.selGuest = null; rerender(); });
    $("#addTbl").addEventListener("click", () => {
      const n = h.tables.length;
      h.tables.push({ id: uid(), name: "Bàn " + (n + 1), seats: 10, x: [13, 31, 69, 87][n % 4], y: Math.min(92, 32 + Math.floor(n / 4) * 22) });
      rerender();
    });
    $("#autoSeat").addEventListener("click", () => autoSeat(h));
    const assign = (gid, tid) => {
      h.assign[gid] = tid; ui.selGuest = null;
      const t = h.tables.find((x) => x.id === tid);
      const used = guestPeople(seatedAt(h, tid));
      rerender();
      if (used > t.seats) toast(`${t.name} đã vượt ${used - t.seats} ghế`);
    };
    $$("[data-gid]").forEach((el) => {
      el.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", el.dataset.gid); e.dataTransfer.effectAllowed = "move"; });
      const pick = () => { ui.selGuest = ui.selGuest === el.dataset.gid ? null : el.dataset.gid; render(); };
      el.addEventListener("click", pick); el.addEventListener("keydown", (e) => { if (e.key === "Enter") pick(); });
    });
    $$("[data-sv]").forEach((b) => b.addEventListener("click", () => { ui.seatView = b.dataset.sv; render(); }));
    if (ui.seatView === "3d") mount3d(h, assign);
    if (hallEl) $$(".tbl", hallEl).forEach((el) => {
      const t = h.tables.find((x) => x.id === el.dataset.tid);
      el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("drop"); });
      el.addEventListener("dragleave", () => el.classList.remove("drop"));
      el.addEventListener("drop", (e) => { e.preventDefault(); const gid = e.dataTransfer.getData("text/plain"); if (gid) assign(gid, t.id); });
      el.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        const rect = hallEl.getBoundingClientRect();
        const sx = e.clientX, sy = e.clientY;
        let moved = false;
        el.setPointerCapture(e.pointerId);
        const move = (ev) => {
          if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
          moved = true; el.style.cursor = "grabbing";
          t.x = Math.max(6, Math.min(94, ((ev.clientX - rect.left) / rect.width) * 100));
          t.y = Math.max(16, Math.min(94, ((ev.clientY - rect.top) / rect.height) * 100));
          el.style.left = t.x + "%"; el.style.top = t.y + "%";
        };
        const up = () => {
          el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up);
          if (moved) { save(); return; }
          if (ui.selGuest) assign(ui.selGuest, t.id);
          else { ui.selTable = ui.selTable === t.id ? null : t.id; render(); }
        };
        el.addEventListener("pointermove", move); el.addEventListener("pointerup", up);
      });
    });
    const sel = h.tables.find((x) => x.id === ui.selTable);
    if (sel) {
      $("#deselT").addEventListener("click", () => { ui.selTable = null; render(); });
      $("#tName").addEventListener("change", (e) => { sel.name = e.target.value.trim() || sel.name; rerender(); });
      $("#tSeats").addEventListener("change", (e) => { sel.seats = Math.max(2, Math.min(20, +e.target.value || 10)); rerender(); });
      $$("[data-unseat]").forEach((b) => b.addEventListener("click", () => { delete h.assign[b.dataset.unseat]; rerender(); }));
      $("#delTbl").addEventListener("click", () => {
        if (!confirm(`Xoá ${sel.name}? Khách ở bàn này sẽ về danh sách chờ.`)) return;
        Object.keys(h.assign).forEach((gid) => { if (h.assign[gid] === sel.id) delete h.assign[gid]; });
        h.tables = h.tables.filter((x) => x !== sel); ui.selTable = null; rerender();
      });
    }
  };
  function mount3d(h, assign) {
    const box = $("#hall3d");
    let api = null, gone = false;
    viewCleanup = () => { gone = true; if (api) { ui.cam3d = api.camState(); api.dispose(); } };
    const tables = h.tables.map((t) => {
      const colors = [];
      seatedAt(h, t.id).forEach((g) => { for (let c = 0; c < (g.count || 1); c++) colors.push(SIDE_HEX[g.side]); });
      return { ...t, colors, used: colors.length, selected: t.id === ui.selTable };
    });
    window.Seating3D.mount(box, {
      tables, bride: state.settings.bride, groom: state.settings.groom, selId: ui.selTable, cam: ui.cam3d,
      onPick: (tid, cam) => { ui.cam3d = cam; if (tid && ui.selGuest) return assign(ui.selGuest, tid); ui.selTable = tid && tid !== ui.selTable ? tid : null; render(); },
      onDropGuest: (gid, tid, cam) => { ui.cam3d = cam; assign(gid, tid); },
    }).then((a) => {
      if (gone) return a.dispose();
      api = a;
      $$("[data-cam]").forEach((b) => b.addEventListener("click", () => api.setView(b.dataset.cam)));
      $("#shot3d").addEventListener("click", () => download(`so-do-ban-${state.ui.seatEvent}.png`, api.snapshot()));
    }).catch(() => { box.innerHTML = `<div class="empty">Không tải được thư viện 3D — cần kết nối mạng. Bạn vẫn dùng được mặt bằng 2D.</div>`; });
  }
  function autoSeat(h) {
    const ev = state.ui.seatEvent;
    const valid = new Set(h.tables.map((t) => t.id));
    const pool = state.guests.filter((g) => g.event === ev && !valid.has(h.assign[g.id])).sort((a, b) => (a.side + a.group).localeCompare(b.side + b.group, "vi"));
    if (!pool.length) return toast("Không còn khách chờ xếp");
    const free = () => h.tables.map((t) => ({ t, left: t.seats - guestPeople(seatedAt(h, t.id)) }));
    let placed = 0;
    pool.forEach((g) => {
      const need = g.count || 1;
      const cands = free().filter((f) => f.left >= need);
      if (!cands.length) return;
      // ưu tiên bàn đã có người cùng nhóm, rồi tới bàn trống, rồi bàn còn nhiều chỗ nhất
      const same = cands.find((f) => seatedAt(h, f.t.id).some((x) => x.group === g.group && x.side === g.side));
      const pick = same || cands.find((f) => f.left === f.t.seats) || cands.sort((a, b) => b.left - a.left)[0];
      h.assign[g.id] = pick.t.id; placed++;
    });
    rerender();
    toast(placed < pool.length ? `Đã xếp ${placed} khách — thiếu chỗ cho ${pool.length - placed}, hãy thêm bàn` : `Đã xếp ${placed} khách`);
  }

  // ======================================================
  // KỊCH BẢN & ĐỘI HỖ TRỢ
  // ======================================================
  function renderDayOf() {
    const evs = eventNames();
    if (!evs.includes(ui.dayEvent)) ui.dayEvent = evs[0];
    const ev = ui.dayEvent;
    const rows = state.script[ev] || [];
    const parts = [...new Set(rows.map((r) => r.part))].sort();
    const firstT = rows.find((r) => r.time), lastT = [...rows].reverse().find((r) => r.time);
    const roles = {};
    state.team.forEach((p) => { const r = (roles[p.role] ||= { n: 0, fees: new Set(), missing: 0 }); r.n++; r.fees.add(+p.fee || 0); if (!p.name) r.missing++; });
    const roleList = Object.entries(roles).sort((a, b) => b[1].n - a[1].n);
    const partName = (p) => (p === 1 ? "Phần 1 · Lễ" : p === 2 ? "Phần 2 · Tiệc & after party" : `Phần ${p}`);
    return `<div class="wrap">
      <div class="page-head">
        <div><h1>Kịch bản &amp; đội hỗ trợ</h1><p>${esc(ev)}${rows.length ? ` · ${firstT ? firstT.time : ""}${lastT && lastT !== firstT ? " – " + lastT.time : ""} · ${parts.length} phần` : " · chưa có kịch bản"}</p></div>
        <div class="actions"><button class="btn" id="printScript">${icon("print", 18)} In cho MC</button><button class="btn primary" id="addRow">${icon("plus", 18)} Thêm mục</button></div>
      </div>
      <div class="event-tabs" role="tablist" aria-label="Chọn lễ">
        ${evs.map((e) => `<button role="tab" aria-selected="${e === ev}" class="${e === ev ? "on" : ""} ${(state.script[e] || []).length ? "" : "empty"}" data-dev="${esc(e)}">${esc(e)}${(state.script[e] || []).length ? "" : ' <span>chưa có</span>'}</button>`).join("")}
      </div>
      <div class="cols">
        <section class="card span-2">
          ${rows.length ? parts.map((p) => `<div class="part-label">${partName(p)}</div>${rows.filter((r) => r.part === p).map((r) => `
            <div class="timeline-row" data-row="${r.id}" role="button" tabindex="0">
              <span class="t-time" style="${r.time ? "" : "color:var(--muted)"}">${esc(r.time)}</span>
              <span class="t-line"><i class="${r.key ? "key" : r.time ? "" : "hollow"}"></i><b></b></span>
              <span class="t-body"><span class="t-text">${esc(r.text)}</span><span class="task-meta">${r.mins ? pill(r.mins + " phút") : ""}${r.music ? pill("♪ " + r.music, "sand") : ""}${r.key ? pill("Khoảnh khắc chính", "primary") : ""}</span></span>
              <span></span>
            </div>`).join("")}`).join("")
          : `<div class="empty">Chưa có kịch bản cho ${esc(ev)}.<br><button class="btn soft" id="copyScript" style="margin-top:12px">Chép từ kịch bản Tiệc thân mật</button></div>`}
        </section>
        <div class="stack" style="gap:24px">
          <section class="card">
            <div class="card-head"><h3>Đội hỗ trợ</h3><span class="small muted">${state.team.length} người</span></div>
            <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px"><b style="font-size:30px;line-height:1">${money(teamTotal())}</b><span class="small muted">bồi dưỡng dự kiến</span></div>
            ${roleList.map(([role, r]) => `<div class="row-line">
              <span class="initial">${r.n}</span>
              <span style="flex:1;display:flex;flex-direction:column"><b class="small">${esc(role)}</b><span class="tiny muted">${[...r.fees].map((f) => money(f)).join(" / ")}${r.n > 1 ? " / người" : ""}</span></span>
              ${r.missing ? pill(r.missing === r.n ? "Chưa có tên" : `${r.missing} chưa có tên`, "sand") : pill("Đủ tên", "done")}
            </div>`).join("")}
            <button class="btn soft block" id="toggleTeam" style="margin-top:12px">${ui.showTeam ? "Ẩn bảng đội hỗ trợ" : "Mở bảng đội hỗ trợ"}</button>
          </section>
        </div>
      </div>
      ${ui.showTeam ? `<section class="card" id="teamTable">
        <div class="card-head"><div><h3>Bảng đội hỗ trợ</h3><span class="sub">Họ tên · size quần áo (may áo dài dàn tráp) · SĐT · đã xác nhận</span></div><button class="btn sm" id="addPerson">${icon("plus", 16)} Thêm người</button></div>
        <div class="table-wrap"><table class="list" style="min-width:760px">
          <thead><tr><th>Họ tên</th><th>Vai trò</th><th class="num">Bồi dưỡng</th><th>Size</th><th>SĐT</th><th>Xác nhận</th><th></th></tr></thead>
          <tbody>${state.team.map((p) => `<tr data-p="${p.id}">
            <td><input class="input" data-f="name" value="${esc(p.name)}" placeholder="Chưa có tên" aria-label="Họ tên"></td>
            <td><input class="input" data-f="role" value="${esc(p.role)}" list="roleList" aria-label="Vai trò"></td>
            <td><input class="input num" data-f="fee" value="${(+p.fee || 0).toLocaleString("vi-VN")}" inputmode="numeric" style="max-width:130px" aria-label="Bồi dưỡng"></td>
            <td><input class="input" data-f="size" value="${esc(p.size)}" style="max-width:80px" aria-label="Size"></td>
            <td><input class="input" data-f="phone" value="${esc(p.phone)}" aria-label="SĐT"></td>
            <td><label class="check-label"><input type="checkbox" data-f="ok" ${p.ok ? "checked" : ""}> Đã nhận</label></td>
            <td><button class="icon-btn" data-delp aria-label="Xoá">${icon("x", 16)}</button></td>
          </tr>`).join("")}</tbody>
        </table><datalist id="roleList">${Object.keys(roles).map((r) => `<option value="${esc(r)}">`).join("")}</datalist></div>
      </section>` : ""}
    </div>`;
  }
  afterRender.dayof = () => {
    const ev = ui.dayEvent;
    $$("[data-dev]").forEach((b) => b.addEventListener("click", () => { ui.dayEvent = b.dataset.dev; render(); }));
    $("#printScript").addEventListener("click", () => window.print());
    $("#addRow").addEventListener("click", () => scriptForm());
    $$("[data-row]").forEach((r) => { const open = () => scriptForm((state.script[ev] || []).find((x) => x.id === r.dataset.row)); r.addEventListener("click", open); r.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); }); });
    const cp = $("#copyScript"); cp && cp.addEventListener("click", () => { state.script[ev] = (state.script["Tiệc thân mật"] || []).map((r) => ({ ...r, id: uid() })); rerender(); toast("Đã chép — sửa lại cho phù hợp"); });
    $("#toggleTeam").addEventListener("click", () => { ui.showTeam = !ui.showTeam; render(); if (ui.showTeam) $("#teamTable").scrollIntoView({ behavior: "smooth" }); });
    const tt = $("#teamTable");
    if (tt) {
      tt.addEventListener("change", (e) => {
        const row = e.target.closest("[data-p]"); if (!row) return;
        const p = state.team.find((x) => x.id === row.dataset.p), f = e.target.dataset.f;
        p[f] = f === "ok" ? e.target.checked : f === "fee" ? parseMoney(e.target.value) : e.target.value.trim();
        save(); if (f === "fee" || f === "role" || f === "name") render();
      });
      $$("[data-delp]", tt).forEach((b) => b.addEventListener("click", () => { state.team = state.team.filter((x) => x.id !== b.closest("[data-p]").dataset.p); rerender(); }));
      $("#addPerson").addEventListener("click", () => { state.team.push({ id: uid(), name: "", role: "Bưng quả", fee: 200000, size: "", phone: "", ok: false }); rerender(); });
    }
  };
  function scriptForm(row) {
    const ev = ui.dayEvent, isNew = !row;
    const r = row || { part: 1, time: "", text: "", mins: 0, music: "", key: false };
    openModal(isNew ? "Thêm mục kịch bản" : "Sửa mục kịch bản", `
      <form id="sf" class="form-grid">
        <div class="field"><label>Phần</label><select class="input" name="part"><option value="1" ${r.part == 1 ? "selected" : ""}>Phần 1 · Lễ</option><option value="2" ${r.part == 2 ? "selected" : ""}>Phần 2 · Tiệc</option><option value="3" ${r.part == 3 ? "selected" : ""}>Phần 3</option></select></div>
        <div class="field"><label>Giờ bắt đầu</label><input class="input" type="time" name="time" value="${esc(r.time)}"></div>
        <div class="field full"><label for="sf-text">Hoạt động</label><textarea class="input" id="sf-text" name="text" rows="2" required>${esc(r.text)}</textarea></div>
        <div class="field"><label>Thời lượng (phút)</label><input class="input" type="number" min="0" name="mins" value="${r.mins || ""}"></div>
        <div class="field"><label>Nhạc</label><input class="input" name="music" value="${esc(r.music)}" list="songs"><datalist id="songs">${state.music.map((s) => `<option value="${esc(s.title)}">`).join("")}</datalist></div>
        <label class="check-label full"><input type="checkbox" name="key" ${r.key ? "checked" : ""}> Khoảnh khắc chính (cô dâu bước vào, trao nhẫn…)</label>
      </form>
      <div class="form-actions">${isNew ? "" : `<button class="btn ghost danger" id="delRow" style="margin-right:auto">Xoá</button>`}<button class="btn" data-close>Huỷ</button><button class="btn primary" form="sf">Lưu</button></div>`,
    (m) => {
      $("#sf", m).addEventListener("submit", (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        const data = { part: +f.part, time: f.time, text: f.text.trim(), mins: +f.mins || 0, music: f.music.trim(), key: !!f.key };
        const list = (state.script[ev] ||= []);
        if (isNew) list.push({ id: uid(), ...data }); else Object.assign(row, data);
        // sắp theo phần rồi theo giờ (mục không có giờ giữ vị trí sau mục trước nó)
        list.forEach((x, i) => (x._i = i));
        list.sort((a, b) => a.part - b.part || (a.time && b.time ? a.time.localeCompare(b.time) : a._i - b._i));
        list.forEach((x) => delete x._i);
        closeModal(); rerender();
      });
      const del = $("#delRow", m); del && del.addEventListener("click", () => { state.script[ev] = state.script[ev].filter((x) => x !== row); closeModal(); rerender(); });
    });
  }

  // ======================================================
  // NHÀ CUNG CẤP
  // ======================================================
  function renderVendors() {
    const v = state.vendors, cat = ui.vendorCat;
    const active = v.filter((x) => x.status !== "Loại");
    const list = v.filter((x) => x.cat === cat).sort((a, b) => (a.status === "Loại") - (b.status === "Loại"));
    const booked = v.filter((x) => x.status === "Đặt cọc");
    const cats = [...VENDOR_CATS, ...new Set(v.map((x) => x.cat).filter((c) => !VENDOR_CATS.includes(c)))];
    return `<div class="wrap">
      <div class="page-head">
        <div><h1>Nhà cung cấp</h1><p>${active.length} đơn vị đang tìm hiểu ở ${new Set(active.map((x) => x.cat)).size} hạng mục · ${booked.length} đã đặt cọc</p></div>
        <button class="btn primary" id="addVendor">${icon("plus", 18)} Thêm đơn vị</button>
      </div>
      <section class="cat-grid" aria-label="Hạng mục">
        ${cats.map((c) => { const l = v.filter((x) => x.cat === c), bk = l.filter((x) => x.status === "Đặt cọc").length;
          return `<button class="cat-tile ${c === cat ? "on" : ""} ${l.length ? "" : "empty"}" aria-pressed="${c === cat}" data-vc="${esc(c)}"><b>${esc(c)}</b><span>${l.length ? `${l.length} đơn vị${bk ? ` · ${bk} đặt cọc` : ""}` : "Chưa có"}</span></button>`; }).join("")}
      </section>
      <div class="cols">
        <section class="card span-2">
          <div class="card-head"><div><h3 style="font-size:18px">${esc(cat)}</h3><span class="sub">${list.length ? `${list.length} đơn vị · bấm một dòng để sửa` : "Chưa có đơn vị nào"}</span></div><button class="btn sm" id="addHere">${icon("plus", 16)} Thêm vào ${esc(cat.split(" · ")[0])}</button></div>
          ${list.length ? `<div class="table-wrap"><table class="list stack" style="min-width:600px">
            <thead><tr><th>Đơn vị</th><th>Mô tả / ưu điểm</th><th class="num">Giá dự kiến</th><th>Tình trạng</th></tr></thead>
            <tbody>${list.map((x) => `<tr class="click ${x.status === "Loại" ? "out" : ""}" data-v="${x.id}">
              <td><span style="display:flex;align-items:center;gap:10px"><span class="initial">${esc(initials(x.name))}</span><b>${esc(x.name)}</b></span></td>
              <td data-label="Ưu điểm" style="color:var(--text-2)">${esc(x.desc) || "—"}</td>
              <td data-label="Giá dự kiến" class="num" style="${x.price ? "font-weight:600" : "color:var(--muted)"}">${x.price ? money(x.price) : "Chưa báo giá"}</td>
              <td data-label="Tình trạng">${pill(x.status, VENDOR_TONE[x.status])}</td>
            </tr>`).join("")}</tbody></table></div>`
          : `<div class="empty">Thêm các đơn vị bạn đang tìm hiểu để so sánh giá và ưu nhược điểm.</div>`}
        </section>
        <section class="card">
          <div class="card-head"><h3>Đã đặt cọc</h3></div>
          ${booked.length ? booked.map((x) => { const linked = state.expenses.some((e) => e.vendorId === x.id); return `<div class="row-line">
            <span style="flex:1;display:flex;flex-direction:column;min-width:0"><b class="small">${esc(x.name)}</b><span class="tiny muted">${esc(x.cat)}${x.price ? " · " + money(x.price) : ""}</span></span>
            ${linked ? pill("Trong ngân sách", "done") : `<button class="btn sm soft" data-tobudget="${x.id}">Thêm vào ngân sách</button>`}</div>`; }).join("")
          : `<div class="empty small">Chưa đặt cọc đơn vị nào</div>`}
          <div class="note info" style="margin-top:14px">${icon("bulb", 18)}<span>Đổi tình trạng sang “Đặt cọc” khi đã chốt. Đơn vị có giá sẽ hiện ở Ngân sách để gộp vào.</span></div>
        </section>
      </div>
    </div>`;
  }
  afterRender.vendors = () => {
    $$("[data-vc]").forEach((b) => b.addEventListener("click", () => { ui.vendorCat = b.dataset.vc; render(); }));
    $("#addVendor").addEventListener("click", () => vendorForm());
    $("#addHere").addEventListener("click", () => vendorForm(null, ui.vendorCat));
    $$("[data-v]").forEach((r) => r.addEventListener("click", () => vendorForm(state.vendors.find((x) => x.id === r.dataset.v))));
    $$("[data-tobudget]").forEach((b) => b.addEventListener("click", () => { const x = state.vendors.find((v) => v.id === b.dataset.tobudget); expenseForm(null, { name: `${x.cat.split(" · ")[0]}: ${x.name}`, cost: x.price, vendorId: x.id }); }));
  };
  function vendorForm(vendor, cat) {
    const isNew = !vendor;
    const x = vendor || { cat: cat || ui.vendorCat, name: "", desc: "", price: 0, status: "Xem xét liên hệ", contact: "", note: "" };
    openModal(isNew ? "Thêm nhà cung cấp" : "Sửa nhà cung cấp", `
      <form id="vf" class="form-grid">
        <div class="field full"><label for="vf-name">Tên đơn vị</label><input class="input" id="vf-name" name="name" required value="${esc(x.name)}"></div>
        <div class="field"><label>Hạng mục</label><input class="input" name="cat" list="vcats" value="${esc(x.cat)}" required><datalist id="vcats">${VENDOR_CATS.map((c) => `<option value="${esc(c)}">`).join("")}</datalist></div>
        <div class="field"><label>Tình trạng</label><select class="input" name="status">${opts(VENDOR_STATUSES, x.status)}</select></div>
        <div class="field full"><label>Mô tả / ưu điểm</label><input class="input" name="desc" value="${esc(x.desc)}" placeholder="VD: Nước ảnh đẹp, gần nhà"></div>
        <div class="field"><label>Giá dự kiến</label>${moneyInput("price", x.price)}</div>
        <div class="field"><label>Liên hệ</label><input class="input" name="contact" value="${esc(x.contact)}" placeholder="SĐT, Facebook, Zalo"></div>
        <div class="field full"><label>Ghi chú / nhược điểm</label><input class="input" name="note" value="${esc(x.note)}"></div>
      </form>
      <div class="form-actions">${isNew ? "" : `<button class="btn ghost danger" id="delV" style="margin-right:auto">Xoá</button>`}<button class="btn" data-close>Huỷ</button><button class="btn primary" form="vf">Lưu</button></div>`,
    (m) => {
      bindMoney(m);
      $("#vf", m).addEventListener("submit", (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        const data = { ...f, name: f.name.trim(), cat: f.cat.trim(), price: parseMoney(f.price) };
        if (isNew) state.vendors.push({ id: uid(), ...data }); else Object.assign(vendor, data);
        ui.vendorCat = data.cat; closeModal(); rerender();
        if (data.status === "Đặt cọc" && data.price) toast("Đã đặt cọc — có thể gộp vào Ngân sách");
      });
      const del = $("#delV", m); del && del.addEventListener("click", () => { if (confirm(`Xoá ${vendor.name}?`)) { state.vendors = state.vendors.filter((v) => v !== vendor); state.expenses.forEach((e) => { if (e.vendorId === vendor.id) e.vendorId = ""; }); closeModal(); rerender(); } });
    });
  }

  // ======================================================
  // THỦ TỤC & SỨC KHOẺ
  // ======================================================
  function renderProcedures() {
    const p = state.procedures;
    const done = p.filter((x) => x.status === "Hoàn tất").length;
    const reg = p.find((x) => /kết hôn/i.test(x.name));
    const ph = phases();
    const regTask = state.tasks.find((t) => t.kind === "tl" && /đăng k[ií] kết hôn/i.test(t.title) && /làm/i.test(t.title)) || state.tasks.find((t) => t.kind === "tl" && /đăng k[ií] kết hôn/i.test(t.title));
    const tone = { "Hoàn tất": ["var(--done-soft)", "var(--done)"], "Đang tìm hiểu": ["var(--sand-soft)", "var(--sand-text)"], "Đã hẹn": ["var(--stone-soft)", "var(--stone-text)"], "Chưa có gì": ["var(--surface-2)", "var(--text-2)"] };
    const sorted = [...p].sort((a, b) => (a.status === "Hoàn tất") - (b.status === "Hoàn tất"));
    return `<div class="wrap">
      <div class="page-head">
        <div><h1>Thủ tục &amp; sức khỏe</h1><p>${done} / ${p.length} việc xong${reg && reg.status !== "Hoàn tất" ? ` · ${esc(reg.name.toLowerCase())} ${esc(reg.status.toLowerCase())}` : ""}</p></div>
        <button class="btn primary" id="addProc">${icon("plus", 18)} Thêm thủ tục</button>
      </div>
      <div class="cols">
        <section class="proc-grid span-2">
          ${sorted.map((x) => { const t = tone[x.status] || tone["Chưa có gì"]; return `<article class="proc ${x.status === "Hoàn tất" ? "done" : ""}" data-pr="${x.id}" role="button" tabindex="0">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
              <span style="display:flex;gap:12px;align-items:center"><span class="proc-ico" style="background:${t[0]};color:${t[1]}">${icon(PROC_KIND_ICON[x.kind] || "doc")}</span><span style="display:flex;flex-direction:column"><b>${esc(x.name)}</b><span class="tiny muted">${esc(x.kind)}</span></span></span>
              ${pill(x.status, PROC_TONE[x.status])}
            </div>
            <div class="kv">
              <span><small>Phụ trách</small>${esc(x.pic) || "—"}</span>
              <span><small>Nơi đăng ký</small>${esc(x.place) || "—"}</span>
              <span><small>Ngày hẹn</small>${x.date ? fmtDate(x.date) : "Chưa đặt"}</span>
              <span><small>Chi phí</small>${x.cost ? money(x.cost) : "—"}</span>
            </div>
            ${x.note ? `<span class="small" style="color:var(--text-2);background:var(--bg);border-radius:10px;padding:8px 10px">${esc(x.note)}</span>` : ""}
          </article>`; }).join("")}
        </section>
        <section class="card">
          <div class="card-head"><div><h3>Đăng ký kết hôn</h3><span class="sub">Giấy tờ thường cần — hỏi lại UBND phường/xã trước khi đi</span></div></div>
          ${state.regDocs.map((d) => `<label class="row-line" style="cursor:pointer;min-height:44px"><input type="checkbox" data-doc="${d.id}" ${d.done ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--primary);margin:0;flex:none"><span style="display:flex;flex-direction:column"><span class="small" style="font-weight:500">${esc(d.name)}</span><span class="tiny muted">${esc(d.note)}</span></span></label>`).join("")}
          ${regTask ? `<div class="note info" style="margin-top:12px;flex-direction:column;gap:4px"><b class="tiny">Gợi ý thời điểm</b><span class="small">Checklist đặt “${esc(regTask.title)}” ở giai đoạn ${esc(regTask.phase)}: ${esc(phaseRange(ph.indexOf(regTask.phase)))}.</span></div>` : ""}
        </section>
      </div>
    </div>`;
  }
  afterRender.procedures = () => {
    $("#addProc").addEventListener("click", () => procForm());
    $$("[data-pr]").forEach((c) => { const open = () => procForm(state.procedures.find((x) => x.id === c.dataset.pr)); c.addEventListener("click", open); c.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); }); });
    $$("[data-doc]").forEach((cb) => cb.addEventListener("change", () => { state.regDocs.find((d) => d.id === cb.dataset.doc).done = cb.checked; save(); }));
  };
  function procForm(proc) {
    const isNew = !proc;
    const x = proc || { name: "", kind: "Giấy tờ", pic: "Chúng mình", status: "Chưa có gì", place: "", date: "", cost: 0, note: "" };
    openModal(isNew ? "Thêm thủ tục" : x.name, `
      <form id="pf" class="form-grid">
        <div class="field full"><label for="pf-name">Tên</label><input class="input" id="pf-name" name="name" required value="${esc(x.name)}"></div>
        <div class="field"><label>Loại</label><select class="input" name="kind">${opts(Object.keys(PROC_KIND_ICON), x.kind)}</select></div>
        <div class="field"><label>Tình trạng</label><select class="input" name="status">${opts(PROC_STATUSES, x.status)}</select></div>
        <div class="field"><label>Phụ trách</label><select class="input" name="pic">${opts(peopleWith(x.pic), x.pic)}</select></div>
        <div class="field"><label>Nơi đăng ký</label><input class="input" name="place" value="${esc(x.place)}"></div>
        <div class="field"><label>Ngày hẹn</label><input class="input" type="date" name="date" value="${esc(x.date)}"></div>
        <div class="field"><label>Chi phí</label>${moneyInput("cost", x.cost)}</div>
        <div class="field full"><label>Ghi chú</label><input class="input" name="note" value="${esc(x.note)}"></div>
      </form>
      <div class="form-actions">${isNew ? "" : `<button class="btn ghost danger" id="delP" style="margin-right:auto">Xoá</button>`}<button class="btn" data-close>Huỷ</button><button class="btn primary" form="pf">Lưu</button></div>`,
    (m) => {
      bindMoney(m);
      $("#pf", m).addEventListener("submit", (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        const data = { ...f, cost: parseMoney(f.cost) };
        if (isNew) state.procedures.push({ id: uid(), ...data }); else Object.assign(proc, data);
        closeModal(); rerender();
      });
      const del = $("#delP", m); del && del.addEventListener("click", () => { if (confirm("Xoá thủ tục này?")) { state.procedures = state.procedures.filter((p) => p !== proc); closeModal(); rerender(); } });
    });
  }

  // ======================================================
  // NHẠC & SAU CƯỚI
  // ======================================================
  function renderExtras() {
    const moments = [...new Set(["Đón khách", "Nghi lễ", "Tiệc", ...state.music.map((s) => s.moment)])];
    const tones = [["var(--primary-soft)", "var(--primary-text)"], ["var(--sand-soft)", "var(--sand-text)"], ["var(--stone-soft)", "var(--stone-text)"], ["var(--clay-soft)", "var(--clay-text)"]];
    const when = { "Đón khách": "Trước khi lễ bắt đầu", "Nghi lễ": "Cô dâu bước vào · trao nhẫn", "Tiệc": "Khi khách dùng tiệc" };
    const a = state.after, ad = a.filter((x) => x.done).length;
    return `<div class="wrap">
      <div class="page-head"><div><h1>Nhạc cưới &amp; việc sau cưới</h1><p>${state.music.length} bài chia theo ${moments.length} khoảnh khắc · ${a.length} việc sau cưới</p></div></div>
      <div class="cols">
        <section class="card span-2">
          <div class="card-head"><h3 style="font-size:18px">Danh sách nhạc</h3><div class="actions"><button class="btn sm soft" id="exportMusic">Xuất cho ban nhạc / MC</button><button class="btn sm" id="addSong">${icon("plus", 16)} Thêm bài</button></div></div>
          <div class="moments">${moments.map((mo, i) => { const songs = state.music.filter((s) => s.moment === mo); return `<div class="moment">
            <span style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span class="mini-badge" style="background:${tones[i % 4][0]};color:${tones[i % 4][1]}">${i + 1}</span><span style="display:flex;flex-direction:column"><b>${esc(mo)}</b><span class="tiny muted">${esc(when[mo] || "")} · ${songs.length} bài</span></span></span>
            ${songs.map((s) => `<div class="song" data-song="${s.id}" role="button" tabindex="0" style="cursor:pointer">${icon("extras", 16, 'style="color:var(--sage-mid)"')}<span><b>${esc(s.title)}</b><small>${esc(s.artist)}</small></span></div>`).join("") || `<div class="empty small">Chưa có bài</div>`}
          </div>`; }).join("")}</div>
        </section>
        <section class="card">
          <div class="card-head"><div><h3 style="font-size:18px">Việc sau cưới</h3><span class="sub">${ad} / ${a.length} xong</span></div></div>
          ${a.map((x) => `<div class="row-line" data-af="${x.id}" style="min-height:48px">
            <input type="checkbox" data-afdone ${x.done ? "checked" : ""} aria-label="Xong: ${esc(x.name)}" style="width:20px;height:20px;accent-color:var(--primary);margin:0;flex:none">
            <span class="small" style="flex:1;font-weight:500;${x.done ? "text-decoration:line-through;color:var(--muted)" : ""}">${esc(x.name)}</span>
            <select data-afpic aria-label="Ai làm" style="border:0;background:transparent;font-size:12px;color:var(--text-2);max-width:100px"><option value="">Ai làm?</option>${opts(peopleWith(x.pic), x.pic)}</select>
            <button class="icon-btn" data-afdel aria-label="Xoá">${icon("x", 14)}</button>
          </div>`).join("")}
          <form id="afAdd" style="display:flex;gap:8px;margin-top:10px"><input class="input" name="name" placeholder="Thêm việc sau cưới…" aria-label="Thêm việc sau cưới" required><button class="btn primary" aria-label="Thêm">${icon("plus", 18)}</button></form>
        </section>
      </div>
    </div>`;
  }
  afterRender.extras = () => {
    $("#addSong").addEventListener("click", () => songForm());
    $$("[data-song]").forEach((r) => { const open = () => songForm(state.music.find((s) => s.id === r.dataset.song)); r.addEventListener("click", open); r.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); }); });
    $("#exportMusic").addEventListener("click", () => {
      const moments = [...new Set(state.music.map((s) => s.moment))];
      download("nhac-cuoi.txt", moments.map((mo) => `${mo.toUpperCase()}\n` + state.music.filter((s) => s.moment === mo).map((s, i) => `${i + 1}. ${s.title}${s.artist ? " – " + s.artist : ""}`).join("\n")).join("\n\n"), "text/plain");
    });
    $$("[data-af]").forEach((row) => {
      const x = state.after.find((a) => a.id === row.dataset.af);
      $("[data-afdone]", row).addEventListener("change", (e) => { x.done = e.target.checked; rerender(); });
      $("[data-afpic]", row).addEventListener("change", (e) => { x.pic = e.target.value; save(); });
      $("[data-afdel]", row).addEventListener("click", () => { state.after = state.after.filter((a) => a !== x); rerender(); });
    });
    $("#afAdd").addEventListener("submit", (e) => { e.preventDefault(); const n = e.target.name.value.trim(); if (n) { state.after.push({ id: uid(), name: n, pic: "", done: false }); rerender(); } });
  };
  function songForm(song) {
    const isNew = !song;
    const x = song || { title: "", artist: "", moment: "Đón khách" };
    const moments = [...new Set(["Đón khách", "Nghi lễ", "Tiệc", ...state.music.map((s) => s.moment)])];
    openModal(isNew ? "Thêm bài hát" : "Sửa bài hát", `
      <form id="mf" class="form-grid">
        <div class="field full"><label for="mf-t">Tên bài</label><input class="input" id="mf-t" name="title" required value="${esc(x.title)}"></div>
        <div class="field"><label>Ca sĩ</label><input class="input" name="artist" value="${esc(x.artist)}"></div>
        <div class="field"><label>Khoảnh khắc</label><input class="input" name="moment" list="moms" value="${esc(x.moment)}" required><datalist id="moms">${moments.map((mo) => `<option value="${esc(mo)}">`).join("")}</datalist></div>
      </form>
      <div class="form-actions">${isNew ? "" : `<button class="btn ghost danger" id="delS" style="margin-right:auto">Xoá</button>`}<button class="btn" data-close>Huỷ</button><button class="btn primary" form="mf">Lưu</button></div>`,
    (m) => {
      $("#mf", m).addEventListener("submit", (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        const data = { title: f.title.trim(), artist: f.artist.trim(), moment: f.moment.trim() };
        if (isNew) state.music.push({ id: uid(), ...data }); else Object.assign(song, data);
        closeModal(); rerender();
      });
      const del = $("#delS", m); del && del.addEventListener("click", () => { state.music = state.music.filter((s) => s !== song); closeModal(); rerender(); });
    });
  }

  // ======================================================
  // CÀI ĐẶT
  // ======================================================
  function renderSettings() {
    const s = state.settings;
    return `<div class="wrap" style="max-width:1000px">
      <div class="page-head"><div><h1>Cài đặt</h1><p>Thông tin cưới, ngày các lễ và dữ liệu</p></div><button class="btn primary" form="setForm">Lưu thay đổi</button></div>
      <form id="setForm" class="stack" style="gap:24px">
        <section class="card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px">
          <div class="stack">
            <h3 style="font-size:17px">Hai bạn</h3>
            <div class="form-grid">
              <div class="field"><label for="s-b">Cô dâu</label><input class="input" id="s-b" name="bride" value="${esc(s.bride)}"></div>
              <div class="field"><label for="s-g">Chú rể</label><input class="input" id="s-g" name="groom" value="${esc(s.groom)}"></div>
              <div class="field"><label>Tổng ngân sách</label>${moneyInput("budget", s.budget)}</div>
              <div class="field"><label>Số khách dự kiến</label><input class="input" name="guestTarget" inputmode="numeric" value="${s.guestTarget || ""}" placeholder="VD: 300"></div>
            </div>
            <div class="field"><label>Địa điểm lễ chính</label><input class="input" name="venue" value="${esc(s.venue)}" placeholder="Tên nhà hàng, địa chỉ"></div>
          </div>
          <div class="stack" style="gap:10px">
            <h3 style="font-size:17px">Ảnh bìa</h3>
            <label class="uploader" id="coverBox">
              ${s.cover ? `<img src="${esc(s.cover)}" alt="Ảnh bìa hiện tại">` : ""}
              <span class="${s.cover ? "over" : ""}" style="display:flex;flex-direction:column;align-items:center;gap:6px">${icon("upload", 30)}<b>${s.cover ? "Đổi ảnh cưới" : "Chọn ảnh cưới"}</b><span class="small" style="color:var(--text-2)">Hiện ở đầu Trang chủ</span></span>
              <input type="file" id="coverFile" accept="image/*" style="position:absolute;width:1px;height:1px;opacity:0">
            </label>
            ${s.cover ? `<button type="button" class="btn sm ghost danger" id="rmCover" style="align-self:flex-start">Bỏ ảnh</button>` : ""}
          </div>
        </section>
        <section class="card">
          <div class="card-head"><div><h3>Ngày các lễ</h3><span class="sub">Checklist và đếm ngược tính theo lễ đánh dấu “Lễ chính”</span></div></div>
          ${state.events.map((e, i) => `<div class="event-line">
            <b>${esc(e.name)}</b>
            <input class="input" type="date" name="ev-date-${i}" value="${esc(e.date)}" aria-label="Ngày ${esc(e.name)}">
            <input class="input" name="ev-place-${i}" value="${esc(e.place)}" placeholder="Địa điểm" aria-label="Địa điểm ${esc(e.name)}">
            <label class="check-label" style="min-height:44px"><input type="radio" name="main" value="${i}" ${e.main ? "checked" : ""}> Lễ chính</label>
          </div>`).join("")}
        </section>
      </form>
      <div class="cols" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
        <section class="card">
          <div class="card-head"><div><h3>Người phụ trách</h3><span class="sub">Dùng để giao việc trong checklist và thủ tục</span></div></div>
          <div class="chips">${state.people.map((p) => `<span class="pill primary" style="min-height:36px;padding:0 6px 0 12px;font-size:14px">${esc(p)}<button class="icon-btn" data-rmp="${esc(p)}" aria-label="Bỏ ${esc(p)}" style="width:28px;height:28px">${icon("x", 12)}</button></span>`).join("")}
            <button class="chip" id="addPeople" style="border-style:dashed">+ Thêm người</button></div>
        </section>
        <section class="card">
          <div class="card-head"><div><h3>Dữ liệu</h3><span class="sub">Đang lưu trên trình duyệt của máy này. Xuất file để chuyển sang máy khác hoặc gửi cho người ấy.</span></div></div>
          <div class="actions"><button class="btn" id="exp">Xuất file sao lưu</button><label class="btn">Nhập file<input type="file" id="imp" accept="application/json,.json" hidden></label><button class="btn" id="csv">Khách mời (CSV)</button></div>
          <button class="btn ghost danger" id="reset" style="margin-top:12px;padding-left:0">Đặt lại dữ liệu mẫu từ Google Sheet</button>
        </section>
      </div>
    </div>`;
  }
  function resizeImage(file, max = 1600) {
    return new Promise((ok, fail) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); ok(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(url); fail(); };
      img.src = url;
    });
  }
  afterRender.settings = () => {
    const m = $("#view");
    bindMoney(m);
    $("#setForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      Object.assign(state.settings, { bride: f.bride.trim(), groom: f.groom.trim(), venue: f.venue.trim(), budget: parseMoney(f.budget), guestTarget: parseMoney(f.guestTarget) });
      const mainIdx = +f.main;
      // kiểm tra trước khi ghi — tránh lưu dở dang khi lễ chính chưa có ngày
      if (!f["ev-date-" + mainIdx]) { toast("Lễ chính cần có ngày"); return; }
      state.events.forEach((ev, i) => { ev.date = f["ev-date-" + i] || ""; ev.place = (f["ev-place-" + i] || "").trim(); ev.main = i === mainIdx; });
      state.settings.date = mainEvent().date;
      rerender(); toast("Đã lưu thông tin");
    });
    $("#coverFile").addEventListener("change", async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try { state.settings.cover = await resizeImage(file); rerender(); toast("Đã đổi ảnh bìa"); }
      catch (err) { toast("Không đọc được ảnh này"); }
    });
    const rm = $("#rmCover"); rm && rm.addEventListener("click", () => { state.settings.cover = ""; rerender(); });
    $$("[data-rmp]").forEach((b) => b.addEventListener("click", () => {
      const p = b.dataset.rmp;
      const used = state.tasks.filter((t) => t.pic === p).length + state.procedures.filter((x) => x.pic === p).length + state.after.filter((x) => x.pic === p).length;
      if (used) { toast(`Còn ${used} việc của ${p} — đổi người phụ trách các việc đó trước`); return; }
      state.people = state.people.filter((x) => x !== p); rerender();
    }));
    $("#addPeople").addEventListener("click", () => { const n = (prompt("Tên người phụ trách (VD: Cô Út)") || "").trim(); if (n && !state.people.includes(n)) { state.people.push(n); rerender(); } });
    $("#exp").addEventListener("click", () => download(`hen-uoc-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state), "application/json"));
    $("#csv").addEventListener("click", () => {
      const head = ["Họ tên", "Khách của", "Mời dự", "Nhóm", "Số người", "SĐT", "Gửi qua", "Ghi chú", "Đã gửi thiệp", "Bàn"];
      const rows = state.guests.map((g) => [g.name, g.side, g.event, g.group, g.count, g.phone, g.sendVia, g.note, g.sent ? "Có" : "Chưa", tableNameOf(g)].map(csvCell).join(","));
      download("khach-moi.csv", "﻿" + [head.map(csvCell).join(","), ...rows].join("\n"), "text/csv");
    });
    $("#imp").addEventListener("change", async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!data.settings || !Array.isArray(data.tasks)) throw new Error();
        if (!confirm(`Thay toàn bộ dữ liệu hiện tại bằng file "${file.name}"? Không hoàn tác được — nên xuất file sao lưu trước.`)) { e.target.value = ""; return; }
        state = normalize(data); rerender(); toast("Đã nhập dữ liệu");
      } catch (err) { toast("File không hợp lệ"); }
    });
    $("#reset").addEventListener("click", () => {
      if (confirm("Đặt lại toàn bộ về dữ liệu mẫu? Mọi thay đổi sẽ mất và không hoàn tác được.")) { state = seed(); normalize(state); rerender(); toast("Đã đặt lại"); }
    });
  };

  render();
})();
