/* ==================================================
   game.js —— 游戏逻辑：让数据"动起来"
   阅读顺序：工具函数 → 状态 → 五个屏幕的流程函数
   ================================================== */

/* ---------- 0. 工具函数 ---------- */
const $ = s => document.querySelector(s);          // $('按钮id') = 找到一个元素
const $$ = s => [...document.querySelectorAll(s)]; // $$('xx') = 找到一群元素，转成数组
const rnd = n => Math.floor(Math.random() * n);    // rnd(5) = 0~4 的随机整数
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)); // 把 v 夹在 a~b 之间

/* ---------- 1. 游戏状态（一世的全部数据都在这里） ---------- */
let st = null;     // 当前一世
let timer = null;  // 自动播放的计时器

function freshState() {
  return {
    talents: [],                                  // 选中的天赋 id 数组
    alloc: { FACE: 0, INT: 0, BODY: 0, HOME: 0 }, // 玩家手动分配的点数
    attrs: { FACE: 5, INT: 5, BODY: 5, HOME: 5, JOY: 5 }, // 最终属性
    age: -1,       // 还没出生，nextYear() 会把它变成 0
    alive: true,
    paused: false,
    flags: {},     // 旗标：记录"已经上过班"这类一次性的事
  };
}

/* ---------- 2. 屏幕切换：给目标屏幕加 .active，其他全部去掉 ---------- */
function show(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
}

/* ---------- 3. 封面：显示累计转世次数 ---------- */
function renderStart() {
  $('#stat-runs').textContent = localStorage.getItem('lr_runs') || 0;
  $('#stat-last').textContent = localStorage.getItem('lr_last') || '——';
}

/* ---------- 4. 抽天赋：抽十张，选三张 ---------- */
function startTalentPhase() {
  st = freshState();  // 每次重开，重置状态

  const grid = $('#tgrid');
  grid.innerHTML = '';  // 清空旧的签卡
  drawTen().forEach(t => {
    const fx = Object.entries(t.fx)
      .map(([k, v]) => `${STAT_NAME[k]}${v > 0 ? '+' : ''}${v}`)
      .join(' ');
    const card = document.createElement('div');   // 动态创建一张签卡
    card.className = 'tcard';
    card.innerHTML = `<div class="tname">${t.n}</div><div class="tfx">${fx}</div>`;
    card.onclick = () => togglePick(card);        // 点一下 = 选中/取消
    grid.appendChild(card);
  });

  $('#btn-confirm-talent').disabled = true;       // 选满三张才能点
  $('#pick-n').textContent = 0;
  show('screen-talent');
}

/* 按稀有度抽十张不重复的天赋 */
function drawTen() {
  const picks = [];
  while (picks.length < 10) {
    const roll = Math.random();                   // 掷骰子决定稀有度
    const g = roll < 0.7 ? 0 : roll < 0.94 ? 1 : 2; // 70%凡 24%稀 6%传
    let pool = TALENTS.filter(t => t.g === g && !picks.includes(t));
    if (!pool.length) pool = TALENTS.filter(t => !picks.includes(t)); // 兜底
    picks.push(pool[rnd(pool.length)]);
  }
  return picks;
}

/* 选中/取消一张签；最多同时选三张 */
function togglePick(card) {
  const sel = $$('.tcard.sel');
  if (card.classList.contains('sel')) {
    card.classList.remove('sel');
  } else if (sel.length < 3) {
    card.classList.add('sel');
  } else {
    return;  // 已经选满三张，忽略这次点击
  }
  $('#pick-n').textContent = $$('.tcard.sel').length;
  $('#btn-confirm-talent').disabled = $$('.tcard.sel').length !== 3;
}

/* ---------- 5. 分配属性：四行加减号 ---------- */
const ALLOC_KEYS = ['FACE', 'INT', 'BODY', 'HOME'];

function startAllocPhase() {
  st.talents = $$('.tcard.sel').map(c => c.querySelector('.tname').textContent);
  // ↑ 这里存的是名字不是 id，迷你版够用；完整版建议存 id（见 index.html 的做法）

  const list = $('#alloc-list');
  list.innerHTML = '';
  ALLOC_KEYS.forEach(k => {
    const row = document.createElement('div');
    row.className = 'alloc-row';
    row.innerHTML = `
      <div class="alloc-name">${STAT_NAME[k]}</div>
      <div class="stepper">
        <button data-k="${k}" data-d="-1">−</button>
        <div class="alloc-val" id="v-${k}">0</div>
        <button data-k="${k}" data-d="1">＋</button>
      </div>`;
    list.appendChild(row);
  });
  // 给所有 +/− 按钮绑定点击事件（事件委托的简化版）
  $$('#alloc-list button').forEach(b =>
    b.onclick = () => stepAlloc(b.dataset.k, +b.dataset.d));

  renderAlloc();
  show('screen-alloc');
}

function stepAlloc(k, d) {
  const total = ALLOC_KEYS.reduce((s, key) => s + st.alloc[key], 0); // 已用点数
  const next = st.alloc[k] + d;
  if (next < 0 || next > 10) return;   // 单项上限 10，下限 0
  if (d > 0 && total >= 20) return;    // 总点数只有 20
  st.alloc[k] = next;
  renderAlloc();
}

function renderAlloc() {
  ALLOC_KEYS.forEach(k => $('#v-' + k).textContent = st.alloc[k]);
  const used = ALLOC_KEYS.reduce((s, k) => s + st.alloc[k], 0);
  $('#remain').textContent = 20 - used;
}

/* ---------- 6. 投胎：属性 = 手动分配 + 天赋加成 ---------- */
function beginLife() {
  /* 先把所有天赋的加成累加到一个对象里。
     【注意】不能一边遍历一边直接写进 st.attrs——
     如果两个天赋都加智力，后者会把前者的结果"覆盖"掉而不是"叠加"。
     这是新手最常见的 bug 之一。 */
  const bonus = { FACE: 0, INT: 0, BODY: 0, HOME: 0, JOY: 0 };
  st.talents.forEach(name => {
    const t = TALENTS.find(x => x.n === name);  // 按名字找回天赋
    Object.entries(t.fx).forEach(([k, v]) => bonus[k] += v);
  });

  ALLOC_KEYS.forEach(k => st.attrs[k] = clamp(st.alloc[k] + bonus[k], 0, 12));
  st.attrs.JOY = clamp(5 + bonus.JOY, 0, 10);   // 快乐的基础值是 5

  $('#timeline').innerHTML = '';
  st.age = -1;
  show('screen-life');
  nextYear();               // 先播"出生"
  timer = setInterval(nextYear, 1000);  // 之后每秒长一岁
}

/* ---------- 7. 每年发生了什么（游戏的心脏） ---------- */
function nextYear() {
  if (!st.alive) return;
  st.age++;

  /* 第一步：从事件表里挑一条 */
  const cands = EVENTS.filter(e =>
    st.age >= e.min && st.age <= e.max &&        // 年龄合适
    !(e.once && st.flags['used_' + e.id]) &&     // once 事件只发生一次
    (!e.cond || e.cond(st))                      // 满足特殊条件
  );
  const ev = cands.length ? cands[rnd(cands.length)]
                          : { txt: '这一年平平无奇，日子如流水般过去。' };
  if (ev.once) st.flags['used_' + ev.id] = true; // 标记已发生
  if (ev.set) st.flags[ev.set] = true;           // 设置旗标（比如"已上班"）

  /* 第二步：结算属性变化 */
  const fxText = [];
  if (ev.fx) Object.entries(ev.fx).forEach(([k, v]) => {
    st.attrs[k] = clamp(st.attrs[k] + v, 0, k === 'JOY' ? 10 : 12);
    fxText.push(`${STAT_NAME[k]}${v > 0 ? '+' : ''}${v}`);
  });

  /* 第三步：写进生死簿 */
  addTimelineItem(st.age, ev.txt, fxText.join('　'), false);
  updateHud();

  /* 第四步：检查是否死亡 */
  checkDeath();
}

function addTimelineItem(age, txt, fx, death) {
  const box = $('#timeline');
  const item = document.createElement('div');
  item.className = 'tl-item' + (death ? ' tl-death' : '');
  item.innerHTML = `
    <div class="tl-age">${death ? '· 卒 ·' : age + ' 岁'}</div>
    <div class="tl-text">${txt}</div>
    ${fx ? `<div class="tl-fx"><span>${fx}</span></div>` : ''}`;
  box.appendChild(item);
  box.scrollTop = box.scrollHeight;  // 自动滚到最下面
}

function updateHud() {
  $('#hud-age').textContent = st.age;
  ['FACE', 'INT', 'BODY', 'HOME', 'JOY'].forEach(k =>
    $('#s-' + k).textContent = st.attrs[k]);
}

/* ---------- 8. 死亡判定 ---------- */
function checkDeath() {
  let cause = null;
  if (st.attrs.BODY <= 0) {  // 体质耗尽 → 按年龄给死因
    cause = st.age < 6 ? '先天不足' : st.age < 40 ? '积劳成疾' : '寿终正寝';
  } else if (st.attrs.JOY <= 0 && Math.random() < 0.3) {
    cause = '郁郁而终';      // 快乐归零，三成概率想不开
  } else if (st.age >= 65) { // 65 岁后，年龄越大越危险
    const p = 0.03 + (st.age - 65) * 0.015 - st.attrs.BODY * 0.004;
    if (Math.random() < Math.max(0, p)) cause = '寿终正寝';
  }
  if (st.age >= 100) cause = '寿终正寝';  // 活过一百岁，天命所归

  if (!cause) return false;  // 还没死，继续

  st.alive = false;
  st.deathCause = cause;     // 把死因存进状态，结局页要用
  clearInterval(timer);      // 停止自动播放
  addTimelineItem(st.age, DEATH_LINES[cause], '', true);
  setTimeout(showEnd, 1500); // 1.5 秒后进结局页
  return true;
}

/* ---------- 9. 结算：算评级、存档、展示 ---------- */
function showEnd() {
  const a = st.attrs;
  const score = a.FACE + a.INT + a.BODY + a.HOME + a.JOY + Math.floor(st.age / 4);
  const grade = GRADES.find(x => score >= x.min);  // 从高到低找第一个达标的

  $('#end-cause').textContent = st.deathCause;
  $('#end-age').textContent = st.age;
  $('#grade-seal').textContent = grade.g;
  $('#end-quote').textContent = grade.t;

  localStorage.setItem('lr_runs', (+localStorage.getItem('lr_runs') || 0) + 1);
  localStorage.setItem('lr_last', `享年${st.age}岁 · ${grade.g}级`);
  show('screen-end');
}

/* ---------- 10. 绑定按钮 ---------- */
$('#btn-start').onclick = startTalentPhase;
$('#btn-confirm-talent').onclick = startAllocPhase;
$('#btn-born').onclick = beginLife;
$('#btn-again').onclick = startTalentPhase;   // 再入轮回 = 重新抽签
$('#btn-pause').onclick = () => {
  st.paused = !st.paused;
  if (st.paused) {
    clearInterval(timer);                 // 暂停：干掉计时器
    $('#btn-pause').textContent = '继 续';
  } else {
    timer = setInterval(nextYear, 1000);  // 继续：重新启动
    $('#btn-pause').textContent = '暂 停';
  }
};

renderStart();  // 页面打开时先渲染封面
