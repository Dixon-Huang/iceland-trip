// 每小时由 GitHub Actions 运行：抓取路况、天气、极光，写入 data/live.json
// 数据源：
//   路况  Vegagerðin  https://gagnaveita.vegagerdin.is/api/faerd2017_1
//   天气  Open-Meteo  https://api.open-meteo.com/v1/forecast
//   极光  NOAA SWPC   https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json
//         冰岛气象局  https://xmlweather.vedur.is/aurora?op=xml&lang=en&type=index
import fs from "fs";
import vm from "vm";

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL("../data.js", import.meta.url), "utf8"), ctx);
const T = ctx.window.TRIP, P = T.places;

async function get(url, type = "json") {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "iceland-trip-pwa (github.com/Dixon-Huang/iceland-trip)" } });
      if (!r.ok) throw new Error(r.status);
      return type === "json" ? await r.json() : await r.text();
    } catch (e) { if (i === 2) { console.error("fetch failed", url, e.message); return null; } await new Promise(s => setTimeout(s, 3000)); }
  }
}

/* ---------------- 路况 ---------------- */
// 每天要看的路：「路名」整条匹配；「Hringvegur」（1 号公路）再按路段地名筛选
const ROADS = {
  // KEF → 雷克雅未克 → Hellisheiði → Selfoss
  "2026-12-02": { roads: ["Reykjanesbraut"], ring: ["Rauðavatn", "Nesjavallaleið", "Hellisheiði", "Fossvellir", "Selfoss - Hveragerði"] },
  // 黄金圈：35 / 36 / 365 / 37
  "2026-12-03": { roads: ["Þingvallavegur", "Lyngdalsheiðarvegur", "Laugarvatnsvegur", "Biskupstungnabraut"], ring: [], ex: ["Mosfellsdal", "Mosfellsheiði", "Grafningsvegur"] },
  // Selfoss → Vík
  "2026-12-04": { roads: ["Dyrhólavegur"], ring: ["Þjórsá", "Hella - Þjórsá", "Hvolsvöllur", "Markarfljót", "Steinar", "Dyrhólavegur - ", "Reynisfjall"] },
  // Vík → Hali
  "2026-12-05": { roads: [], ring: ["Mýrdalssand", "Skálm", "Skaftárungu", "Eldhraun", "Síðu", "Skeiðarársand", "Freysnes", "Fagurhólsmýri", "Breiðamerkursand", "(Hólmur) - Jökulsá"] },
  // Vík → 雷克雅未克
  "2026-12-06": { roads: [], ring: ["Reynisfjall", "Dyrhólavegur - ", "Steinar", "Markarfljót", "Hvolsvöllur", "Hella - Þjórsá", "Þjórsá", "Selfoss - Hveragerði", "Hellisheiði", "Fossvellir", "Nesjavallaleið", "Rauðavatn"] },
  "2026-12-07": { roads: [], ring: [] },
  // Reykjanes 半岛
  "2026-12-08": { roads: ["Krýsuvíkurvegur", "Suðurstrandarvegur", "Nesvegur", "Grindavíkurvegur", "Reykjanesbraut", "Hafnavegur"], ring: [], ex: ["Selvogur", "sýslumörk"] },
  "2026-12-09": { roads: [], ring: [] }
};
const COND_ZH = {
  "Easily passable": "畅通", "Spots of ice": "局部结冰", "Slippery": "路滑", "Slushy": "雪泥", "Wet": "路面湿",
  "Snow": "积雪", "Snowy": "积雪", "Patchy snow": "局部积雪", "Impassable": "无法通行", "Closed": "封闭",
  "Storm conditions": "暴风", "Not known": "未知", "Spots of slush": "局部雪泥", "Icy": "结冰", "Difficult driving conditions": "难行"
};
const SEV = s => /Closed|Impassable/i.test(s) ? 4 : /Storm/i.test(s) ? 4 : /Slippery|Snow|Icy|Slush|Difficult/i.test(s) ? 3 : /Spots of ice|patchy/i.test(s) ? 2 : /Not known/i.test(s) ? 1 : 0;

function roadsForDay(feed, date) {
  const cfg = ROADS[date]; if (!feed || !cfg || (!cfg.roads.length && !cfg.ring.length)) return null;
  const segs = feed.filter(r => {
    const full = (r.FulltNafnButs || "").trim();
    if ((cfg.ex || []).some(k => full.includes(k))) return false;
    if (/^Hringvegur/.test(full)) return cfg.ring.some(k => full.includes(k)); // 路名写法不统一：「Hringvegur:」「Hringvegur um …」「Hringvegur.」
    return cfg.roads.some(rd => full.startsWith(rd));
  }).map(r => ({ n: r.FulltNafnButs, c: r.AstandLysingEn || "", zh: COND_ZH[r.AstandLysingEn] || r.AstandLysingEn || "未知", s: SEV(r.AstandLysingEn || ""), t: r.DagsSkrad }));
  if (!segs.length) return { worst: null, bad: [], total: 0 };
  segs.sort((a, b) => b.s - a.s);
  return { worst: segs[0].zh, worstSev: segs[0].s, bad: segs.filter(x => x.s >= 2).slice(0, 8), total: segs.length };
}

/* ---------------- 天气 ---------------- */
// 每天取：路线起点、中点、终点 + 当晚住处
function pointsForDay(d) {
  const r = T.routes[d.date] || []; const pts = [];
  if (r.length) { pts.push(r[0], r[Math.floor(r.length / 2)], r[r.length - 1]); }
  if (d.sleep) pts.push([P[d.sleep].lat, P[d.sleep].lon]);
  return pts.length ? pts : [[P.kef.lat, P.kef.lon]];
}
const WCODE = c => c == null ? "" : c >= 95 ? "雷暴" : c >= 85 ? "阵雪" : c >= 80 ? "阵雨" : c >= 71 ? "下雪" : c >= 66 ? "冻雨" : c >= 61 ? "下雨" : c >= 51 ? "毛毛雨" : c >= 45 ? "雾" : c >= 3 ? "阴" : c >= 1 ? "多云" : "晴";

async function weatherForDay(d) {
  const pts = pointsForDay(d);
  const q = new URLSearchParams({
    latitude: pts.map(p => p[0]).join(","), longitude: pts.map(p => p[1]).join(","),
    hourly: "temperature_2m,apparent_temperature,precipitation,snowfall,weather_code,wind_speed_10m,wind_gusts_10m,cloud_cover,cloud_cover_low,cloud_cover_mid",
    wind_speed_unit: "ms", timezone: "GMT", start_date: d.date, end_date: nextDate(d.date)
  });
  let res = await get("https://api.open-meteo.com/v1/forecast?" + q);
  if (!res) return null; if (!Array.isArray(res)) res = [res];
  const day = { tmin: 99, tmax: -99, feel: 99, gust: 0, wind: 0, rain: 0, snow: 0, codes: {} };
  res.forEach((loc, li) => {
    const h = loc.hourly; if (!h) return;
    h.time.forEach((t, i) => {
      const hr = +t.slice(11, 13), dd = t.slice(0, 10);
      if (dd !== d.date || hr < 8 || hr > 18) return; // 白天行车时段
      const v = k => h[k][i];
      if (v("temperature_2m") == null) return;
      day.tmin = Math.min(day.tmin, v("temperature_2m")); day.tmax = Math.max(day.tmax, v("temperature_2m"));
      day.feel = Math.min(day.feel, v("apparent_temperature")); day.gust = Math.max(day.gust, v("wind_gusts_10m")); day.wind = Math.max(day.wind, v("wind_speed_10m"));
      if (li < 3) { day.rain += v("precipitation") / 3; day.snow += v("snowfall") / 3; }
      const c = WCODE(v("weather_code")); day.codes[c] = (day.codes[c] || 0) + 1;
    });
  });
  if (day.tmax === -99) return null;
  // 夜间云量：当晚住处 20:00–02:00
  const night = res[res.length - 1].hourly; let cl = [], lo = [];
  night.time.forEach((t, i) => {
    const hr = +t.slice(11, 13), dd = t.slice(0, 10);
    if ((dd === d.date && hr >= 20) || (dd === nextDate(d.date) && hr <= 2)) { if (night.cloud_cover[i] != null) { cl.push(night.cloud_cover[i]); lo.push(night.cloud_cover_low[i]); } }
  });
  const sky = Object.entries(day.codes).sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, 2).join("转");
  return {
    sky, tmin: r1(day.tmin), tmax: r1(day.tmax), feel: r1(day.feel), gust: r1(day.gust), wind: r1(day.wind),
    rain: r1(day.rain), snow: r1(day.snow),
    nightCloud: cl.length ? Math.round(avg(cl)) : null, nightLow: lo.length ? Math.round(avg(lo)) : null
  };
}

/* ---------------- 极光 ---------------- */
function kpForNight(kp, date) {
  if (!kp) return null;
  const rows = Array.isArray(kp) && Array.isArray(kp[0]) ? kp.slice(1).map(r => ({ time_tag: r[0], kp: +r[1] })) : kp; // 兼容新旧两种格式
  const nd = nextDate(date);
  const vals = rows.filter(r => { const t = String(r.time_tag).replace(" ", "T"); const dd = t.slice(0, 10), hr = +t.slice(11, 13); return (dd === date && hr >= 18) || (dd === nd && hr <= 3); }).map(r => +r.kp);
  return vals.length ? r1(Math.max(...vals)) : null;
}
function imoNight(xml, date) {
  if (!xml) return null;
  const blocks = xml.split("<night_data>").slice(1);
  for (const b of blocks) {
    const g = tag => (new RegExp(`<${tag}>([^<]*)</${tag}>`).exec(b) || [])[1] || "";
    if (g("evening_date") === date) {
      const act = g("activity_forecast");
      return { dark: g("darkness") || null, dawn: g("dawn") || null, activity: act === "" ? null : +act };
    }
  }
  return null;
}
function auroraScore(kp, imoAct, cloud) {
  const act = imoAct != null ? imoAct : kp; // 冰岛气象局活动指数优先，其次 NOAA Kp
  if (cloud == null) return { level: null, text: "暂无云量" };
  if (cloud >= 85) return { level: 0, text: "低：几乎全阴" };
  if (act == null) return cloud <= 40 ? { level: 2, text: "云少 · Kp 未公布" } : cloud <= 65 ? { level: 1, text: "部分有云 · Kp 未公布" } : { level: 0, text: "低：云多" };
  if (act >= 4 && cloud <= 50) return { level: 3, text: "高" };
  if (act >= 3 && cloud <= 65) return { level: 2, text: "中" };
  if (act >= 2 && cloud <= 40) return { level: 2, text: "中" };
  return { level: 1, text: "低" };
}

/* ---------------- 主流程 ---------------- */
const r1 = x => Math.round(x * 10) / 10, avg = a => a.reduce((s, x) => s + x, 0) / a.length;
function nextDate(d) { const t = new Date(d + "T00:00:00Z"); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 10); }

const [feed, kp, imo] = await Promise.all([
  get("https://gagnaveita.vegagerdin.is/api/faerd2017_1"),
  get("https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json"),
  get("https://xmlweather.vedur.is/aurora?op=xml&lang=en&type=index", "text")
]);

// 某个数据源这次没抓到，就沿用上一次的结果
let prev = {};
try { prev = JSON.parse(fs.readFileSync(new URL("../data/live.json", import.meta.url), "utf8")).days || {}; } catch {}

const out = { updated: new Date().toISOString(), days: {} };
for (const d of T.days) {
  const p = prev[d.date] || {};
  const w = (await weatherForDay(d)) || p.weather || null;
  const k = kpForNight(kp, d.date) ?? (p.aurora ? p.aurora.kp : null);
  const im = imoNight(imo, d.date) || (p.aurora && p.aurora.imo != null ? { activity: p.aurora.imo, dark: p.aurora.dark } : null);
  out.days[d.date] = {
    road: feed ? roadsForDay(feed, d.date) : (p.road || null),
    weather: w,
    aurora: { kp: k, imo: im ? im.activity : null, dark: im ? im.dark : null, cloud: w ? w.nightCloud : null, ...auroraScore(k, im ? im.activity : null, w ? w.nightCloud : null) }
  };
}
// 路况调试：列出 1 号公路的路段名，方便核对筛选关键词
if (feed) out.ringSections = [...new Set(feed.filter(r => /^Hringvegur/.test(r.FulltNafnButs || "")).map(r => r.FulltNafnButs))];
out.sources = { road: !!feed, kp: !!kp, imo: !!imo };

fs.mkdirSync(new URL("../data/", import.meta.url), { recursive: true });
fs.writeFileSync(new URL("../data/live.json", import.meta.url), JSON.stringify(out));
console.log("ok", Object.keys(out.days).length, "days; sources", out.sources);
