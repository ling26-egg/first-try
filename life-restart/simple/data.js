/* ==================================================
   data.js —— 游戏的"灵魂"：天赋表 + 事件表
   本文件没有任何逻辑，只有数据。
   想给游戏加内容？改这个文件就够了！
   ================================================== */

/* 属性 key 的中文名（key 是程序用的代号，name 是给人看的） */
const STAT_NAME = {
  FACE: '颜值',
  INT:  '智力',
  BODY: '体质',
  HOME: '家境',
  JOY:  '快乐',
};

/* ---------- 天赋表 ----------
   g  : 稀有度。0=凡签  1=稀签  2=传签
   fx : 对属性的影响（effect 的缩写）
   抽签时：70% 抽到凡签，24% 稀签，6% 传签 */
const TALENTS = [
  { id: 'study',  n: '好学',     g: 0, fx: { INT: 1 } },
  { id: 'strong', n: '强壮',     g: 0, fx: { BODY: 1 } },
  { id: 'cute',   n: '娃娃脸',   g: 0, fx: { FACE: 1 } },
  { id: 'well',   n: '小康之家', g: 0, fx: { HOME: 1 } },
  { id: 'optim',  n: '乐天派',   g: 0, fx: { JOY: 2 } },
  { id: 'scholar',n: '书香门第', g: 0, fx: { INT: 2, HOME: -1 } },
  { id: 'sick',   n: '体质孱弱', g: 0, fx: { BODY: -2, INT: 1 } },
  { id: 'only',   n: '独生子女', g: 0, fx: { HOME: 1, JOY: 1 } },
  { id: 'pretty', n: '天生丽质', g: 1, fx: { FACE: 3 } },
  { id: 'iron',   n: '钢筋铁骨', g: 1, fx: { BODY: 3 } },
  { id: 'demo',   n: '拆迁户',   g: 1, fx: { HOME: 3 } },
  { id: 'chosen', n: '天命之子', g: 2, fx: { FACE: 1, INT: 1, BODY: 1, JOY: 1 } },
];

/* ---------- 事件表 ----------
   每一条 = 人生中的"一年"。
   min/max : 触发年龄区间（岁）
   w       : 权重，越大越容易被抽中
   txt     : 显示的文案
   fx      : 属性变化（可省略）
   once    : true = 一生只发生一次（比如出生、高考）
   cond    : 一个函数，返回 true 才可能触发（比如"颜值够高才有情书"） */
const EVENTS = [
  /* 出生（0 岁） */
  { id: 'b0', min: 0, max: 0, w: 10, once: true, txt: '你出生了，哭声嘹亮，全家都很高兴。' },
  { id: 'b1', min: 0, max: 0, w: 5,  once: true, cond: s => s.attrs.HOME >= 7,
    txt: '你出生在市中心的大房子里，人生起点颇高。' },
  { id: 'b2', min: 0, max: 0, w: 5,  once: true, cond: s => s.attrs.HOME <= 2,
    txt: '你出生在小镇的老屋里，全家都盼着你争气。' },

  /* 幼年 1-5 */
  { id: 'y1', min: 1, max: 3, w: 8, once: true, fx: { JOY: 1 },  txt: '你学会了走路，全家为你鼓掌。' },
  { id: 'y2', min: 1, max: 5, w: 6,  fx: { BODY: -1 },           txt: '你发了一场高烧，父母彻夜守护。' },
  { id: 'y3', min: 0, max: 1, w: 6,  once: true, fx: { INT: 1 }, txt: '抓周宴上，你一把抓住了计算器。' },
  { id: 'y4', min: 2, max: 5, w: 5,  fx: { JOY: -1 },            txt: '你在游乐园走丢了一回，虚惊一场。' },
  { id: 'y5', min: 2, max: 5, w: 5,  fx: { HOME: 1, JOY: 1 },    txt: '过年你收到压岁钱，口袋塞得鼓鼓的。' },

  /* 小学 6-12 */
  { id: 'p1', min: 6, max: 7,  w: 10, once: true, txt: '你上小学了，戴上了红领巾。' },
  { id: 'p2', min: 6, max: 12, w: 6, fx: { INT: 1 },             txt: '你考了满分，名字上了光荣榜。' },
  { id: 'p3', min: 8, max: 12, w: 5, fx: { JOY: -1 },            txt: '你上课看漫画，被老师没收了。' },
  { id: 'p4', min: 9, max: 12, w: 5, fx: { INT: -1, JOY: 1 },    txt: '你迷上了游戏厅，成绩悄悄下滑。' },
  { id: 'p5', min: 6, max: 10, w: 5, once: true, fx: { BODY: 1, JOY: 1 }, txt: '你学会了骑自行车，整个夏天都在飞驰。' },
  { id: 'p6', min: 6, max: 12, w: 5, fx: { JOY: 1 },             txt: '春游！你玩得满身是泥。' },
  { id: 'p7', min: 7, max: 12, w: 4, once: true, fx: { JOY: 2 }, txt: '你收养了一只流浪猫，取名"煤球"。' },
  { id: 'p8', min: 8, max: 12, w: 4, once: true, fx: { FACE: -1 }, txt: '你近视了，鼻梁上多了副小眼镜。' },

  /* 中学 13-18 */
  { id: 'm1', min: 13, max: 13, w: 9, once: true, fx: { JOY: -1 }, txt: '你上了初中，作业量翻了一倍。' },
  { id: 'm2', min: 13, max: 16, w: 6, once: true, fx: { FACE: 1 }, txt: '你一年长高了十厘米。' },
  { id: 'm3', min: 13, max: 18, w: 5, fx: { FACE: -1 },            txt: '青春期的痘痘爬上了你的脸。' },
  { id: 'm4', min: 13, max: 18, w: 6, fx: { BODY: 1, JOY: 1 },     txt: '你放学后偷偷打篮球打到天黑。' },
  { id: 'm5', min: 14, max: 18, w: 5, once: true, fx: { JOY: -1 }, txt: '你暗恋的人官宣了对象，你emo了一晚。' },
  { id: 'm6', min: 14, max: 18, w: 5, cond: s => s.attrs.INT >= 6, fx: { INT: 1 }, txt: '你考进了年级前十，成了老师的招牌。' },
  { id: 'm7', min: 16, max: 18, w: 4, cond: s => s.attrs.FACE >= 6, once: true, fx: { JOY: 2 }, txt: '你收到了人生第一封情书。' },
  { id: 'm8', min: 18, max: 18, w: 20, once: true, txt: '高考结束，无论结果如何，人生翻开了新的一页。' },

  /* 大学与工作 19-30 */
  { id: 'u1', min: 19, max: 19, w: 9, once: true, fx: { JOY: 1 },  txt: '你上了大学，第一次离家生活。' },
  { id: 'u2', min: 19, max: 22, w: 5, fx: { INT: -1 },             txt: '你挂了一科，含泪报名补考。' },
  { id: 'u3', min: 19, max: 22, w: 4, cond: s => s.attrs.INT >= 6, fx: { HOME: 1, JOY: 1 }, txt: '你拿到了奖学金。' },
  { id: 'u4', min: 19, max: 24, w: 4, cond: s => s.attrs.FACE >= 5, once: true, fx: { JOY: 2 }, txt: '你谈了人生第一场恋爱。' },
  { id: 'u5', min: 19, max: 25, w: 5, fx: { BODY: 1 },             txt: '你开始健身，坚持了半年。' },
  { id: 'u6', min: 23, max: 24, w: 8, once: true, fx: { JOY: 1 },  txt: '你毕业了，拍了一整天照片。' },
  { id: 'u7', min: 23, max: 26, w: 8, once: true, set: 'work',     txt: '你找到了第一份工作，工资不高但很自立。' },
  { id: 'u8', min: 24, max: 30, w: 6, cond: s => s.flags.work, fx: { BODY: -1 }, txt: '加班成了日常，工位的绿萝都比你精神。' },
  { id: 'u9', min: 25, max: 32, w: 4, fx: { JOY: -1 },             txt: '父母安排了相亲，对方张口就问你工资。' },
  { id: 'u10', min: 24, max: 30, w: 4, once: true, fx: { JOY: 2 }, txt: '你养了一只狗，下班终于有了盼头。' },

  /* 中年 31-50 */
  { id: 'd1', min: 35, max: 50, w: 6, fx: { BODY: -1 },            txt: '体检报告上出现了几个箭头。' },
  { id: 'd2', min: 36, max: 55, w: 6, fx: { BODY: 1 },             txt: '你保温杯里泡上了枸杞，认真养生。' },
  { id: 'd3', min: 35, max: 50, w: 4, cond: s => s.attrs.INT >= 7, fx: { HOME: 2 }, txt: '你升任部门主管，办公室有了自己的一面墙。' },
  { id: 'd4', min: 35, max: 50, w: 5, fx: { JOY: 1 },              txt: '你陪父母过了个年，发现他们真的老了。' },
  { id: 'd5', min: 36, max: 50, w: 4, fx: { HOME: -1 },            txt: '你跟风投资亏了一笔钱。' },

  /* 老年 51+ */
  { id: 'o1', min: 55, max: 70, w: 8, once: true, fx: { JOY: 1 },  txt: '你退休了，清晨去公园打太极。' },
  { id: 'o2', min: 55, max: 90, w: 5, cond: s => s.attrs.BODY >= 5, fx: { BODY: 1 }, txt: '你坚持晨跑，体检指标好得让医生点赞。' },
  { id: 'o3', min: 60, max: 95, w: 5, fx: { BODY: -2 },            txt: '你住了一次院，家人一直陪着你。' },
  { id: 'o4', min: 55, max: 90, w: 5, once: true, fx: { JOY: 2 },  txt: '你把阳台种满了花，每个清晨都有香气。' },

  /* 任意年龄 */
  { id: 'a1', min: 5,  max: 95, w: 3, fx: { BODY: -1 },            txt: '你生了一场不大不小的病。' },
  { id: 'a2', min: 6,  max: 90, w: 3, fx: { JOY: 1 },              txt: '你捡到一百块钱，请自己吃了顿好的。' },
  { id: 'a3', min: 5,  max: 95, w: 3,                              txt: '你做了一个很长很长的梦。' },
  { id: 'a4', min: 5,  max: 95, w: 3, fx: { JOY: -1 },             txt: '你弄丢了那把你最喜欢的伞。' },
];

/* ---------- 死因对应的一句话 ---------- */
const DEATH_LINES = {
  '先天不足': '你还没来得及看清这个世界，就匆匆离开了。',
  '积劳成疾': '身体是革命的本钱——这句话说给下一世听吧。',
  '郁郁而终': '你太累了，这一世就到这里吧。',
  '寿终正寝': '儿孙满堂，含笑而终，此生算是圆满。',
};

/* ---------- 评级 ---------- */
const GRADES = [
  { min: 55,  g: 'S', t: '逆天改命，此生无憾' },
  { min: 45,  g: 'A', t: '精彩纷呈，可圈可点' },
  { min: 35,  g: 'B', t: '有起有落，人间值得' },
  { min: 25,  g: 'C', t: '平平淡淡，也是真' },
  { min: -99, g: 'D', t: '苦命一生，下世请重开' },
];
