(() => {
"use strict";
let T = window.TRIP;
try {
  const ok = T && Array.isArray(T.days) && T.days.length && T.places && T.days.every(d => d.date && Array.isArray(d.items));
  if (ok) localStorage.setItem("ice-trip-good", JSON.stringify(T));
  else { T = JSON.parse(localStorage.getItem("ice-trip-good")); window.TRIP = T; }
} catch {}
if (!T) { document.body.innerHTML = '<p style="padding:24px">行程文件格式有误，请检查 data.js</p>'; throw new Error("data.js invalid"); }
const P = T.places, S = window.MAP_SHAPE;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const DAY_COLORS = ["#7cc4ff", "#5ee0b0", "#ffcf6b", "#ff8fb1", "#c79bff", "#ff9f5a", "#9be15d", "#b0c4d8"];

/* ---------- 时间：冰岛时间 = UTC ---------- */
function isNow() { const d = new Date(); return { date: d.toISOString().slice(0, 10), min: d.getUTCHours() * 60 + d.getUTCMinutes() }; }
const toMin = t => { const m = /^(\d{1,2}):(\d{2})/.exec(t || ""); return m ? +m[1] * 60 + +m[2] : null; };
function dayIndexForToday() {
  const { date } = isNow();
  const i = T.days.findIndex(d => d.date === date);
  if (i >= 0) return { i, phase: "during" };
  return date < T.start ? { i: 0, phase: "before" } : { i: T.days.length - 1, phase: "after" };
}
const fmtDate = d => `${+d.slice(5, 7)}/${+d.slice(8, 10)}`;

/* ---------- 导航链接 ---------- */
const gmaps = q => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}&travelmode=driving`;
const amaps = q => `https://maps.apple.com/?daddr=${encodeURIComponent(q)}&dirflg=d`;

/* ---------- 本地存储 ---------- */
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

/* ---------- 实时数据：路况 / 天气 / 极光 ---------- */
const fmtTime = iso => { const d = new Date(iso); return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`; };
function liveBlock(date) {
  const L = store.get("ice-live", null); const x = L && L.days && L.days[date];
  const d = T.days.find(v => v.date === date);
  const head = `<div class="lh"><b>${fmtDate(date)} ${d ? d.wd : ""}</b><span>${L ? "更新 " + fmtTime(L.updated) : "暂无数据"}</span></div>`;
  if (!x) return `<div class="live">${head}</div>`;
  const rows = [];
  const r = x.road;
  if (r && r.total) {
    const cls = r.worstSev >= 4 ? "hi" : r.worstSev >= 2 ? "mid" : "ok";
    const bad = r.bad.map(b => `${esc(b.n.replace(/^Hringvegur:\s*/, "1号公路 "))}：${esc(b.zh)}`).join("<br>");
    rows.push(["实时路况", `<b class="${cls}">${r.worstSev >= 2 ? "最差 " + esc(r.worst) : "全线畅通"}</b><span class="sub">${r.total} 个路段${bad ? "<br>" + bad : ""}</span>`]);
  } else if (r) rows.push(["实时路况", `<span class="sub">无匹配路段</span>`]);
  const w = x.weather;
  if (w) {
    const g = w.gust >= 20 ? "hi" : w.gust >= 15 ? "mid" : "ok";
    const pr = [w.rain >= 0.5 ? `降水 ${w.rain} mm` : "", w.snow >= 0.5 ? `降雪 ${w.snow} cm` : ""].filter(Boolean).join(" · ");
    rows.push(["天气", `<b>${esc(w.sky)} ${w.tmin}~${w.tmax}°C</b> · 体感 ${w.feel}°C<span class="sub">阵风 <b class="${g}">${w.gust} m/s</b>${pr ? " · " + pr : ""}</span>`]);
  } else rows.push(["天气", `<span class="sub">超出预报范围</span>`]);
  const a = x.aurora;
  if (a) {
    const cls = a.level >= 3 ? "ok" : a.level === 2 ? "ok" : a.level === 1 ? "mid" : "hi";
    const parts = [a.cloud != null ? `夜间云量 ${a.cloud}%` : "", a.imo != null ? `活动指数 ${a.imo}/9` : a.kp != null ? `Kp ${a.kp}` : "", a.dark ? `${a.dark} 天黑` : ""].filter(Boolean).join(" · ");
    rows.push(["极光", `<b class="${cls}">${esc(a.text)}</b><span class="sub">${parts}</span>`]);
  }
  return `<div class="live">${head}${rows.map(([k, v]) => `<div class="lr"><span class="lk">${k}</span><span class="lv">${v}</span></div>`).join("")}</div>`;
}
let liveBusy = false;
async function refreshLive() {
  if (liveBusy || !navigator.onLine) return; liveBusy = true;
  try {
    const r = await fetch("data/live.json?t=" + Date.now(), { cache: "no-store" });
    if (r.ok) { const j = await r.json(); const old = store.get("ice-live", null); if (!old || j.updated !== old.updated) { store.set("ice-live", j); renderToday(); renderPlan(); } }
  } catch {} finally { liveBusy = false; }
}

/* ---------- 时间轴 ---------- */
function timeline(day, live) {
  const { min } = isNow();
  const mins = day.items.map(it => toMin(it.t));
  let nowIdx = -1;
  if (live) mins.forEach((m, k) => { if (m != null && m <= min) nowIdx = k; });
  return `<ul class="tl">${day.items.map((it, k) => {
    const cls = live ? (k < nowIdx ? "done" : k === nowIdx ? "now" : "") : "";
    const nav = it.p ? `<button class="nav" data-place="${it.p}">导航</button>` : "<span></span>";
    return `<li class="${cls}"><span class="t">${esc(it.t)}</span><span class="w">${esc(it.w)}${it.n ? `<span class="n">${esc(it.n)}</span>` : ""}</span>${nav}</li>`;
  }).join("")}</ul>`;
}
const tipsHtml = d => d.tips && d.tips.length ? `<div class="tips">${d.tips.map(t => `<p>${esc(t)}</p>`).join("")}</div>` : "";
const metaHtml = d => `<div class="meta">${d.drive ? `<span class="pill">开车 ${esc(d.drive)}</span>` : ""}${d.sun ? `<span class="pill">${esc(d.sun)}</span>` : ""}</div>`;

/* ---------- 三餐与住宿 ---------- */
function mealsBlock(d) {
  const rows = (d.meals || []).map(m => [m.k, `${m.t ? `<span class="t">${esc(m.t)}</span> ` : ""}${esc(m.w)}`, m.p]);
  rows.push(["住宿", d.sleep ? esc(P[d.sleep].n) : "—", d.sleep]);
  return `<table class="kv meals">${rows.map(([k, v, p]) => `<tr><td>${k}</td><td>${v}</td><td>${p ? `<button class="nav" data-place="${p}">导航</button>` : ""}</td></tr>`).join("")}</table>`;
}

/* ---------- 今天 ---------- */
function renderToday() {
  const { i, phase } = dayIndexForToday();
  const d = T.days[i];
  let head = "";
  if (phase === "before") {
    const days = Math.ceil((Date.parse(T.start + "T00:00:00Z") - Date.now()) / 864e5);
    head = `<div class="card"><div class="muted">距离出发</div><div class="big">${days} 天</div></div>`;
  } else if (phase === "after") {
    head = `<div class="card"><div class="big">旅途结束</div></div>`;
  }
  const sleep = d.sleep ? `<div class="btnrow"><a class="btn" href="${gmaps(P[d.sleep].q)}">导航去今晚住处</a><button class="btn alt" data-goto-map="${d.date}">看今天地图</button></div>` : "";
  const i2 = phase === "after" ? i : Math.min(i + 1, T.days.length - 1);
  const liveDates = [...new Set([d.date, T.days[i2].date])];
  $("#v-today").innerHTML = `${head}
    <div class="card"><h3>路况 · 天气 · 极光</h3>${liveDates.map(liveBlock).join("")}</div>
    <div class="card">
      <h3><span class="pill g">第 ${i + 1} 天</span> ${fmtDate(d.date)} ${d.wd}｜${esc(d.title)}</h3>
      <p class="lead">${esc(d.lead)}</p>${metaHtml(d)}${sleep}
      ${mealsBlock(d)}
      ${timeline(d, phase === "during")}${tipsHtml(d)}
    </div>
    <div class="card"><h3>出发前检查</h3><ul class="plain">${T.daily.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="btnrow"><a class="btn alt" href="https://umferdin.is/en">路况 road.is</a><a class="btn alt" href="https://en.vedur.is/weather/forecasts/aurora/">极光与云量</a></div></div>`;
  $("#topSub").textContent = phase === "during" ? `今天 ${fmtDate(d.date)} ${d.wd} · 冰岛时间 ${new Date().toISOString().slice(11, 16)}` : `${fmtDate(T.start)}–${fmtDate(T.end)}`;
}

/* ---------- 行程 ---------- */
function renderPlan() {
  const { i, phase } = dayIndexForToday();
  $("#v-plan").innerHTML = T.days.map((d, k) => `
    <details class="day" ${phase === "during" && k === i ? "open" : ""}>
      <summary><span class="d">${fmtDate(d.date)} ${d.wd}</span>${esc(d.title)}</summary>
      <div class="body"><p class="lead">${esc(d.lead)}</p>${metaHtml(d)}
        ${mealsBlock(d)}
        ${liveBlock(d.date)}
        <div class="btnrow"><button class="btn alt" data-goto-map="${d.date}">在地图上看这天</button></div>
        ${timeline(d, false)}${tipsHtml(d)}</div>
    </details>`).join("");
}

/* ---------- 清单 ---------- */
function renderCheck() {
  const st = store.get("ice-check", {});
  const list = (title, arr, note) => `<div class="card"><h3>${title}</h3>${note ? `<p class="muted">${note}</p>` : ""}${arr.map(x =>
    `<label class="ck ${st[x.id] ? "on" : ""}"><input type="checkbox" data-ck="${x.id}" ${st[x.id] ? "checked" : ""}><span>${esc(x.t)}</span></label>`).join("")}</div>`;
  $("#v-check").innerHTML = list("要订的", T.bookings) + list("出发前", T.before) + list("行李", T.packing);
}

/* ---------- 须知 ---------- */
function renderInfo() {
  const hotels = T.days.filter(d => d.sleep).reduce((a, d) => { const h = P[d.sleep]; const last = a[a.length - 1]; if (last && last.h === h) last.to = d.date; else a.push({ h, from: d.date, to: d.date }); return a; }, []);
  $("#v-info").innerHTML = `
  <div class="card"><h3>紧急</h3>
    <table class="kv">
      <tr><td>报警/急救</td><td><a href="tel:112">112</a></td></tr>
      <tr><td>Blue Car 道路救援</td><td><a href="tel:+3547737070">+354 773 7070</a>（24 小时）</td></tr>
    </table></div>

  <div class="card"><h3>航班、车、住宿</h3>
    <table class="kv">
      <tr><td>去程</td><td>12/2 FI533 慕尼黑 13:00 → KEF 16:00</td></tr>
      <tr><td>回程</td><td>12/9 FI532 KEF 07:20 → 慕尼黑 12:05（直飞）</td></tr>
      <tr><td>租车</td><td>Blue Car，机场办公室 Blikavöllur 3；冬季 05:00–02:00</td></tr>
      ${hotels.map(x => `<tr><td>${fmtDate(x.from)}${x.to !== x.from ? "–" + fmtDate(x.to) : ""}</td><td>${esc(x.h.n)} <button class="nav" data-place="${Object.keys(P).find(k => P[k] === x.h)}">导航</button></td></tr>`).join("")}
      <tr><td>冰洞</td><td>12/5 Glacier Adventure「Blue Ice Cave Adventure」09:30–15:30，2 位成人，Hali 营地集合</td></tr>
    </table></div>

  <div class="card"><h3>冰岛特有的开车规则</h3><ul class="plain">
    <li><b>双车道环岛内道优先</b>：第一个出口就出走外道，更远的走内道；进环岛后不能变道。外道车要让内道出环岛的车。</li>
    <li><b>单车道桥</b>（标志 Einbreið brú）：先到先过，对面有车已上桥就在桥头等。</li>
    <li>限速：铺装路 90，碎石路 80，镇内 50 或更低；测速摄像头多，罚单经租车公司扣款。</li>
    <li>全天开近光灯；红灯不能右转；没有标志的路口让右边来车。</li>
    <li>开车的人一滴酒都不喝；开车不能手持手机。</li>
    <li>严禁开下公路；不要停在路边拍照或看极光，开进正规停车场或岔路再停。</li></ul></div>

  <div class="card"><h3>冬天</h3><ul class="plain">
    <li><b>风比冰危险</b>：开车门时两只手抓牢，尽量车头朝着风停。车门被风吹坏，基本险大多不赔。</li>
    <li>桥面和背阴处的冰看不出来：别急刹，跟车距离留大。</li>
    <li>vedur.is 有黄色以上大风预警就重新考虑路线。</li></ul></div>

  <div class="card"><h3>加油</h3><ul class="plain">
    <li>插卡 → 输 PIN → 选固定金额（别选加满，冻结金额会很高）→ 选油泵号 → 加油。</li>
    <li>汽油 Bensín，柴油 Dísel；以油枪上的字为准。</li>
    <li>中国信用卡 6 位密码在 N1 不一定能用：用德国卡，或在有人值守的 N1 买预付加油卡（只能在 N1 用）。</li></ul></div>

  <div class="card"><h3>路牌常见词</h3>
    <table class="kv">
      <tr><td>Einbreið brú</td><td>单车道桥</td></tr>
      <tr><td>Blindhæð</td><td>前方坡顶看不到对面来车，靠右减速</td></tr>
      <tr><td>Malbik endar</td><td>铺装路结束，进入碎石路，减速</td></tr>
      <tr><td>Hálka</td><td>路面结冰</td></tr>
      <tr><td>Lokað</td><td>封闭</td></tr>
      <tr><td>Gjaldskylda</td><td>收费停车</td></tr>
    </table></div>

  <div class="card"><h3>看极光</h3><ul class="plain">
    <li>每天下午看 vedur.is 极光页：云量比极光强度更关键，白色区域是晴天。</li>
    <li>21:00–01:00 最有可能。离开镇上灯光 10–15 分钟，停进正规停车区，关车灯等 15 分钟。</li>
    <li>手机用夜景模式放稳；肉眼常是淡灰白，相机里才是绿色。</li></ul></div>

  <div class="card"><h3>黑沙滩 Reynisfjara</h3><p class="muted" style="color:var(--tx)">入口警示灯：黄灯不进黄色区域；红灯海滩关闭，只在观景台看。离海水至少 30 米，永远不要背对大海。</p></div>

  <div class="card"><h3>离线状态</h3>
    <p class="muted" id="swState">检查中…</p>
    <div class="btnrow"><button class="btn alt" id="updBtn">有网时检查更新</button></div></div>`;
  swStatus();
  $("#updBtn").onclick = async () => {
    if (!("serviceWorker" in navigator)) return;
    const r = await navigator.serviceWorker.getRegistration(); if (r) await r.update();
    location.reload();
  };
}
async function swStatus() {
  const el = $("#swState"); if (!el) return;
  if (!("serviceWorker" in navigator)) { el.textContent = "不支持离线"; return; }
  const r = await navigator.serviceWorker.getRegistration();
  let persist = "";
  try { if (navigator.storage && navigator.storage.persisted) persist = (await navigator.storage.persisted()) ? " · 长期保存" : ""; } catch {}
  el.textContent = r && r.active ? `离线可用 · ${window.APP_VERSION || ""}${persist}` : "离线内容下载中";
}

/* ---------- 地图 ---------- */
const proj = (lat, lon) => [(lon - S.LON0) * S.C * S.K, (S.LAT0 - lat) * S.K];
const svg = $("#map");
let vb = { x: 0, y: 0, w: S.W, h: S.H }, mapDay = null, gpsPos = null, gpsWatch = null;

function mapPlaces(day) {
  if (!day) { const seen = new Set(); return Object.keys(P).filter(k => !seen.has(k) && seen.add(k)); }
  const d = T.days.find(x => x.date === day); const out = [];
  d.items.forEach(it => { if (it.p && !out.includes(it.p)) out.push(it.p); });
  if (d.sleep && !out.includes(d.sleep)) out.push(d.sleep);
  return out;
}
function fitTo(day) {
  const pts = [];
  if (day) { (T.routes[day] || []).forEach(([a, b]) => pts.push(proj(a, b))); mapPlaces(day).forEach(k => pts.push(proj(P[k].lat, P[k].lon))); }
  if (!pts.length) { vb = { x: 0, y: 0, w: S.W, h: S.H }; return; }
  let x0 = Math.min(...pts.map(p => p[0])), x1 = Math.max(...pts.map(p => p[0]));
  let y0 = Math.min(...pts.map(p => p[1])), y1 = Math.max(...pts.map(p => p[1]));
  const pad = Math.max(6, (x1 - x0) * .15, (y1 - y0) * .15);
  x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
  const box = svg.getBoundingClientRect(); const ar = (box.width || 360) / (box.height || 500);
  let w = x1 - x0, h = y1 - y0;
  if (w / h > ar) { const nh = w / ar; y0 -= (nh - h) / 2; h = nh; } else { const nw = h * ar; x0 -= (nw - w) / 2; w = nw; }
  vb = { x: x0, y: y0, w, h };
}
function drawMap() {
  const box = svg.getBoundingClientRect(); const px = vb.w / (box.width || 360); // 每个屏幕像素对应的地图单位
  const r = 9 * px, fs = 12 * px, sw = 3 * px;
  const days = mapDay ? [mapDay] : T.days.map(d => d.date);
  let h = `<rect x="-50" y="-50" width="${S.W + 100}" height="${S.H + 100}" fill="#0a2a44"/>`;
  h += `<path d="${S.d}" fill="#1f3b52" stroke="#3d6584" stroke-width="${px}"/>`;
  days.forEach(dd => {
    const ci = T.days.findIndex(x => x.date === dd); const pts = (T.routes[dd] || []).map(([a, b]) => proj(a, b));
    if (pts.length > 1) h += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${DAY_COLORS[ci]}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>`;
  });
  const list = mapPlaces(mapDay);
  const showLabels = vb.w < 45;
  list.forEach((k, n) => {
    const p = P[k]; const [x, y] = proj(p.lat, p.lon);
    const ci = mapDay ? T.days.findIndex(x => x.date === mapDay) : T.days.findIndex(d => d.items.some(it => it.p === k) || d.sleep === k);
    const col = DAY_COLORS[Math.max(0, ci)];
    const label = mapDay ? String(n + 1) : "";
    h += `<g class="mk" data-place="${k}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="${r * 1.6}" fill="transparent"/><circle cx="${x}" cy="${y}" r="${mapDay ? r : r * .6}" fill="${p.k === "hotel" ? "#ffffff" : col}" stroke="#0b1d2e" stroke-width="${px * 1.5}"/>`;
    if (label) h += `<text x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" font-weight="700" fill="#0b1d2e">${label}</text>`;
    if (showLabels && mapDay) h += `<text x="${x + r * 1.3}" y="${y + fs * .36}" font-size="${fs}" fill="#eaf2f8" stroke="#0b1d2e" stroke-width="${px * 3}" paint-order="stroke">${esc(p.n)}</text>`;
    h += `</g>`;
  });
  if (gpsPos) { const [x, y] = proj(gpsPos.lat, gpsPos.lon); h += `<circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="rgba(124,196,255,.25)"/><circle cx="${x}" cy="${y}" r="${r * .8}" fill="#2f8cff" stroke="#fff" stroke-width="${px * 2}"/>`; }
  svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  svg.innerHTML = h;
}
function renderChips() {
  const chips = [`<button class="chip ${mapDay ? "" : "on"}" data-day="">全部</button>`].concat(T.days.map((d, i) =>
    `<button class="chip ${mapDay === d.date ? "on" : ""}" data-day="${d.date}" style="${mapDay === d.date ? "" : `border-color:${DAY_COLORS[i]}`}">${fmtDate(d.date)}</button>`));
  $("#dayChips").innerHTML = chips.join("");
  // 当天地点编号列表（与地图上的数字对应）
  const ml = $("#mapList");
  ml.style.display = mapDay ? "" : "none";
  if (!mapDay) { ml.innerHTML = ""; return; }
  ml.innerHTML = `<ul class="tl">${mapPlaces(mapDay).map((k, n) => {
    const d = T.days.find(x => x.date === mapDay); const it = d.items.find(i => i.p === k && !i.w.startsWith("出发")) || d.items.find(i => i.p === k);
    return `<li><span class="t">${n + 1}</span><span class="w">${esc(P[k].n)}${it ? `<span class="n">${esc(it.t)}</span>` : `<span class="n">今晚住宿</span>`}</span><button class="nav" data-place="${k}">导航</button></li>`;
  }).join("")}</ul>`;
}
function showMap(day) {
  mapDay = day || null; renderChips(); switchView("map");
  requestAnimationFrame(() => { fitTo(mapDay); drawMap(); });
}
// 缩放与拖动
function zoomAt(f, cx, cy) {
  const nw = Math.min(S.W * 1.5, Math.max(1.5, vb.w * f)); const k = nw / vb.w;
  vb = { x: cx - (cx - vb.x) * k, y: cy - (cy - vb.y) * k, w: nw, h: vb.h * k }; drawMap();
}
function toMap(clientX, clientY) { const b = svg.getBoundingClientRect(); return [vb.x + (clientX - b.left) / b.width * vb.w, vb.y + (clientY - b.top) / b.height * vb.h]; }
const ptrs = new Map(); let pinch0 = null, moved = 0, lastTap = 0;
svg.addEventListener("pointerdown", e => { svg.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), w: vb.w }; } });
svg.addEventListener("pointermove", e => {
  if (!ptrs.has(e.pointerId)) return; const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 2 && pinch0) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); const [cx, cy] = toMap((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); zoomAt((pinch0.w * pinch0.d / d) / vb.w, cx, cy); moved += 10; return; }
  const bx = svg.getBoundingClientRect(); const dx = (e.clientX - prev[0]) / bx.width * vb.w, dy = (e.clientY - prev[1]) / bx.height * vb.h;
  moved += Math.abs(e.clientX - prev[0]) + Math.abs(e.clientY - prev[1]); vb.x -= dx; vb.y -= dy; drawMap();
});
const up = e => {
  ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null;
  if (moved < 6 && e.type === "pointerup") {
    const g = document.elementFromPoint(e.clientX, e.clientY)?.closest(".mk");
    if (g) { openPlace(g.dataset.place); return; }
    const now = Date.now(); if (now - lastTap < 300) { const [cx, cy] = toMap(e.clientX, e.clientY); zoomAt(.5, cx, cy); } lastTap = now;
  }
};
svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
svg.addEventListener("wheel", e => { e.preventDefault(); const [cx, cy] = toMap(e.clientX, e.clientY); zoomAt(e.deltaY > 0 ? 1.2 : 1 / 1.2, cx, cy); }, { passive: false });
$("#zIn").onclick = () => zoomAt(.6, vb.x + vb.w / 2, vb.y + vb.h / 2);
$("#zOut").onclick = () => zoomAt(1 / .6, vb.x + vb.w / 2, vb.y + vb.h / 2);
$("#zFit").onclick = () => { fitTo(mapDay); drawMap(); };
$("#gps").onclick = () => {
  const b = $("#gps");
  if (gpsWatch != null) { navigator.geolocation.clearWatch(gpsWatch); gpsWatch = null; gpsPos = null; b.classList.remove("on"); drawMap(); return; }
  if (!navigator.geolocation) { alert("这个设备不支持定位"); return; }
  b.classList.add("on");
  gpsWatch = navigator.geolocation.watchPosition(p => {
    const first = !gpsPos; gpsPos = { lat: p.coords.latitude, lon: p.coords.longitude };
    if (first) { const [x, y] = proj(gpsPos.lat, gpsPos.lon); vb = { x: x - vb.w / 2, y: y - vb.h / 2, w: vb.w, h: vb.h }; }
    drawMap();
  }, err => { alert("定位失败：" + err.message + "\n（需要在设置里允许定位）"); b.classList.remove("on"); gpsWatch = null; }, { enableHighAccuracy: true, maximumAge: 10000 });
};
window.addEventListener("resize", () => { if ($("#v-map").classList.contains("active")) drawMap(); });

/* ---------- 地点弹层 ---------- */
function openPlace(k) {
  const p = P[k]; if (!p) return;
  const uses = []; T.days.forEach(d => d.items.forEach(it => { if (it.p === k) uses.push(`${fmtDate(d.date)} ${it.t} ${it.w}`); }));
  $("#sheetCard").innerHTML = `<button class="x" id="sx">×</button><h3>${esc(p.n)}</h3>
    ${uses.length ? `<ul class="plain">${uses.map(u => `<li>${esc(u)}</li>`).join("")}</ul>` : ""}
    <div class="btnrow"><a class="btn" href="${gmaps(p.q)}">Google 地图导航</a><a class="btn alt" href="${amaps(p.q)}">苹果地图</a></div>`;
  $("#sheet").classList.add("show"); $("#sx").onclick = closeSheet;
}
function closeSheet() { $("#sheet").classList.remove("show"); }
$("#sheet").addEventListener("click", e => { if (e.target.id === "sheet") closeSheet(); });

/* ---------- 切换页面 & 事件代理 ---------- */
function switchView(v) {
  document.querySelectorAll(".view").forEach(s => s.classList.toggle("active", s.id === "v-" + v));
  document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
  const titles = { today: "冰岛行程", plan: "全部行程", map: "地图", check: "清单", info: "须知" };
  $("#topTitle").textContent = titles[v]; window.scrollTo(0, 0);
  if (v === "today") renderToday();
  if (v === "map") requestAnimationFrame(() => { if (!svg.getAttribute("viewBox")) fitTo(mapDay); drawMap(); });
}
$("#tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.v === "map" && !svg.getAttribute("viewBox")) { const { i, phase } = dayIndexForToday(); mapDay = phase === "during" ? T.days[i].date : null; renderChips(); } switchView(b.dataset.v); });
document.addEventListener("click", e => {
  const n = e.target.closest("[data-place]"); if (n && !n.classList.contains("mk")) { openPlace(n.dataset.place); return; }
  const g = e.target.closest("[data-goto-map]"); if (g) { showMap(g.dataset.gotoMap); return; }
  const c = e.target.closest(".chip"); if (c) { mapDay = c.dataset.day || null; renderChips(); fitTo(mapDay); drawMap(); }
});
document.addEventListener("change", e => {
  const x = e.target.closest("[data-ck]"); if (!x) return;
  const st = store.get("ice-check", {}); st[x.dataset.ck] = x.checked; store.set("ice-check", st);
  x.closest(".ck").classList.toggle("on", x.checked);
});

/* ---------- 启动 ---------- */
renderToday(); renderPlan(); renderCheck(); renderInfo(); renderChips();
setInterval(() => { if ($("#v-today").classList.contains("active")) renderToday(); }, 60000);
refreshLive();
setInterval(refreshLive, 20 * 60000);
window.addEventListener("online", refreshLive);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") refreshLive(); });
if ("serviceWorker" in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(r => { r.update(); setTimeout(swStatus, 1500); }).catch(() => {});
  // 新版本装好后自动刷新一次
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
  navigator.serviceWorker.addEventListener("message", e => { if (e.data && e.data.v) { window.APP_VERSION = e.data.v; swStatus(); } });
  navigator.serviceWorker.ready.then(r => r.active && r.active.postMessage("v"));
}
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch {}
})();
