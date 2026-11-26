// 检查 data.js 格式：提交后自动运行，出错时 GitHub 会发邮件给提交的人
import fs from "fs";
import vm from "vm";

const errs = [];
let T;
try {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL("../data.js", import.meta.url), "utf8"), ctx);
  T = ctx.window.TRIP;
} catch (e) {
  console.error("data.js 语法错误（常见原因：少了逗号、引号或括号）：\n" + e.message);
  process.exit(1);
}
if (!T || !Array.isArray(T.days)) errs.push("找不到 TRIP.days");
else {
  T.days.forEach((d, i) => {
    const where = `第 ${i + 1} 天（${d.date || "无日期"}）`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || "")) errs.push(`${where}：date 要写成 2026-12-02 这种格式`);
    if (d.sleep && !T.places[d.sleep]) errs.push(`${where}：sleep 用的地点 "${d.sleep}" 在 places 里不存在`);
    (d.items || []).forEach((it, k) => {
      if (!/^\d{1,2}:\d{2}/.test(it.t || "")) errs.push(`${where} 第 ${k + 1} 项：时间 t 要写成 09:30 这种格式`);
      if (!it.w) errs.push(`${where} 第 ${k + 1} 项：缺少内容 w`);
      if (it.p && !T.places[it.p]) errs.push(`${where} 第 ${k + 1} 项：地点 "${it.p}" 在 places 里不存在`);
    });
  });
  Object.entries(T.places || {}).forEach(([k, p]) => {
    if (!p.n || !p.q || typeof p.lat !== "number" || typeof p.lon !== "number") errs.push(`地点 ${k}：需要 n、q、lat、lon 四项`);
  });
}
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log("data.js 检查通过：" + T.days.length + " 天，" + Object.keys(T.places).length + " 个地点");
