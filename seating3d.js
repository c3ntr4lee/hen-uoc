/* Phối cảnh 3D sơ đồ bàn tiệc — dùng three.js (nạp khi cần). */
(() => {
  "use strict";
  const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  const ORBIT_URL = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";
  const W = 40; let D = 30; // kích thước sảnh (đơn vị 3D) tương ứng 100% × 100% mặt bằng 2D; D dài ra theo số hàng bàn

  let loading;
  const loadScript = (src) => new Promise((ok, fail) => {
    const s = document.createElement("script");
    s.src = src; s.onload = ok; s.onerror = () => fail(new Error("Không tải được " + src));
    document.head.appendChild(s);
  });
  function load() {
    if (window.THREE && THREE.OrbitControls) return Promise.resolve();
    loading ||= loadScript(THREE_URL).then(() => loadScript(ORBIT_URL));
    return loading;
  }

  const toXZ = (t) => [(t.x / 100 - 0.5) * W, (t.y / 100 - 0.5) * D];

  function textTexture(lines, { w = 512, h = 128, bg = null, color = "#1F2A22", font = "600 56px 'Be Vietnam Pro', sans-serif", sub = "500 30px 'Be Vietnam Pro', sans-serif" } = {}) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d");
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = color;
    if (lines.length === 1) { g.font = font; g.fillText(lines[0], w / 2, h / 2); }
    else { g.font = sub; g.fillText(lines[0], w / 2, h * 0.3); g.font = font; g.fillText(lines[1], w / 2, h * 0.66); }
    const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
    return tex;
  }
  function badge(text, sub, color) {
    const c = document.createElement("canvas"); c.width = 256; c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = "rgba(255,255,255,.94)";
    g.beginPath(); g.roundRect ? g.roundRect(8, 8, 240, 112, 40) : g.rect(8, 8, 240, 112); g.fill();
    g.lineWidth = 6; g.strokeStyle = color; g.stroke();
    g.textAlign = "center"; g.fillStyle = "#1F2A22";
    g.font = "700 50px 'Be Vietnam Pro', sans-serif"; g.fillText(text, 128, 62);
    g.font = "500 26px 'Be Vietnam Pro', sans-serif"; g.fillStyle = "#5E6B60"; g.fillText(sub, 128, 100);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true }));
    sp.scale.set(2.8, 1.4, 1); sp.renderOrder = 10;
    return sp;
  }

  async function mount(el, opts) {
    D = 30 * Math.max(1, (opts.rows || 3) / 3);
    await load();
    const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra });

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    el.innerHTML = ""; el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F4F6F1");
    scene.fog = new THREE.Fog("#F4F6F1", 60, 110);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.48; controls.minDistance = 4; controls.maxDistance = 70;

    // ánh sáng
    scene.add(new THREE.HemisphereLight("#FBFDF8", "#C8D2C3", 0.55));
    const sun = new THREE.DirectionalLight("#FFFFFF", 0.6);
    sun.position.set(-14, 30, 18); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 22, bottom: -22, near: 1, far: 80 });
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    // sàn & tường
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W + 2, D + 2), mat("#E9EEE4"));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W + 2, 0.02, D + 2)), new THREE.LineBasicMaterial({ color: "#D6DED2" }));
    scene.add(edge);
    const wallMat = mat("#EEF2EB");
    const back = new THREE.Mesh(new THREE.BoxGeometry(W + 2, 5, 0.3), wallMat);
    back.position.set(0, 2.5, -D / 2 - 1.15); back.receiveShadow = true; scene.add(back);

    // sân khấu + backdrop tên cô dâu chú rể
    const stage = new THREE.Mesh(new THREE.BoxGeometry(W * 0.4, 0.6, 4), mat("#C9D8C3"));
    stage.position.set(0, 0.3, -D / 2 + 1.2); stage.castShadow = stage.receiveShadow = true; scene.add(stage);
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.36, 3.6),
      new THREE.MeshBasicMaterial({ map: textTexture(["SÂN KHẤU", `${opts.bride} & ${opts.groom}`], { w: 1024, h: 256, bg: "#E4ECE1", color: "#3F5B45", font: "italic 600 92px 'Cormorant Garamond', serif", sub: "600 40px 'Be Vietnam Pro', sans-serif" }) }));
    backdrop.position.set(0, 2.6, -D / 2 - 0.95); scene.add(backdrop);
    // cổng hoa hai bên sân khấu
    [-1, 1].forEach((s) => {
      for (let i = 0; i < 9; i++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.32 + (i % 3) * 0.06, 16, 12), mat(i % 2 ? "#DCE8D8" : "#FFFFFF"));
        b.position.set(s * (W * 0.2 + 0.5), 0.35 + i * 0.5, -D / 2 + 0.4 + (i % 2) * 0.3);
        b.castShadow = true; scene.add(b);
      }
    });

    // lối đi + cổng vào
    const aisle = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.09, D * 0.85), mat("#D6E2D1"));
    aisle.rotation.x = -Math.PI / 2; aisle.position.set(0, 0.012, D * 0.075); aisle.receiveShadow = true; scene.add(aisle);
    const petals = new THREE.InstancedMesh(new THREE.CircleGeometry(0.09, 6), mat("#E9D7B5", { side: THREE.DoubleSide }), 140);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < 140; i++) {
      e.set(-Math.PI / 2, 0, Math.random() * 6);
      q.setFromEuler(e);
      m4.compose(new THREE.Vector3((Math.random() - 0.5) * W * 0.085, 0.02, D * 0.075 + (Math.random() - 0.5) * D * 0.84), q, new THREE.Vector3(1, 1, 1));
      petals.setMatrixAt(i, m4);
    }
    scene.add(petals);
    const archMat = mat("#FFFFFF");
    const arch = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.12, 12, 40, Math.PI), archMat);
    arch.position.set(0, 0, D / 2 - 0.3); arch.castShadow = true; scene.add(arch);
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * Math.PI;
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), mat(i % 3 ? "#DCE8D8" : "#C9D8C3"));
      f.position.set(Math.cos(a) * 2.1, Math.sin(a) * 2.1, D / 2 - 0.3); scene.add(f);
    }
    const doorLbl = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTexture(["Cửa chính"], { w: 256, h: 64, font: "600 34px 'Be Vietnam Pro', sans-serif", color: "#3F5B45" }), transparent: true }));
    doorLbl.scale.set(2.6, 0.65, 1); doorLbl.position.set(0, 2.9, D / 2 - 0.3); scene.add(doorLbl);

    // bàn tiệc
    const tableMat = mat("#FFFFFF", { roughness: 0.6 });
    const clothMat = mat("#F7F8F4");
    const emptyChair = mat("#DDE3D9");
    const pickables = [];
    const tableGroups = {};
    const sideMats = {};
    const matFor = (hex) => (sideMats[hex] ||= mat(hex));
    const skin = mat("#F1D2BC");

    opts.tables.forEach((t) => {
      const [x, z] = toXZ(t);
      const g = new THREE.Group(); g.position.set(x, 0, z);
      const top = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.08, 40), tableMat);
      top.position.y = 0.78; top.castShadow = top.receiveShadow = true;
      const cloth = new THREE.Mesh(new THREE.CylinderGeometry(1.17, 1.3, 0.74, 40, 1, true), clothMat);
      cloth.position.y = 0.4; cloth.castShadow = true;
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), matFor(t.selected ? "#3F5B45" : "#E9D7B5"));
      flower.position.y = 0.98;
      g.add(top, cloth, flower);
      if (t.selected || t.drop) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(2.05, 2.25, 48), new THREE.MeshBasicMaterial({ color: "#6E8B70", transparent: true, opacity: 0.8 }));
        ring.rotation.x = -Math.PI / 2; ring.position.y = 0.02; g.add(ring);
      }
      const n = Math.max(t.seats, t.colors.length);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const cx = Math.cos(a) * 1.6, cz = Math.sin(a) * 1.6;
        const chair = new THREE.Group(); chair.position.set(cx, 0, cz); chair.rotation.y = -a + Math.PI / 2;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.42), t.colors[i] ? matFor(t.colors[i]) : emptyChair);
        seat.position.y = 0.45;
        const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.06), t.colors[i] ? matFor(t.colors[i]) : emptyChair);
        backrest.position.set(0, 0.72, 0.2);
        seat.castShadow = backrest.castShadow = true;
        chair.add(seat, backrest);
        if (t.colors[i]) { // khách ngồi
          const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.55, 14), matFor(t.colors[i]));
          body.position.set(0, 0.76, 0.02);
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), skin);
          head.position.set(0, 1.18, 0.02);
          body.castShadow = head.castShadow = true;
          chair.add(body, head);
        }
        g.add(chair);
      }
      const lbl = badge(t.name.replace(/^Bàn\s*/, ""), `${t.used}/${t.seats}`, t.used > t.seats ? "#B97862" : t.selected ? "#3F5B45" : "#D6DED2");
      lbl.position.y = 2.4; lbl.userData.tid = t.id; g.add(lbl); pickables.push(lbl);
      g.userData.label = lbl;
      // vùng bấm vô hình
      const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 1.6, 16), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.y = 0.8; hit.userData.tid = t.id; g.add(hit);
      pickables.push(hit); tableGroups[t.id] = g;
      scene.add(g);
    });

    // camera
    const views = {
      overview: { pos: [0, 27 * D / 30, 25 * D / 30], target: [0, 0, 1.5] },
      door: { pos: [0, 3.4, D / 2 - 3], target: [0, 1.2, -8] },
      side: { pos: [W / 2 + 4, 8, 6], target: [-2, 0.5, 0] },
    };
    function setView(name, animate = true) {
      let v = views[name];
      Object.values(tableGroups).forEach((g) => (g.userData.label.visible = true));
      if (name === "table" && tableGroups[opts.selId]) tableGroups[opts.selId].userData.label.visible = false;
      if (name === "table" && opts.selId && tableGroups[opts.selId]) {
        const p = tableGroups[opts.selId].position;
        const toStage = new THREE.Vector3(0, 0, -D / 2).sub(p).normalize();
        v = { pos: [p.x - toStage.x * 2.2, 1.35, p.z - toStage.z * 2.2], target: [p.x + toStage.x * 10, 1.4, p.z + toStage.z * 10] };
      }
      if (!v) return;
      if (!animate) { camera.position.set(...v.pos); controls.target.set(...v.target); controls.update(); return; }
      const fromP = camera.position.clone(), fromT = controls.target.clone();
      const toP = new THREE.Vector3(...v.pos), toT = new THREE.Vector3(...v.target);
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 700), ease = 1 - Math.pow(1 - k, 3);
        camera.position.lerpVectors(fromP, toP, ease); controls.target.lerpVectors(fromT, toT, ease);
        if (k < 1 && !disposed) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    if (opts.cam) { camera.position.fromArray(opts.cam.pos); controls.target.fromArray(opts.cam.target); controls.update(); }
    else setView("overview", false);

    // kích thước
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();

    // chọn bàn
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    const pick = (clientX, clientY) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(pickables)[0];
      return hit ? hit.object.userData.tid : null;
    };
    const camState = () => ({ pos: camera.position.toArray(), target: controls.target.toArray() });
    let down = null;
    const cv = renderer.domElement;
    cv.addEventListener("pointerdown", (e) => { down = [e.clientX, e.clientY]; });
    cv.addEventListener("pointerup", (e) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
      opts.onPick(pick(e.clientX, e.clientY), camState());
    });
    cv.addEventListener("pointermove", (e) => { if (!e.buttons) cv.style.cursor = pick(e.clientX, e.clientY) ? "pointer" : "grab"; });
    cv.addEventListener("dragover", (e) => e.preventDefault());
    cv.addEventListener("drop", (e) => {
      e.preventDefault();
      const gid = e.dataTransfer.getData("text/plain"), tid = pick(e.clientX, e.clientY);
      if (gid && tid) opts.onDropGuest(gid, tid, camState());
    });

    // vòng lặp vẽ
    let disposed = false;
    const loop = () => {
      if (disposed) return;
      controls.update(); renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    return {
      setView,
      camState,
      snapshot() { renderer.render(scene, camera); return cv.toDataURL("image/png"); },
      dispose() {
        disposed = true; ro.disconnect(); controls.dispose();
        scene.traverse((o) => {
          o.geometry && o.geometry.dispose();
          if (o.material) [].concat(o.material).forEach((m) => { m.map && m.map.dispose(); m.dispose(); });
        });
        renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss();
      },
    };
  }

  window.Seating3D = { mount };
})();
