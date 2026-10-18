/* ==================================================
   world-primal.js —— 世界四：原始蛮荒世界（出现率 5%）
   属性：体魄 / 狩猎 / 声望 / 资源 / 意志（精神）
   ================================================== */
WORLDS.push({
  id: 'primal', name: '原始蛮荒世界', rate: '5%', weight: 0.05, color: '#a3612a',
  desc: '巨兽踏碎河流，篝火是文明的全部边界。在这里，能活过第一个冬天的人，已经是勇士。',
  vital: 'COR', mood: 'WILL', money: 'RES',
  stats: [
    { key: 'COR', name: '体魄' }, { key: 'HUNT', name: '狩猎' }, { key: 'REN', name: '声望' },
    { key: 'RES', name: '资源' }, { key: 'WILL', name: '意志' },
  ],
  talents: [
    { id: 'hardbone', n: '硬骨',       g: 0, fx: { COR: 1 } },
    { id: 'hunter',   n: '好猎手',     g: 0, fx: { HUNT: 1 } },
    { id: 'tribeson', n: '部族之子',   g: 0, fx: { REN: 1 } },
    { id: 'herb',     n: '毒草辨识',   g: 0, fx: { RES: 1 } },
    { id: 'weak',     n: '天生病弱',   g: 0, fx: { COR: -2, WILL: 1 } },
    { id: 'swift',    n: '疾风腿',     g: 1, fx: { HUNT: 2 } },
    { id: 'beast',    n: '驯兽亲和',   g: 1, fx: { REN: 2, flag: 'beastfriend' } },
    { id: 'fire',     n: '火种守护者', g: 1, fx: { RES: 2, REN: 1 } },
    { id: 'giant',    n: '巨力',       g: 1, fx: { COR: 3 } },
    { id: 'beastgod', n: '兽神注视',   g: 2, fx: { COR: 2, HUNT: 2 } },
  ],
  deaths: { weak: '伤势过重，倒在了迁徙路上', natural: '在篝火旁安然闭上双眼' },
  endings: [
    { id: 'chief', name: '大酋长', grade: 'S', desc: '十二个部落的图腾上都刻了你的名字。你死后，他们为你堆了整座山丘。',
      check: s => s.attrs.REN >= 11 && s.age >= 50 },
    { id: 'beastmess', name: '兽神使者', grade: 'S', desc: '兽潮在你们部落前自动分成两半。他们说，那是兽神在向你行礼。',
      check: s => s.flags.beastfriend && s.attrs.COR >= 10 },
    { id: 'legend', name: '篝火传说', grade: 'A', desc: '你的故事被萨满编成歌。孩子们围着火堆唱了一百年。',
      check: s => s.attrs.WILL >= 10 && s.age >= 65 },
  ],
  events: [
    { id: 'r0', min: 0, max: 0, w: 10, once: true, txt: '你出生在篝火旁，萨满说你命里带火。' },
    { id: 'r1', min: 3, max: 6, w: 6, once: true, fx: { COR: 1 }, txt: '你比同龄人早学会奔跑，摔了无数跤。' },
    { id: 'r2', min: 6, max: 10, w: 6, once: true, fx: { HUNT: 1 }, txt: '你用削尖的木棍第一次刺中了鱼。全族人分食了它。' },
    { id: 'r3', min: 8, max: 14, w: 5, fx: { RES: 1 }, txt: '你学会了辨识哪片灌木的果子吃了不会死。这很重要。' },
    { id: 'r4', min: 12, max: 18, w: 8, once: true, tag: 'crisis', txt: '成人礼：你必须独自在荒野活过三天——',
      opts: [
        { t: '深入兽林，猎一头大物', danger: 0.25, fx: { HUNT: 2, REN: 2 }, res: '你拖着比自己还重的猎物回村，火把照了半夜。' },
        { t: '躲在河湾熬过三天', fx: { WILL: 1 }, res: '不体面，但完整。族人笑着说：活着就好。' },
      ] },
    { id: 'r5', min: 14, max: 40, w: 6, fx: { HUNT: 1 }, txt: '你随狩猎队围猎野马群，学到了包抄的节奏。' },
    { id: 'r6', min: 15, max: 45, w: 6, tag: 'crisis', txt: '剑齿虎夜袭营地！火把在风中明灭——',
      opts: [
        { t: '举矛站在孩子前面', danger: 0.3, fx: { REN: 3, COR: -1 }, res: '它叼走了一只羊，记住了你的眼睛。' },
        { t: '吹响兽骨号呼救', fx: { REN: 1 }, res: '全族的火把聚过来，虎退了。' },
      ] },
    { id: 'r7', min: 16, max: 50, w: 5, once: true, txt: '邻族前来议亲，你决定——',
      opts: [
        { t: '应下这门亲事', fx: { RES: 2, REN: 1 }, res: '两个部落从此互通有无。' },
        { t: '婉拒，还年轻', fx: { WILL: 1 }, res: '萨满笑而不语，替你记了一卦。' },
      ] },
    { id: 'r8', min: 18, max: 60, w: 6, once: true, tag: 'crisis', txt: '旱季降临，河流见了底，部族必须迁徙——',
      opts: [
        { t: '带队探路，寻找新水源', danger: 0.2, fx: { REN: 2, RES: 2 }, res: '你找到了一眼温泉泉眼。部族称它为"你的名字"。' },
        { t: '留守看护老幼', fx: { WILL: 1, REN: 1 }, res: '你守着营地等到了探路队归来。' },
      ] },
    { id: 'r9', min: 20, max: 60, w: 6, once: true, tag: 'crisis', txt: '猛犸群迁徙经过山谷——这是十载一遇的猎机！',
      opts: [
        { t: '全力围猎头象', danger: 0.3, fx: { RES: 4, REN: 2, COR: -1 }, res: '够全族吃一个冬天。你的腿上留下了一道象牙的疤。' },
        { t: '只捡食掉队的弱象', fx: { RES: 1 }, res: '稳妥，但不荣耀。' },
      ] },
    { id: 'r10', min: 22, max: 70, w: 5, fx: { RES: 1 }, txt: '你开始晒制肉干和兽皮，部族的储藏洞满了半仓。' },
    { id: 'r11', min: 25, max: 70, w: 5, once: true, cond: s => s.attrs.REN >= 6, fx: { REN: 2 }, txt: '长老会为你举行了纹面礼：你被承认为部落的猎首。' },
    { id: 'r12', min: 28, max: 80, w: 5, tag: 'crisis', txt: '暴风雪连下九天，火种将熄——',
      opts: [
        { t: '以身护火，彻夜添柴', danger: 0.2, fx: { REN: 3, COR: -1 }, res: '火种保住了。你的双手再也不能灵活弯曲。' },
        { t: '分火入洞，各燃一堆', fx: { WILL: 1, RES: -1 }, res: '柴烧完了大半，但火活着。' },
      ] },
    { id: 'r13', min: 30, max: 85, w: 5, tag: 'crisis', txt: '异族越境抢夺猎场，谈判破裂——',
      opts: [
        { t: '擂鼓开战', danger: 0.3, fx: { REN: 3, RES: 2, COR: -2 }, res: '血染河谷。你的名字成了对方哄孩子的咒语。' },
        { t: '划河而治，互市替代', fx: { RES: 2, REN: 1 }, res: '没人见过用兽皮换和平的，但你做到了。' },
      ] },
    { id: 'r14', min: 35, max: 90, w: 5, fx: { WILL: 1 }, txt: '萨满收你为记名弟子，你学会了听风辨季。' },
    { id: 'r15', min: 40, max: 90, w: 4, cond: s => s.flags.beastfriend, once: true, fx: { REN: 2 }, txt: '一头独眼白狼常年伴你左右，族人说它是兽神的坐骑。' },
    { id: 'r16', min: 50, max: 95, w: 4, fx: { COR: -1 }, txt: '旧伤在阴雨天隐隐作痛，你开始拄一根木杖。' },
    { id: 'r17', min: 55, max: 95, w: 4, fx: { WILL: 2 }, txt: '你给孩子们讲了一百个故事，每一个都有你的影子。' },
    { id: 'r18', min: 10, max: 90, w: 3, fx: { COR: -1 }, tag: 'crisis', txt: '你染上了热病，在草棚里烧了五天。' },
    { id: 'r19', min: 10, max: 90, w: 3, tag: 'calm', txt: '这一季风调雨顺，兽群丰盛，篝火边全是笑声。' },
  ],
});
