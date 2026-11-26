// 冰岛行程数据。所有时间为冰岛时间（UTC，比德国慢 1 小时）。
// 坐标为近似值，仅用于离线示意地图；导航按地名交给 Google / Apple 地图。

window.TRIP = {
  title: "冰岛 12/2–12/9",
  start: "2026-12-02",
  end: "2026-12-09",

  places: {
    kef:        { n: "凯夫拉维克机场 KEF", q: "Keflavík International Airport", lat: 63.985, lon: -22.605, k: "air" },
    bluecar:    { n: "Blue Car 机场办公室", q: "Blue Car Rental, Blikavöllur 3, Keflavík Airport", lat: 63.996, lon: -22.623, k: "car" },
    selfoss:    { n: "Hotel Selfoss", q: "Hotel Selfoss, Eyravegur 2, Selfoss", lat: 63.936, lon: -20.999, k: "hotel" },
    kronan:     { n: "Krónan 超市（Selfoss）", q: "Krónan Selfoss", lat: 63.935, lon: -20.993, k: "shop" },
    kaffikrus:  { n: "Kaffi Krús", q: "Kaffi Krús, Austurvegur 7, Selfoss", lat: 63.934, lon: -20.996, k: "food" },
    tryggva:    { n: "Tryggvaskáli 餐厅", q: "Tryggvaskáli, Selfoss", lat: 63.937, lon: -21.003, k: "food" },
    thingvellir:{ n: "Þingvellir 国家公园（P1 游客中心）", q: "Hakið Visitor Centre, Þingvellir", lat: 64.256, lon: -21.129, k: "sight" },
    efstidalur: { n: "Efstidalur II 农场冰淇淋", q: "Efstidalur II", lat: 64.233, lon: -20.634, k: "food" },
    geysir:     { n: "Geysir / Strokkur 间歇泉", q: "Strokkur, Geysir", lat: 64.310, lon: -20.302, k: "sight" },
    gullfoss:   { n: "Gullfoss 黄金瀑布", q: "Gullfoss", lat: 64.327, lon: -20.120, k: "sight" },
    fridheimar: { n: "Friðheimar 番茄温室餐厅", q: "Friðheimar, Reykholt", lat: 64.176, lon: -20.447, k: "food" },
    seljalands: { n: "Seljalandsfoss 瀑布", q: "Seljalandsfoss", lat: 63.616, lon: -19.989, k: "sight" },
    skoga:      { n: "Skógafoss 瀑布", q: "Skógafoss", lat: 63.532, lon: -19.511, k: "sight" },
    solheima:   { n: "Sólheimajökull 冰川", q: "Sólheimajökull parking", lat: 63.530, lon: -19.370, k: "sight" },
    dyrholaey:  { n: "Dyrhólaey 海岬", q: "Dyrhólaey", lat: 63.402, lon: -19.130, k: "sight" },
    kria:       { n: "Hótel Kría（Vík）", q: "Hótel Kría, Vík", lat: 63.419, lon: -18.999, k: "hotel" },
    blackcrust: { n: "Black Crust Pizzeria", q: "Black Crust Pizzeria, Vík", lat: 63.419, lon: -19.002, k: "food" },
    n1vik:      { n: "N1 加油站（Vík）", q: "N1 Vík", lat: 63.419, lon: -19.004, k: "fuel" },
    smidjan:    { n: "Smiðjan Brugghús", q: "Smiðjan Brugghús, Vík", lat: 63.419, lon: -19.007, k: "food" },
    klaustur:   { n: "Kirkjubæjarklaustur（休息、加油）", q: "N1 Kirkjubæjarklaustur", lat: 63.790, lon: -18.053, k: "fuel" },
    hali:       { n: "Glacier Adventure 营地（Hali）", q: "Glacier Adventure Base Camp, Hali", lat: 64.111, lon: -15.951, k: "sight" },
    thorberg:   { n: "Þórbergssetur 餐厅（Hali）", q: "Þórbergssetur, Hali", lat: 64.112, lon: -15.955, k: "food" },
    jokuls:     { n: "Jökulsárlón 冰河湖", q: "Jökulsárlón", lat: 64.048, lon: -16.179, k: "sight" },
    diamond:    { n: "Diamond Beach 钻石沙滩", q: "Diamond Beach, Iceland", lat: 64.044, lon: -16.176, k: "sight" },
    fjalls:     { n: "Fjallsárlón 冰河湖", q: "Fjallsárlón", lat: 64.014, lon: -16.371, k: "sight" },
    reynis:     { n: "Reynisfjara 黑沙滩", q: "Reynisfjara", lat: 63.404, lon: -19.045, k: "sight" },
    vikchurch:  { n: "Vík 小教堂观景点", q: "Víkurkirkja", lat: 63.420, lon: -19.012, k: "sight" },
    skylagoon:  { n: "Sky Lagoon", q: "Sky Lagoon, Kópavogur", lat: 64.116, lon: -21.945, k: "sight" },
    grand:      { n: "Hotel Reykjavík Grand", q: "Hotel Reykjavík Grand, Sigtún 38", lat: 64.143, lon: -21.896, k: "hotel" },
    sjavar:     { n: "Sjávargrillið 海鲜烧烤", q: "Sjávargrillið, Skólavörðustígur 14, Reykjavík", lat: 64.144, lon: -21.929, k: "food" },
    hallgrims:  { n: "Hallgrímskirkja 大教堂", q: "Hallgrímskirkja", lat: 64.142, lon: -21.927, k: "sight" },
    isf:        { n: "Icelandic Street Food", q: "Icelandic Street Food, Reykjavík", lat: 64.146, lon: -21.935, k: "food" },
    bbp:        { n: "Bæjarins Beztu Pylsur 热狗", q: "Bæjarins Beztu Pylsur", lat: 64.148, lon: -21.940, k: "food" },
    tjornin:    { n: "Tjörnin 市中心湖", q: "Tjörnin, Reykjavík", lat: 64.144, lon: -21.942, k: "sight" },
    harpa:      { n: "Harpa 音乐厅", q: "Harpa Concert Hall", lat: 64.150, lon: -21.933, k: "sight" },
    sunvoyager: { n: "Sólfar 太阳航海者", q: "Sun Voyager, Reykjavík", lat: 64.148, lon: -21.922, k: "sight" },
    messinn:    { n: "Messinn 铁锅鱼", q: "Messinn, Lækjargata 6, Reykjavík", lat: 64.147, lon: -21.936, k: "food" },
    caruso:     { n: "Caruso 意大利菜", q: "Caruso, Austurstræti 22, Reykjavík", lat: 64.148, lon: -21.939, k: "food" },
    grotta:     { n: "Grótta 灯塔（看极光）", q: "Grótta lighthouse", lat: 64.164, lon: -22.022, k: "sight" },
    seltun:     { n: "Seltún 地热区", q: "Seltún, Krýsuvík", lat: 63.896, lon: -22.053, k: "sight" },
    brimketill: { n: "Brimketill 熔岩池", q: "Brimketill", lat: 63.818, lon: -22.665, k: "sight" },
    gunnuhver:  { n: "Gunnuhver 泥池", q: "Gunnuhver", lat: 63.819, lon: -22.685, k: "sight" },
    viti:       { n: "Reykjanesviti 灯塔", q: "Reykjanesviti", lat: 63.816, lon: -22.704, k: "sight" },
    bridge:     { n: "大陆桥", q: "Bridge Between Continents, Reykjanes", lat: 63.868, lon: -22.675, k: "sight" },
    aurora:     { n: "Aurora Hotel（机场）", q: "Aurora Hotel Keflavík Airport", lat: 63.991, lon: -22.617, k: "hotel" }
  },

  // 每天的示意路线（沿主要公路的折点，非精确道路）
  routes: {
    "2026-12-02": [[63.985,-22.605],[64.0,-22.45],[64.06,-22.05],[64.10,-21.85],[64.08,-21.62],[64.00,-21.19],[63.936,-20.999]],
    "2026-12-03": [[63.936,-20.999],[64.08,-21.02],[64.256,-21.129],[64.215,-20.73],[64.233,-20.634],[64.310,-20.302],[64.327,-20.120],[64.310,-20.302],[64.176,-20.447],[64.05,-20.75],[63.936,-20.999]],
    "2026-12-04": [[63.936,-20.999],[63.836,-20.398],[63.753,-20.229],[63.616,-19.989],[63.532,-19.511],[63.530,-19.370],[63.402,-19.130],[63.419,-18.999]],
    "2026-12-05": [[63.419,-18.999],[63.55,-18.45],[63.790,-18.053],[63.86,-17.60],[64.016,-16.966],[64.014,-16.371],[64.048,-16.179],[64.111,-15.951]],
    "2026-12-06": [[63.419,-18.999],[63.404,-19.045],[63.419,-18.999],[63.532,-19.511],[63.753,-20.229],[63.836,-20.398],[63.936,-20.999],[64.00,-21.19],[64.08,-21.62],[64.07,-21.85],[64.116,-21.945],[64.143,-21.896]],
    "2026-12-07": [[64.143,-21.896],[64.142,-21.927],[64.146,-21.935],[64.144,-21.942],[64.150,-21.933],[64.148,-21.922]],
    "2026-12-08": [[64.143,-21.896],[64.07,-21.95],[63.93,-21.98],[63.896,-22.053],[63.84,-22.25],[63.842,-22.433],[63.818,-22.665],[63.816,-22.704],[63.868,-22.675],[63.998,-22.556],[63.996,-22.623]],
    "2026-12-09": [[63.991,-22.617],[63.985,-22.605]]
  },

  days: [
    {
      date: "2026-12-02", wd: "周三", title: "慕尼黑 → KEF → Selfoss",
      lead: "落地时天已经黑了，今天只做三件事：取车、开到 Selfoss、采购并吃晚饭。",
      sleep: "selfoss", drive: "约 1.5 小时（夜路）", sun: "日出约 11:00 · 日落约 15:45",
      items: [
        { t: "10:45", w: "到慕尼黑机场 T1", n: "德国时间，提前 2 小时" },
        { t: "13:00", w: "FI533 起飞", n: "德国时间" },
        { t: "16:00", w: "落地 KEF，入境、取行李", p: "kef" },
        { t: "16:40", w: "到 Blue Car 办公室", n: "18:00 前有接驳车，约 15 分钟一班；步行 3–4 分钟也能到", p: "bluecar" },
        { t: "16:45", w: "取车（到 17:30）", n: "绕车拍视频；确认冬季轮胎、加汽油还是柴油、碎石险和车门险是否包含" },
        { t: "17:30", w: "出发去 Selfoss", n: "约 1.5 小时，全程夜路；要翻 Hellisheiði 山口，出发前看 road.is", p: "selfoss" },
        { t: "19:00", w: "Krónan 超市采购", n: "买 3 天早餐、零食、水，以及 12/5 路上吃的", p: "kronan" },
        { t: "19:45", w: "晚餐：Kaffi Krús", n: "就在 Krónan 旁边，推荐鸭肉披萨；备选 Tommi's Burger Joint（营业到 21:00）", p: "kaffikrus" },
        { t: "20:30", w: "入住 Hotel Selfoss", n: "顺路在有人值守的 N1 买一张预付加油卡", p: "selfoss" },
        { t: "21:00", w: "可选：看极光", n: "累了就睡" }
      ],
      tips: ["Krónan 一般营业到 20:00–21:00，航班延误就先去超市再吃饭。"]
    },
    {
      date: "2026-12-03", wd: "周四", title: "黄金圈环线",
      lead: "天黑出发，天亮时刚好到 Þingvellir，午餐放在最后一个景点之后，天黑前回到 Selfoss。",
      sleep: "selfoss", drive: "约 3.5 小时", sun: "日出约 11:00 · 日落约 15:40",
      items: [
        { t: "08:30", w: "早餐" },
        { t: "09:15", w: "出发去 Þingvellir 国家公园", n: "约 50 分钟，路上天还黑", p: "thingvellir" },
        { t: "10:05", w: "Þingvellir（到 11:15）：从 P1 观景台走下大裂谷 Almannagjá，到 Öxarárfoss 小瀑布", n: "停车 1,000 ISK，当天所有停车场通用；机器或 checkit.is 付", p: "thingvellir" },
        { t: "11:15", w: "出发去 Geysir", n: "约 1 小时" },
        { t: "12:00", w: "可选：Efstidalur II 农场吃冰淇淋（15 分钟）", n: "顺路，隔着玻璃看牛", p: "efstidalur" },
        { t: "12:20", w: "Geysir 地热区，等 Strokkur 喷发（到 13:00）", n: "停车用 Parka 付", p: "geysir" },
        { t: "13:10", w: "Gullfoss 黄金瀑布（到 13:35）", n: "下层步道结冰就别下去", p: "gullfoss" },
        { t: "14:00", w: "午餐：Friðheimar 番茄温室餐厅（到 15:00）", n: "需提前订位；招牌是可续的番茄汤配现烤面包", p: "fridheimar" },
        { t: "15:00", w: "开回 Selfoss", n: "约 45 分钟，15:40 前后天黑", p: "selfoss" },
        { t: "16:00", w: "回酒店休息" },
        { t: "19:00", w: "晚餐：Tryggvaskáli", n: "Selfoss 最老的房子（1890 年）；冬季每天 17:30–22:00，建议订位", p: "tryggva" },
        { t: "21:00", w: "看极光", n: "从 Selfoss 往外开 15 分钟，停进正规停车区" }
      ],
      tips: ["Friðheimar：用地热全年种番茄的农场温室，餐厅就在温室里，坐在番茄藤中间吃饭。午餐 12:00–16:00，要单独订位；没订到可试吧台的简化菜单。"]
    },
    {
      date: "2026-12-04", wd: "周五", title: "Selfoss → 南岸 → Vík",
      lead: "沿 1 号公路往东：两个瀑布、一个冰川、Dyrhólaey 海岬，天黑前到 Vík。晚上早睡，明天 05:30 起。",
      sleep: "kria", drive: "约 2.5 小时", sun: "日出约 10:55 · 日落约 15:30",
      items: [
        { t: "08:30", w: "早餐、退房" },
        { t: "09:30", w: "出发去 Seljalandsfoss", n: "约 1 小时", p: "seljalands" },
        { t: "10:30", w: "Seljalandsfoss + 旁边峡谷里的 Gljúfrabúi（到 11:15）", n: "停车约 800–1,000 ISK；冬天瀑布背后的小路结冰封闭，别翻护栏", p: "seljalands" },
        { t: "11:15", w: "出发去 Skógafoss", n: "约 30 分钟" },
        { t: "11:45", w: "Skógafoss，可走右侧台阶上瀑布顶（到 12:30）", n: "台阶结冰就只在下面看；停车用 Parka", p: "skoga" },
        { t: "12:30", w: "车上吃午饭", n: "用昨天在 Krónan 买的" },
        { t: "12:45", w: "出发去 Sólheimajökull 冰川", n: "约 15 分钟" },
        { t: "13:00", w: "Sólheimajökull：走到冰舌前的观景点（到 14:00）", n: "没有向导不要踩上冰川；要付停车费", p: "solheima" },
        { t: "14:00", w: "出发去 Dyrhólaey", n: "约 25 分钟" },
        { t: "14:30", w: "Dyrhólaey 海岬：拱门海蚀岩 + 黑沙滩全景，赶日落（到 15:30）", n: "停车约 750 ISK（Parka）；上灯塔的小路冬天可能不开", p: "dyrholaey" },
        { t: "15:45", w: "开到 Vík，入住 Hótel Kría", n: "约 20 分钟", p: "kria" },
        { t: "18:00", w: "晚餐：Black Crust Pizzeria", n: "竹炭黑饼底披萨，每天 12:00–21:00", p: "blackcrust" },
        { t: "19:00", w: "N1 加满油，买明天的早餐和路上吃的", n: "明天往返约 400 公里，清晨无人加油站可能刷不了卡", p: "n1vik" },
        { t: "21:00", w: "看一眼极光预报，然后早睡" }
      ],
      tips: ["没排飞机残骸：从停车场要走很长一段，12 月白天太短，要去就得放弃 Dyrhólaey。"]
    },
    {
      date: "2026-12-05", wd: "周六", title: "冰洞日（两位女生进洞，我在冰河湖一带）",
      lead: "冰洞团 09:30–15:30，Hali 集合。我这 6 小时逛冰河湖和钻石沙滩，最后一小时必须补觉。往返都是夜路，只有我开，安全第一。",
      sleep: "kria", drive: "约 6–7 小时（往返约 400 公里）", sun: "日出约 10:45 · 日落约 15:15",
      items: [
        { t: "05:30", w: "起床，带热水和早餐；看 road.is、vedur.is" },
        { t: "06:00", w: "从 Vík 出发（接上朋友）", n: "约 200 公里，冬季按 3 小时算", p: "hali" },
        { t: "07:15", w: "Kirkjubæjarklaustur 停 10 分钟", n: "路上最后一个加油站", p: "klaustur" },
        { t: "09:00", w: "到 Hali 的 Glacier Adventure 营地", n: "看确认邮件里有没有更早的签到时间", p: "hali" },
        { t: "09:30", w: "【女生】冰洞团开始（到 15:30）", n: "约 2 小时在冰川上，其中 40–60 分钟在洞里", p: "hali" },
        { t: "09:30", w: "【我】Þórbergssetur 喝咖啡吃早餐（到 10:15）", n: "全年营业", p: "thorberg" },
        { t: "10:15", w: "【我】开到 Jökulsárlón 冰河湖", n: "13 公里，约 15 分钟；国家公园停车约 1,110 ISK/天", p: "jokuls" },
        { t: "10:30", w: "【我】冰河湖，看日出照在浮冰上（到 11:30）", p: "jokuls" },
        { t: "11:30", w: "【我】过桥到 Diamond Beach 钻石沙滩（到 12:15）", n: "停车约 1,000 ISK（Parka）", p: "diamond" },
        { t: "12:30", w: "【我】Fjallsárlón，更安静的冰河湖（到 13:15）", n: "往西约 10 分钟；停车约 1,000 ISK", p: "fjalls" },
        { t: "13:30", w: "【我】回 Hali 吃午饭（到 14:30）", n: "招牌是自家农场的北极红点鲑和羊肉", p: "thorberg" },
        { t: "14:30", w: "【我】在车里或餐厅补觉（到 15:30）", n: "回程 3 小时全是夜路，这一小时不能省" },
        { t: "15:30", w: "接上两位女生", p: "hali" },
        { t: "15:45", w: "出发回 Vík", n: "约 3 小时，几乎全程天黑" },
        { t: "17:15", w: "Kirkjubæjarklaustur 停 15 分钟，活动一下、喝点热的", n: "困了就在这里多停", p: "klaustur" },
        { t: "18:45", w: "回到 Vík", p: "kria" },
        { t: "19:00", w: "晚餐：Smiðjan Brugghús", n: "汉堡为主，营业到 21:00", p: "smidjan" },
        { t: "21:00", w: "极光只在酒店门口看，不再开车" }
      ],
      tips: [
        "出发前 road.is 显示封路，或 vedur.is 有黄色以上大风预警：先打给 Glacier Adventure 问是否取消，再决定出不出发。",
        "两位女生带：防水外套和裤子、防滑徒步鞋、帽子手套、午餐和热水；以确认邮件为准。"
      ]
    },
    {
      date: "2026-12-06", wd: "周日", title: "黑沙滩 → Sky Lagoon → 雷克雅未克",
      lead: "睡到自然醒。上午黑沙滩，午后开到雷克雅未克一带，在 Sky Lagoon 看海上日落。晚餐要喝酒就把车停酒店，打车去。",
      sleep: "grand", drive: "约 3 小时", sun: "日出约 10:55 · 日落约 15:40",
      items: [
        { t: "09:00", w: "早餐、退房" },
        { t: "10:30", w: "Reynisfjara 黑沙滩（到 11:30）", n: "离 Vík 约 12 分钟；先看入口警示灯", p: "reynis" },
        { t: "11:30", w: "可选：Vík 小教堂拍全景（15 分钟）", n: "停车约 500 ISK（Parka）", p: "vikchurch" },
        { t: "12:00", w: "出发去雷克雅未克方向", n: "全程约 188 公里" },
        { t: "13:30", w: "Selfoss 午餐（到 14:15）", n: "Tommi's Burger Joint 或 Kaffi Krús", p: "kaffikrus" },
        { t: "14:15", w: "开到 Sky Lagoon（Kópavogur）", n: "约 1 小时，翻 Hellisheiði 山口", p: "skylagoon" },
        { t: "15:30", w: "Sky Lagoon：海边无边温泉 + 7 步浴疗（到 18:00）", n: "周日 11:00–22:00；15:40 前后日落", p: "skylagoon" },
        { t: "18:20", w: "入住 Hotel Reykjavík Grand，换衣服", n: "车停酒店", p: "grand" },
        { t: "19:15", w: "打车去餐厅", n: "约 10 分钟" },
        { t: "19:30", w: "晚餐：Sjávargrillið", n: "彩虹街上；周日约 21:30–22:00 打烊，别晚于 19:30 入座", p: "sjavar" },
        { t: "21:30", w: "饭后沿彩虹街走到大教堂前，有极光就在教堂前拍", p: "hallgrims" }
      ],
      tips: [
        "黑沙滩：黄灯时不进黄色区域；红灯时海滩关闭，只在观景台看。离海水至少 30 米，永远不要背对大海拍照。2026 年 2 月玄武岩柱塌了一部分，红灯时岩柱和山洞都不开放。",
        "Sjávargrillið：2010 年冰岛年度大厨开的，明火烤当天捕的鱼、龙虾和冰岛羊肉。备选：Caruso（Austurstræti 22）。"
      ]
    },
    {
      date: "2026-12-07", wd: "周一", title: "雷克雅未克市区",
      lead: "开车到市中心停好，之后全程步行，从大教堂一路走到海边，日落时到太阳航海者。",
      sleep: "grand", drive: "很少", sun: "日出约 11:05 · 日落约 15:40",
      items: [
        { t: "09:30", w: "早餐" },
        { t: "10:30", w: "开到大教堂附近停车", n: "市中心 P1–P4 分区收费，Parka 或路边机器付" },
        { t: "10:45", w: "Hallgrímskirkja 大教堂，坐电梯上塔（到 11:30）", n: "冬季塔楼 10:00–16:45；成人 1,500 ISK，只能现场买", p: "hallgrims" },
        { t: "11:30", w: "沿彩虹街下坡，转 Laugavegur 主街逛店（到 12:30）", n: "纪念品、羊毛衣" },
        { t: "12:30", w: "午餐：Icelandic Street Food", n: "羊肉汤、面包碗汤", p: "isf" },
        { t: "13:30", w: "Bæjarins Beztu Pylsur 热狗摊尝一个", p: "bbp" },
        { t: "13:45", w: "Tjörnin 市中心湖、市政厅（到 14:30）", p: "tjornin" },
        { t: "14:45", w: "Harpa 音乐厅，看玻璃幕墙（到 15:15）", n: "大厅免费", p: "harpa" },
        { t: "15:15", w: "沿海边走到 Sólfar 太阳航海者，看日落（到 15:45）", p: "sunvoyager" },
        { t: "16:00", w: "回酒店休息" },
        { t: "19:00", w: "晚餐：Messinn", n: "装在热铁锅里上桌的鱼，分量大；备选 Caruso", p: "messinn" },
        { t: "21:00", w: "可选：开到 Grótta 灯塔看极光", n: "不喝酒才去", p: "grotta" }
      ],
      tips: []
    },
    {
      date: "2026-12-08", wd: "周二", title: "Reykjanes 半岛 → 17:30 还车",
      lead: "往西南绕半岛一圈，终点就是机场。截至 11 月中旬半岛上没有火山喷发，蓝湖和 Grindavík 开放；但地下岩浆还在积累，几条路可能临时封闭，早上先看 road.is 和 vedur.is。",
      sleep: "aurora", drive: "约 2.5 小时", sun: "日出约 11:05 · 日落约 15:40",
      items: [
        { t: "09:00", w: "早餐" },
        { t: "10:00", w: "退房，出发去 Seltún 地热区", n: "约 40 分钟，途经 Kleifarvatn 湖", p: "seltun" },
        { t: "10:45", w: "Seltún：木栈道上看冒烟的彩色泥池（到 11:30）", n: "停车约 750 ISK（Parka）", p: "seltun" },
        { t: "11:30", w: "沿 427 号海岸公路往西", n: "喷发期间封过；封了就绕回 41 号公路" },
        { t: "12:15", w: "Brimketill 海边熔岩池", p: "brimketill" },
        { t: "12:45", w: "Gunnuhver 泥池和蒸汽区", n: "站在木栈道上", p: "gunnuhver" },
        { t: "13:15", w: "Reykjanesviti 灯塔和 Valahnúkur 海崖", n: "大风天离崖边远一点", p: "viti" },
        { t: "14:00", w: "大陆桥（欧亚板块和北美板块之间）", n: "附近出现过地面塌陷，只走标记好的步道", p: "bridge" },
        { t: "14:45", w: "到 Reykjanesbær 吃午饭" },
        { t: "16:30", w: "加油到取车时的油量；车太脏就在加油站自助冲一下" },
        { t: "17:00", w: "先把行李和两位女生送到 Aurora Hotel", p: "aurora" },
        { t: "17:30", w: "我一个人去 Blue Car 还车", n: "18:00 前有接驳车，步行也只要 3–4 分钟", p: "bluecar" },
        { t: "18:30", w: "酒店晚餐，整理行李，早睡", p: "aurora" }
      ],
      tips: ["半岛封路或天气太差：留在雷克雅未克逛 Perlan 或补买东西，16:30 出发去机场，约 45 分钟。"]
    },
    {
      date: "2026-12-09", wd: "周三", title: "FI532 直飞慕尼黑",
      lead: "早起，走路去航站楼。",
      sleep: null, drive: "0", sun: "",
      items: [
        { t: "04:45", w: "起床" },
        { t: "05:15", w: "从 Aurora Hotel 走到航站楼", p: "kef" },
        { t: "05:20", w: "值机、托运、安检（提前 2 小时）", p: "kef" },
        { t: "07:20", w: "FI532 起飞" },
        { t: "12:05", w: "到慕尼黑", n: "德国时间" }
      ],
      tips: []
    }
  ],

  bookings: [
    { id: "b1", t: "12/3 Friðheimar 午餐 14:00" },
    { id: "b2", t: "12/3 晚餐 Tryggvaskáli 19:00" },
    { id: "b3", t: "12/6 Sky Lagoon 15:30 入场" },
    { id: "b4", t: "12/6 晚餐 Sjávargrillið 19:30" },
    { id: "b5", t: "Blue Car 在线 check-in（取车前 24 小时以上）" }
  ],

  before: [
    { id: "p1", t: "Google 地图下载离线地图：KEF→雷克雅未克→黄金圈→南岸→Hali 整条线" },
    { id: "p2", t: "装 Parka 停车 App 并绑卡" },
    { id: "p3", t: "电话问发卡行：海外 4 位 PIN 怎么输" },
    { id: "p4", t: "带好：中国驾照 + 翻译件、护照、实体信用卡" },
    { id: "p5", t: "装 112 Iceland App（紧急求助）" },
    { id: "p6", t: "收藏 road.is、vedur.is 极光预报页、safetravel.is" },
    { id: "p7", t: "这个 App 断网打开一次，确认能离线使用" }
  ],

  packing: [
    { id: "k1", t: "防水外套 + 防水裤" },
    { id: "k2", t: "保暖中间层（抓绒/羽绒）、保暖内衣" },
    { id: "k3", t: "防滑徒步鞋、厚袜子" },
    { id: "k4", t: "帽子、手套、围巾" },
    { id: "k5", t: "泳衣（Sky Lagoon）" },
    { id: "k6", t: "车载手机支架、车充、充电宝" },
    { id: "k7", t: "头灯或手电（天黑时间长）" },
    { id: "k8", t: "保温杯" },
    { id: "k9", t: "手机三脚架（拍极光）" }
  ],

  daily: [
    "road.is：路况和封路",
    "vedur.is：风力预警，黄色以上重新考虑路线",
    "油箱低于一半就加，尽量在有人值守的站",
    "今天的停车场准备好 Parka"
  ]
};
