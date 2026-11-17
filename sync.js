// Đăng nhập Google + đồng bộ dữ liệu lên Firebase Firestore.
// Không có cấu hình (firebase-config.js để null) → web vẫn chạy, dữ liệu chỉ nằm trên máy.
//
// Firestore:
//   users/{uid}               { planId, name, email }
//   plans/{planId}            { owner, members[], memberNames{uid: tên}, parts{khoá: JSON}, updatedAt, updatedBy }
//   plans/{planId}/files/cover { data }   ← ảnh bìa để riêng, tránh giới hạn 1MB của một document
// Mỗi phần dữ liệu (checklist, khách, ngân sách…) là một trường riêng, nên hai người sửa hai phần
// khác nhau cùng lúc không đè nhau; sửa cùng một phần thì lần lưu sau cùng thắng.

const V = "10.12.2";
const cfg = window.FIREBASE_CONFIG;
const PARTS = ["settings", "tasks", "guests", "expenses", "budgetCats", "events", "people", "procedures", "regDocs", "vendors", "script", "team", "music", "after", "halls"];
const LINK_KEY = "henuoc-plan"; // kế hoạch trên mạng mà dữ liệu trên máy này đang gắn với

const S = { enabled: !!cfg, user: null, planId: null, members: {}, owner: null, status: cfg ? "loading" : "off" };
window.HenUocSync = S;
const app = () => window.HenUoc;
const set = (patch) => { Object.assign(S, patch); app() && app().refreshAccount(); };

if (cfg) init().catch((e) => { console.error(e); set({ status: "error" }); });

async function init() {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
  ]);
  const fb = initializeApp(cfg);
  const auth = A.getAuth(fb);
  auth.languageCode = "vi";
  // bộ nhớ đệm trên máy: mất mạng vẫn sửa được, có mạng lại sẽ tự gửi lên
  const db = F.initializeFirestore(fb, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) });

  let unsub = [], last = {}, lastCover = null, timer = null, overwrite = false;
  const ser = (st, k) => JSON.stringify(k === "settings" ? { ...st.settings, cover: "" } : (st[k] ?? null));
  const planRef = (id) => F.doc(db, "plans", id);
  const coverRef = (id) => F.doc(db, "plans", id, "files", "cover");
  const myName = (u) => u.displayName || u.email || "Bạn";

  S.signIn = async () => {
    const p = new A.GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    try { await A.signInWithPopup(auth, p); }
    catch (e) {
      if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment"].includes(e.code)) await A.signInWithRedirect(auth, p);
      else if (!["auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(e.code)) app().toast("Chưa đăng nhập được (" + e.code + ")");
    }
  };
  S.signOut = async () => {
    if (!confirm("Đăng xuất? Dữ liệu vẫn an toàn trên tài khoản Google; máy này sẽ trở về dữ liệu mẫu.")) return;
    await flush();
    stop(); localStorage.removeItem(LINK_KEY);
    await A.signOut(auth);
    app().resetLocal();
  };
  S.inviteLink = () => `${location.origin}${location.pathname}?join=${S.planId}`;
  S.invite = async () => {
    try { await navigator.clipboard.writeText(S.inviteLink()); app().toast("Đã chép link mời — gửi cho người ấy qua Zalo/Messenger"); }
    catch (e) { prompt("Gửi link này cho người ấy:", S.inviteLink()); }
  };
  S.push = () => {
    if (!S.planId) return;
    clearTimeout(timer); set({ status: "saving" });
    timer = setTimeout(flush, 800); // gom nhiều thay đổi liên tiếp thành một lần ghi
  };

  async function flush() {
    clearTimeout(timer);
    if (!S.planId || !S.user) return;
    const st = app().state, upd = {}, next = {};
    PARTS.forEach((k) => { const v = ser(st, k); if (v !== last[k]) { upd["parts." + k] = v; next[k] = v; } });
    const cover = st.settings.cover || "";
    try {
      if (Object.keys(upd).length) {
        const w = F.updateDoc(planRef(S.planId), { ...upd, updatedAt: F.serverTimestamp(), updatedBy: S.user.uid });
        Object.assign(last, next); // ghi nhận ngay, kể cả khi đang mất mạng (Firestore tự gửi lại)
        await w;
      }
      if (cover !== lastCover) { lastCover = cover; await F.setDoc(coverRef(S.planId), { data: cover }); }
      set({ status: navigator.onLine ? "synced" : "offline" });
    } catch (e) {
      console.error(e);
      Object.keys(next).forEach((k) => delete last[k]); // lần sau thử ghi lại
      set({ status: "error" });
      if (String(e.code).includes("resource-exhausted") || String(e.message).includes("exceeds the maximum")) app().toast("Dữ liệu quá lớn để lưu lên mạng");
    }
  }
  window.addEventListener("online", () => S.planId && flush());
  window.addEventListener("offline", () => S.planId && set({ status: "offline" }));
  window.addEventListener("pagehide", () => { if (timer) flush(); });

  function stop() { unsub.forEach((u) => u()); unsub = []; last = {}; lastCover = null; set({ planId: null, members: {}, owner: null }); }

  function open(planId) {
    stop();
    S.planId = planId; localStorage.setItem(LINK_KEY, planId);
    let first = true;
    unsub.push(F.onSnapshot(planRef(planId), { includeMetadataChanges: false }, (snap) => {
      if (!snap.exists()) { set({ status: "error" }); app().toast("Không tìm thấy kế hoạch trên mạng"); return; }
      const d = snap.data();
      set({ members: d.memberNames || {}, owner: d.owner });
      if (snap.metadata.hasPendingWrites) return; // thay đổi của chính mình, đã có trên máy
      if (first && overwrite) { overwrite = false; first = false; PARTS.forEach((k) => (last[k] = undefined)); lastCover = null; flush(); return; }
      const parts = d.parts || {}, incoming = {};
      PARTS.forEach((k) => { if (parts[k] != null && parts[k] !== last[k]) { incoming[k] = JSON.parse(parts[k]); last[k] = parts[k]; } });
      const who = !first && d.updatedBy && d.updatedBy !== S.user.uid ? (d.memberNames || {})[d.updatedBy] : null;
      if (Object.keys(incoming).length) app().applyRemote(incoming, who);
      first = false;
      set({ status: navigator.onLine ? "synced" : "offline" });
    }, (e) => { console.error(e); set({ status: "error" }); }));
    unsub.push(F.onSnapshot(coverRef(planId), (snap) => {
      if (snap.metadata.hasPendingWrites || overwrite) return;
      const c = snap.exists() ? snap.data().data || "" : "";
      if (c !== lastCover) { lastCover = c; app().applyCover(c); }
    }, (e) => console.error(e)));
  }

  A.getRedirectResult(auth).catch((e) => app().toast("Chưa đăng nhập được (" + e.code + ")"));

  A.onAuthStateChanged(auth, async (user) => {
    if (!user) { stop(); set({ user: null, status: "signedout" }); return; }
    set({ user, status: "loading" });
    try {
      const uref = F.doc(db, "users", user.uid);
      const us = await F.getDoc(uref);
      let planId = us.exists() ? us.data().planId : null;

      // vào bằng link mời ?join=…
      const join = new URLSearchParams(location.search).get("join");
      if (join) {
        history.replaceState(null, "", location.pathname + location.hash);
        if (join !== planId && confirm("Tham gia kế hoạch cưới chung qua link mời?\nTừ giờ tài khoản này sẽ mở kế hoạch chung.")) {
          try {
            await F.updateDoc(planRef(join), { members: F.arrayUnion(user.uid), ["memberNames." + user.uid]: myName(user) });
            await F.setDoc(uref, { planId: join, name: myName(user), email: user.email }, { merge: true });
            planId = join;
            localStorage.setItem(LINK_KEY, join); // dùng dữ liệu chung, không hỏi ghi đè
            app().toast("Đã tham gia kế hoạch chung");
          } catch (e) { console.error(e); app().toast("Link mời không đúng"); }
        }
      }

      if (!planId) {
        // lần đầu đăng nhập: đưa dữ liệu đang có trên máy lên tài khoản
        const ref = F.doc(F.collection(db, "plans"));
        const st = app().state, parts = {};
        PARTS.forEach((k) => (parts[k] = ser(st, k)));
        await F.setDoc(ref, { owner: user.uid, members: [user.uid], memberNames: { [user.uid]: myName(user) }, parts, updatedAt: F.serverTimestamp(), updatedBy: user.uid });
        if (st.settings.cover) await F.setDoc(F.doc(db, "plans", ref.id, "files", "cover"), { data: st.settings.cover });
        await F.setDoc(uref, { planId: ref.id, name: myName(user), email: user.email }, { merge: true });
        open(ref.id);
        app().toast("Đã lưu kế hoạch lên tài khoản Google của bạn");
        return;
      }

      if (localStorage.getItem(LINK_KEY) !== planId && app().hasLocalWork()) {
        overwrite = !confirm("Tài khoản này đã có kế hoạch trên mạng.\n\nOK: mở kế hoạch trên mạng (dữ liệu đang có trên máy này sẽ bị thay).\nHuỷ: giữ dữ liệu trên máy này và ghi đè lên mạng.");
      }
      open(planId);
    } catch (e) {
      console.error(e);
      set({ status: "error" });
      app().toast("Không kết nối được tới máy chủ dữ liệu");
    }
  });
}
