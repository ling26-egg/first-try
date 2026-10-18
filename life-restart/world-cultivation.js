/* ==================================================
   world-cultivation.js —— 世界二：修仙世界（出现率 15%）
   属性：根骨 / 悟性 / 灵石 / 威名 / 道心（精神）
   ================================================== */
WORLDS.push({
  id: 'xian', name: '修仙世界', rate: '15%', weight: 0.15, color: '#2e6e63',
  desc: '灵气充沛，宗门林立。凡人亿万，能踏出炼气一步者万中无一。长生路上，遍地都是白骨与机缘。',
  vital: 'GEN', mood: 'DAO', money: 'STONE',
  stats: [
    { key: 'GEN', name: '根骨' }, { key: 'WIT', name: '悟性' }, { key: 'STONE', name: '灵石' },
    { key: 'FAME', name: '威名' }, { key: 'DAO', name: '道心' },
  ],
  talents: [
    { id: 'hui',   n: '慧根',     g: 0, fx: { WIT: 1 } },
    { id: 'shizi', n: '世家子',   g: 0, fx: { STONE: 1 } },
    { id: 'sha',   n: '煞体',     g: 0, fx: { GEN: 1, DAO: -1 } },
    { id: 'qing',  n: '情种',     g: 0, fx: { DAO: 1, FAME: -1 } },
    { id: 'bing',  n: '病弱之躯', g: 0, fx: { GEN: -2, WIT: 1 } },
    { id: 'za',    n: '五灵杂根', g: 0, fx: { WIT: -1, GEN: 1 } },
    { id: 'jian',  n: '剑骨',     g: 1, fx: { GEN: 2, FAME: 1 } },
    { id: 'dotai', n: '道胎',     g: 1, fx: { DAO: 2, WIT: 1 } },
    { id: 'tianling', n: '天灵根', g: 2, fx: { WIT: 3 } },
    { id: 'xianren',  n: '仙人转世', g: 2, fx: { WIT: 2, DAO: 2 } },
  ],
  deaths: { weak: '走火入魔，道基崩毁', natural: '坐化于洞府之中' },
  endings: [
    { id: 'feisheng', name: '羽化飞升', grade: 'S', desc: '天门为你而开，雷云退散，仙音缥缈。此界再无你的踪迹。',
      check: s => s.attrs.WIT >= 11 && s.attrs.DAO >= 10 && s.age >= 90 },
    { id: 'jianxian', name: '剑开天门', grade: 'S', desc: '一剑既出，天门洞开。仙人俯首，万剑朝宗。',
      check: s => s.flags.sword && s.attrs.GEN >= 10 && s.age >= 60 },
    { id: 'zongshi', name: '一代宗师', grade: 'A', desc: '你开的宗门传承千年，山门石阶被朝圣者磨得发亮。',
      check: s => s.attrs.FAME >= 11 && s.age >= 70 },
  ],
  events: [
    { id: 'x0', min: 0, max: 0, w: 10, once: true, txt: '你出生于凡人村落，产房外有白鹤掠过屋檐。' },
    { id: 'x1', min: 6, max: 8, w: 10, once: true, txt: '仙师下山测灵根，你的天资——',
      opts: [
        { t: '出众，当场收徒', fx: { WIT: 1, DAO: 1 }, res: '全村人跪送你上山的白鹤。' },
        { t: '平平，只配杂役', fx: { WIT: -1, GEN: 1 }, res: '你进了宗门，却是从扫地开始的。' },
      ] },
    { id: 'x2', min: 8, max: 12, w: 8, once: true, fx: { STONE: 1 }, txt: '你拜入宗门，领到了第一块灵石月例。' },
    { id: 'x3', min: 10, max: 14, w: 7, once: true, txt: '藏经阁三层，你只能选一部功法——',
      opts: [
        { t: '《青锋剑诀》', flag: 'sword', fx: { GEN: 1 }, res: '剑修一途，有进无退。' },
        { t: '《万象心经》', fx: { WIT: 2 }, res: '法修万法，悟性为先。' },
        { t: '《不动明王体》', fx: { GEN: 2, WIT: -1 }, res: '肉身成圣，硬撼天雷。' },
      ] },
    { id: 'x4', min: 12, max: 20, w: 6, fx: { WIT: 1 }, txt: '你在灵田除草时参悟了一丝灵气运转的规律。' },
    { id: 'x5', min: 12, max: 18, w: 5, fx: { DAO: -1 }, txt: '内门师兄当众折辱你，你咽下了这口气。' },
    { id: 'x6', min: 15, max: 30, w: 7, once: true, fx: { WIT: 1, GEN: 1 }, txt: '你成功引气入体，踏入炼气期！' },
    { id: 'x7', min: 18, max: 35, w: 6, fx: { STONE: 2 }, txt: '你在坊市替人炼器跑腿，攒下了一小袋灵石。' },
    { id: 'x8', min: 20, max: 40, w: 6, tag: 'crisis', txt: '宗门秘境开启，深处传来宝光——',
      opts: [
        { t: '深入险地，搏那机缘', danger: 0.3, fx: { STONE: 3, FAME: 1 }, res: '你在断剑堆里捡到了上古玉简。' },
        { t: '在外围捡漏', fx: { STONE: 1 }, res: '外围也不太平，好在你机灵。' },
        { t: '不去，修炼要紧', fx: { WIT: 1 }, res: '别人搏命，你读书。稳。' },
      ] },
    { id: 'x9', min: 25, max: 40, w: 6, once: true, tag: 'crisis', txt: '筑基天劫降临，雷云压顶！',
      opts: [
        { t: '硬撼天雷', danger: 0.25, fx: { GEN: 2, FAME: 1 }, res: '焦黑的皮肤下，道基凝成了。' },
        { t: '服下护基丹硬闯', fx: { STONE: -2, GEN: 1 }, res: '丹药护住了心脉，你险险筑基。' },
      ] },
    { id: 'x10', min: 25, max: 60, w: 5, fx: { DAO: -1 }, txt: '同门为一件法器反目，你看到了修仙界的凉薄。' },
    { id: 'x11', min: 28, max: 50, w: 5, cond: s => s.attrs.DAO >= 6, once: true, fx: { DAO: 1, FAME: 1 }, txt: '你与一位道侣结成双修之契，红烛映照洞府。' },
    { id: 'x12', min: 30, max: 60, w: 6, tag: 'crisis', txt: '心魔劫至！你脑海中响起无数低语——',
      opts: [
        { t: '以本心直面心魔', need: { k: 'DAO', v: 5 }, fx: { DAO: 2 }, res: '心魔跪伏于你的道心之下。' },
        { t: '吞下静心符强撑', danger: 0.2, fx: { STONE: -1 }, res: '符力耗尽前，你熬了过去。' },
      ] },
    { id: 'x13', min: 35, max: 70, w: 6, tag: 'crisis', txt: '妖兽潮冲击山门，护山大阵摇摇欲坠——',
      opts: [
        { t: '登城墙死战', danger: 0.2, fx: { FAME: 2, GEN: -1 }, res: '你的名字被写进了宗门功勋簿。' },
        { t: '随队护送伤员', fx: { DAO: 1 }, res: '你救下了十七名同门。' },
      ] },
    { id: 'x14', min: 40, max: 80, w: 6, once: true, tag: 'crisis', txt: '金丹之劫至，紫雷九重！',
      opts: [
        { t: '逆天而上', danger: 0.3, fx: { WIT: 2, FAME: 2, GEN: -1 }, res: '九雷过后，金丹淬成，霞光万丈。' },
        { t: '闭死关，再等甲子', fx: { WIT: 1 }, res: '你相信水到渠成。' },
      ] },
    { id: 'x15', min: 45, max: 90, w: 5, fx: { STONE: 2 }, txt: '你开放讲法，凡俗弟子供奉的灵石堆成了小山。' },
    { id: 'x16', min: 50, max: 90, w: 4, cond: s => s.attrs.FAME >= 8, once: true, fx: { FAME: 2 }, txt: '正邪大战中你力挽狂澜，名字传遍修行界。' },
    { id: 'x17', min: 60, max: 100, w: 5, tag: 'crisis', fx: { GEN: -2 }, txt: '寿元大限将至，你的白发再也染不黑了。' },
    { id: 'x18', min: 20, max: 90, w: 4, fx: { DAO: 1 }, txt: '你在瀑布下枯坐七日，道心通明。' },
    { id: 'x19', min: 15, max: 80, w: 3, fx: { STONE: -1 }, txt: '你炼丹炸炉，把半个丹房炸上了天。' },
    { id: 'x20', min: 15, max: 80, w: 3, tag: 'calm', txt: '这一甲子，风平浪静，你只是安静地修炼。' },
  ],
});
