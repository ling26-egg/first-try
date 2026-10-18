/* ==================================================
   game.js —— 多元宇宙版引擎
   阅读地图：
   0 工具函数 → 1 状态 → 2 世界与天赋 → 3 分配 → 4 人生主循环
   → 5 选择系统 → 6 奇异天赋钩子 → 7 死亡/特殊结局 → 8 结算
   ================================================== */

/* ---------- 0. 工具函数 ---------- */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const rnd = n => Math.floor(Math.random() * n);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const has = id => st && st.strange.some(s => s.id === id);
const stName = k => { const s = st.world.stats.find(x => x.key === k); return s ? s.name : k; };

/* 按 w 权重随机抽一个（w 越大越容易被抽中） */
function weighted(list) {
  const t = list.reduce((s, e) => s + (e.w || 1), 0);
  let r = Math.random() * t;
  for (const e of list) { r -= (e.w || 1); if (r < 0) return e; }
  return list[list.length - 1];
}

/* ---------- 1. 游戏状态 ---------- */
let st = null, timer = null, choosing = false;

function freshState(w) {
  return {
    world: w,                     // 本世所在的世界对象
    talents: [],                  // 玩家自选的 3 个天赋 id
    strange: [],                  // 系统附加的奇异天赋
    alloc: {},                    // 手动分配的点数
    attrs: {},                    // 最终属性（键由世界定义）
    age: -1, alive: true, paused: false,
    flags: {},                    // 一次性事件/旗标
    mems: 0,                      // 记忆叠印触发次数
    badges: [],                   // 勋记（试炼奖励）
    cicadaUsed: false,            // 春秋蝉是否已用过
    phantomSaved: false,          // 残影是否已救援过
  };
}

function show(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
}

function renderStart() {
  $('#stat-runs').textContent = localStorage.getItem('lr_runs') || 0;
  $('#stat-last').textContent = localStorage.getItem('lr_last') || '——';
}

/* ---------- 2. 世界与天赋 ---------- */
function rollWorld() {
  const t = WORLDS.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * t;
  for (const w of WORLDS) { r -= w.weight; if (r < 0) return w; }
  return WORLDS[0];
}

function startRun() {   // 踏入轮回 / 再入轮回
  const w = rollWorld();
  st = freshState(w);
  document.documentElement.style.setProperty('--accent', w.color);  // 换世界主题色
  $('#world-name').textContent = w.name;
  $('#world-rate').textContent = w.rate;
  $('#world-desc').textContent = w.desc;
  $('#strange-box').style.display = 'none';
  show('screen-world');
}

function startTalentPhase() {
  $('#talent-world').textContent = st.world.name + ' · 十签取三';
  const grid = $('#tgrid');
  grid.innerHTML = '';
  drawTen().forEach(t => {
    const fx = Object.entries(t.fx).map(([k, v]) => stName(k) + (v > 0 ? '+' : '') + v).join(' ');
    const card = document.createElement('div');
    card.className = 'tcard' + (t.g === 1 ? ' g1' : t.g === 2 ? ' g2' : '');
    card.dataset.id = t.id;
    card.innerHTML = `<div class="tname">${t.n}<span class="ttag">${t.g === 2 ? '传签' : t.g === 1 ? '稀签' : '凡签'}</span></div>
      <div class="tfx">${fx}${t.d ? '<br>' + t.d : ''}</div>`;
    card.onclick = () => togglePick(card);
    grid.appendChild(card);
  });
  $('#btn-confirm-talent').disabled = true;
  $('#pick-n').textContent = 0;
  show('screen-talent');
}

function drawTen() {   // 按稀有度抽十张不重复的天赋
  const pool = st.world.talents, picks = [];
  while (picks.length < 10 && picks.length < pool.length) {
    const roll = Math.random();
    const g = roll < 0.7 ? 0 : roll < 0.94 ? 1 : 2;   // 70%凡 24%稀 6%传
    let sub = pool.filter(t => t.g === g && !picks.includes(t));
    if (!sub.length) sub = pool.filter(t => !picks.includes(t));
    picks.push(sub[rnd(sub.length)]);
  }
  return picks;
}

function togglePick(card) {
  const sel = $$('.tcard.sel');
  if (card.classList.contains('sel')) card.classList.remove('sel');
  else if (sel.length < 3) card.classList.add('sel');
  else return;
  const n = $$('.tcard.sel').length;
  $('#pick-n').textContent = n;
  $('#btn-confirm-talent').disabled = n !== 3;
}

function confirmTalent() {
  st.talents = $$('.tcard.sel').map(c => c.dataset.id);
  grantStrange();      // 系统附加奇异天赋（不消耗选择次数）
  startAllocPhase();
}

/* 系统附加奇异天赋：1个60% / 2个30% / 3个10% */
function grantStrange() {
  const r = Math.random();
  const n = r < 0.6 ? 1 : r < 0.9 ? 2 : 3;
  st.strange = [...STRANGE].sort(() => Math.random() - 0.5).slice(0, n);
  const box = $('#strange-box');
  box.style.display = 'block';
  box.innerHTML = `<h4>轮回管理局 · 机密档案：系统附加奇异天赋 ×${n}</h4>` +
    st.strange.map(s => `<div class="strange-item"><b>【${s.n}】</b><p>${s.d}</p></div>`).join('');
}

/* ---------- 3. 分配属性（25 点，前四项可分配，精神项固定 5） ---------- */
function startAllocPhase() {
  st.alloc = {};
  st.world.stats.slice(0, 4).forEach(s => st.alloc[s.key] = 0);
  const list = $('#alloc-list');
  list.innerHTML = '';
  st.world.stats.slice(0, 4).forEach(s => {
    const row = document.createElement('div');
    row.className = 'alloc-row';
    row.innerHTML = `<div class="alloc-name">${s.name}</div>
      <div class="stepper"><button data-k="${s.key}" data-d="-1">−</button>
      <div class="alloc-val" id="v-${s.key}">0</div>
      <button data-k="${s.key}" data-d="1">＋</button></div>`;
    list.appendChild(row);
  });
  $$('#alloc-list button').forEach(b => b.onclick = () => stepAlloc(b.dataset.k, +b.dataset.d));
  renderAlloc();
  show('screen-alloc');
}

function stepAlloc(k, d) {
  const used = Object.values(st.alloc).reduce((a, b) => a + b, 0);
  const next = st.alloc[k] + d;
  if (next < 0 || next > 10) return;    // 单项 0~10
  if (d > 0 && used >= 25) return;      // 总共 25 点
  st.alloc[k] = next;
  renderAlloc();
}

function renderAlloc() {
  st.world.stats.slice(0, 4).forEach(s => $('#v-' + s.key).textContent = st.alloc[s.key]);
  const used = Object.values(st.alloc).reduce((a, b) => a + b, 0);
  $('#remain').textContent = 25 - used;
}

function beginLife() {
  const w = st.world;
  const bonus = {};                      // 天赋加成先累加，防止覆盖
  w.stats.forEach(s => bonus[s.key] = 0);
  st.talents.forEach(id => {
    const t = w.talents.find(x => x.id === id);
    if (!t) return;
    Object.entries(t.fx).forEach(([k, v]) => bonus[k] += v);
    if (t.flag) st.flags[t.flag] = true; // 特殊天赋给旗标（如春秋蝉）
  });
  w.stats.forEach(s => st.attrs[s.key] = 5);
  w.stats.slice(0, 4).forEach(s => st.attrs[s.key] = clamp(st.alloc[s.key] + bonus[s.key], 0, 12));
  st.attrs[w.mood] = clamp(5 + bonus[w.mood], 0, 10);

  /* 按世界动态生成属性面板 */
  $('#hud-world').textContent = w.name;
  $('#hud-stats').innerHTML = w.stats.map(s =>
    `<div class="hstat${s.key === w.mood ? ' joy' : ''}"><small>${s.name}</small><b id="s-${s.key}">5</b></div>`).join('');
  $('#timeline').innerHTML = '';
  st.age = -1;
  show('screen-life');
  syncTimer();
  nextYear();
}

/* ---------- 4. 人生主循环（每年一次） ---------- */
function nextYear() {
  if (!st || !st.alive || choosing) return;
  st.age++;
  const w = st.world;
  const match = e => st.age >= e.min && st.age <= e.max
    && !(e.once && st.flags['used_' + e.id]) && (!e.cond || e.cond(st));

  /* 候选 = 本世界事件 + 已激活奇异天赋的试炼 */
  const trials = TRIALS.filter(t => has(t.talent) && match(t));
  const cands = w.events.filter(match).concat(trials);
  if (!cands.length) {
    addTimelineItem(st.age, '这一年平平无奇，日子如流水般过去。', '');
    updateHud(); checkDeath(); return;
  }
  const ev = weighted(cands);
  if (ev.once) st.flags['used_' + ev.id] = true;
  if (ev.flag) st.flags[ev.flag] = true;

  /* 命数倒置钩子：大凶化吉 / 平中生变 */
  if (has('invert') && !ev.opts) {
    if (ev.tag === 'crisis' && Math.random() < (st.flags.inv_boost ? 0.9 : 0.7)) {
      const k = w.stats[rnd(4)].key;
      applyOne(k, 1);
      addTimelineItem(st.age, '【命数倒置】大凶之兆竟化作机缘——' + ev.txt, stName(k) + ' +1');
      updateHud(); checkDeath(); return;
    }
    if (ev.tag === 'calm' && Math.random() < 0.12) {
      addTimelineItem(st.age, '【命数倒置】风平浪静中，意外陡生——' + ev.txt, '');
      applyOne(w.vital, -2);
      updateHud(); checkDeath(); return;
    }
  }

  if (ev.opts) { openChoice(ev); return; }   // 有选项 → 交给选择系统

  const fxText = applyFx(ev.fx, ev).join('　');
  addTimelineItem(st.age, ev.txt, fxText);
  updateHud();
  checkDeath();
}

/* ---------- 5. 选择系统：暂停时间线，等玩家抉择 ---------- */
function openChoice(ev) {
  choosing = true;
  clearInterval(timer);
  addTimelineItem(st.age, ev.txt, '');
  const panel = $('#choice-panel');
  const opts = [...ev.opts];

  /* 记忆叠印钩子：35% 概率闪回提示，代价是精神 */
  if (has('memory') && Math.random() < 0.35) {
    st.mems++;
    applyOne(st.world.mood, -1);
    if (st.mems >= 4 && Math.random() < 0.3) {
      applyOne(st.world.mood, -1);
      addTimelineItem(st.age, '【记忆叠印】幻视显现：你看见墙上爬满了前世的名字。', '');
    }
    const k = st.world.stats[rnd(4)].key;
    opts.push({ t: '【记忆闪回】循着前世的本能走这条路', mem: true, fx: { [k]: 1 },
      res: '前世的记忆如潮水掠过——你依稀知道自己该怎么选。' });
  }
  /* 轮回残影钩子：30% 概率出现诱惑选项 */
  if (has('phantom') && st.age >= 10 && Math.random() < 0.3) {
    opts.push({ t: '【残影低语】"跟我来……"（抄一条近路）', lure: true, danger: 0.25,
      fx: { MONEY: 2, MOOD: -1 }, res: '你跟着虚影抄了条近路。' });
  }

  panel.innerHTML = '<div class="choice-title">—— 请 抉 择 ——</div>';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'opt-btn' + (o.lure ? ' lure' : '') + (o.mem ? ' mem' : '');
    b.textContent = o.t;
    if (o.need && !canPick(o.need)) { b.disabled = true; b.textContent += '（条件不足）'; }
    b.onclick = () => pickOpt(o);
    panel.appendChild(b);
  });
  panel.classList.add('show');
  updateHud();
}

function canPick(nd) {
  let k = nd.k;
  if (k === 'VITAL') k = st.world.vital;
  if (k === 'MOOD') k = st.world.mood;
  if (k === 'MONEY') k = st.world.money;
  return (st.attrs[k] || 0) >= nd.v;
}

function pickOpt(o) {
  const panel = $('#choice-panel');
  panel.classList.remove('show');
  panel.innerHTML = '';
  choosing = false;
  let fxText = applyFx(o.fx, null).join('　');
  if (o.danger && Math.random() < o.danger) {
    applyOne(st.world.vital, -4);
    fxText = (fxText ? fxText + '　' : '') + '意外灾祸降临在你身上！';
  }
  if (o.flag) st.flags[o.flag] = true;
  if (o.badge && !st.badges.includes(o.badge)) {
    st.badges.push(o.badge);
    addTimelineItem(st.age, '· 勋记达成 ·【' + o.badge + '】', '', 'tl-badge');
  }
  addTimelineItem(st.age, o.res, fxText);
  updateHud();
  syncTimer();
}

/* ---------- 6. 属性结算工具 ---------- */
function applyOne(k, v) {   // 改一个属性（自动把符号键翻译成本世界属性）
  if (k === 'MOOD') k = st.world.mood;
  if (k === 'VITAL') k = st.world.vital;
  if (k === 'MONEY') k = st.world.money;
  const cap = k === st.world.mood ? 10 : 12;
  st.attrs[k] = clamp((st.attrs[k] || 0) + v, 0, cap);
}

function applyFx(fx, ev) {  // 结算一组属性变化，返回用于展示的文本
  if (!fx) return [];
  const out = [];
  Object.entries(fx).forEach(([k0, v0]) => {
    let k = k0, v = v0;
    if (k === 'RAND') k = st.world.stats[rnd(4)].key;   // 随机属性（试炼奖励用）
    if (k === 'MOOD') k = st.world.mood;
    if (k === 'VITAL') k = st.world.vital;
    if (k === 'MONEY') k = st.world.money;
    /* 血肉共鸣钩子：凶险事件 50% 伤害减半 / 25% 休克 */
    if (ev && ev.tag === 'crisis' && v < 0 && has('empath')) {
      const r = Math.random();
      if (r < 0.5) v = Math.ceil(v / 2);
      else if (r < 0.75) { applyOne(st.world.vital, -2); out.push('共鸣反噬：剧痛同步传导，你险些休克'); }
    }
    applyOne(k, v);
    out.push(stName(k) + ' ' + (v > 0 ? '+' : '') + v);
  });
  return out;
}

function addTimelineItem(age, txt, fx, cls) {
  const box = $('#timeline');
  const item = document.createElement('div');
  item.className = 'tl-item' + (cls ? ' ' + cls : '');
  item.innerHTML = `<div class="tl-age">${cls === 'tl-death' ? '· 终 ·' : age + ' 岁'}</div>
    <div class="tl-text">${txt}</div>${fx ? `<div class="tl-fx"><span>${fx}</span></div>` : ''}`;
  box.appendChild(item);
  box.scrollTop = box.scrollHeight;
}

function updateHud() {
  $('#hud-age').textContent = st.age;
  st.world.stats.forEach(s => $('#s-' + s.key).textContent = st.attrs[s.key]);
}

/* ---------- 7. 死亡与特殊结局 ---------- */
function checkEndings() {   // 特殊结局：条件达成即触发，覆盖普通评级
  if (!st.alive || st.age < 16) return false;
  for (const e of st.world.endings) {
    if (e.check(st)) {
      st.alive = false;
      st.deathCause = e.name;
      st.deathQuote = e.desc;
      st.endGrade = e.grade;
      clearInterval(timer);
      addTimelineItem(st.age, '【' + e.name + '】' + e.desc, '', 'tl-death');
      setTimeout(showEnd, 1600);
      return true;
    }
  }
  return false;
}

function checkDeath() {
  if (!st.alive) return true;
  if (checkEndings()) return true;
  const w = st.world;
  let cause = null;
  if (st.attrs[w.vital] <= 0) {
    cause = st.age < 6 ? '先天不足' : w.deaths.weak;
  } else if (st.attrs[w.mood] <= 0 && Math.random() < 0.3) {
    cause = '心灰意冷';
  } else if (st.age >= 65) {
    const p = Math.max(0, 0.03 + (st.age - 65) * 0.015 - st.attrs[w.vital] * 0.004);
    if (Math.random() < p) cause = w.deaths.natural;
  }
  if (st.age >= 100) cause = w.deaths.natural;
  if (!cause) return false;

  /* 轮回残影钩子：45% 概率救你一次（一生一次） */
  if (has('phantom') && !st.phantomSaved && Math.random() < 0.45) {
    st.phantomSaved = true;
    applyOne(w.mood, -1);
    updateHud();
    addTimelineItem(st.age, '【轮回残影】一只虚影拽住了下坠的你："还不到时候。"', '');
    return false;
  }
  /* 春秋蝉钩子：死亡时借蝉重生一次，回到 24 岁 */
  if (st.flags.cicada && !st.cicadaUsed) {
    st.cicadaUsed = true;
    st.age = 24;
    [w.vital, w.mood].forEach(k => st.attrs[k] = 6);
    updateHud();
    addTimelineItem(24, '【春秋蝉】蝉鸣刺穿轮回——你睁眼时，已回到了自己的年轻时代。', '');
    return false;
  }

  st.alive = false;
  st.deathCause = cause;
  st.deathQuote = cause === '先天不足' ? '你还没来得及看清这个世界，就匆匆离开了。'
    : cause === '心灰意冷' ? '这一世的心太累了，你选择提前谢幕。'
    : cause + '，此生终了。';
  clearInterval(timer);
  addTimelineItem(st.age, '【卒】' + st.deathQuote, '', 'tl-death');
  setTimeout(showEnd, 1600);
  return true;
}

/* ---------- 8. 结算 ---------- */
function showEnd() {
  const w = st.world;
  let grade, quote;
  if (st.endGrade) {                    // 特殊结局直接给评级
    grade = st.endGrade;
    quote = st.deathQuote;
  } else {
    const score = w.stats.reduce((s, x) => s + st.attrs[x.key], 0)
      + Math.floor(st.age / 4) + st.badges.length * 3;   // 勋记每个 +3 分
    const g = GRADES.find(x => score >= x.min);
    grade = g.g; quote = g.t;
  }
  $('#end-cause').textContent = st.deathCause;
  $('#end-age').textContent = st.age;
  $('#grade-seal').textContent = grade;
  $('#end-quote').textContent = quote;
  $('#badge-chips').innerHTML = st.badges.map(b => `<span>${b}</span>`).join('');
  localStorage.setItem('lr_runs', (+localStorage.getItem('lr_runs') || 0) + 1);
  localStorage.setItem('lr_last', w.name + '·享年' + st.age + '岁·' + grade + '级');
  show('screen-end');
}

/* ---------- 9. 暂停与按钮 ---------- */
function syncTimer() {
  clearInterval(timer);
  if (st && st.alive && !st.paused && !choosing) timer = setInterval(nextYear, 1000);
}

$('#btn-start').onclick = startRun;
$('#btn-world-go').onclick = startTalentPhase;
$('#btn-confirm-talent').onclick = confirmTalent;
$('#btn-born').onclick = beginLife;
$('#btn-again').onclick = startRun;
$('#btn-home').onclick = () => { renderStart(); show('screen-start'); };
$('#btn-pause').onclick = () => {
  if (!st || !st.alive) return;
  st.paused = !st.paused;
  $('#btn-pause').textContent = st.paused ? '继 续' : '暂 停';
  syncTimer();
};

renderStart();
