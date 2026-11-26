// 离线缓存：全部文件预先缓存，之后优先读缓存；有网时后台更新。
const VERSION = "v7-2026-11-26";
const CACHE = "iceland-" + VERSION;
const FILES = [
  "./", "index.html", "style.css", "app.js", "data.js", "map-shape.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  // cache: "reload" 绕过浏览器缓存，确保拿到服务器上的最新文件
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("message", e => { if (e.data === "v" && e.source) e.source.postMessage({ v: VERSION }); });

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // 外部链接不拦截
  if (url.pathname.endsWith("data/live.json")) return; // 实时数据直接走网络，离线时由页面读取本地保存的上一份
  if (url.pathname.endsWith("/data.js")) { // 行程：网络优先，3 秒拿不到就用缓存
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await Promise.race([fetch(e.request, { cache: "no-store" }), new Promise((_, rej) => setTimeout(() => rej(), 3000))]);
        if (res && res.ok) { cache.put("data.js", res.clone()); return res; }
      } catch {}
      return (await cache.match("data.js")) || fetch(e.request);
    })());
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      }).catch(() => hit || caches.match("index.html"));
      return hit || net;
    })
  );
});
