/* ==================================================
   world-gu.js —— 世界五：蛊真界（出现率 1%）
   参考：《蛊真人》。你转生为魔道巨擘"方源"。
   属性：资质 / 元气 / 元石 / 威名 / 道心（精神）
   ================================================== */
WORLDS.push({
  id: 'gu', name: '蛊真界', rate: '1%', weight: 0.01, color: '#4a6741',
  desc: '万物皆可为蛊。蛊师以空窍养蛊，以元石为食。你转生成了魔道大能方源——五百年前你败了，这一次，春秋蝉还在你体内。',
  vital: 'BODY', mood: 'DAO', money: 'STONE',
  stats: [
    { key: 'APT', name: '资质' }, { key: 'PRIM', name: '元气' }, { key: 'STONE', name: '元石' },
    { key: 'FAME', name: '威名' }, { key: 'DAO', name: '道心' },
  ],
  talents: [
    { id: 'gfamily', n: '世家子弟', g: 0, fx: { STONE: 1 } },
    { id: 'gnarrow', n: '空窍狭窄', g: 0, fx: { APT: -1, PRIM: -1 } },
    { id: 'giron',   n: '铁骨',     g: 0, fx: { BODY: 2 } },
    { id: 'gmerch',  n: '商贾头脑', g: 0, fx: { STONE: 2, DAO: -1 } },
    { id: 'gthird',  n: '丙等资质', g: 0, fx: { APT: -2, STONE: 1 }, flag: 'fangyuan' },
    { id: 'gclose',  n: '蛊亲和',   g: 1, fx: { APT: 1, PRIM: 1 } },
    { id: 'gdemon',  n: '魔胎',     g: 1, fx: { APT: 2, DAO: -1 } },
    { id: 'greborn', n: '转世者',   g: 1, fx: { APT: 1, DAO: 2 } },
    { id: 'gtop',    n: '甲等资质', g: 2, fx: { APT: 3 } },
    { id: 'gcicada', n: '春秋蝉·残片', g: 2, fx: { APT: 1 }, flag: 'cicada',
      d: '死后可借蝉重生一次（蛊真界限定）' },
  ],
  deaths: { weak: '蛊反噬体，空窍崩碎', natural: '油尽灯枯，坐于蛊房之中' },
  endings: [
    { id: 'demonlord', name: '魔道巨擘', grade: 'S', desc: '正道十大宗门联名缉你，却没人敢当先出手。你在血湖之上开坛讲道。',
      check: s => s.attrs.STONE >= 11 && s.attrs.PRIM >= 10 },
    { id: 'guimmortal', name: '蛊仙登位', grade: 'S', desc: '仙窍洞开，福地自生。你飞升那日，天下的蛊齐鸣了三声。',
      check: s => s.attrs.APT >= 11 && s.age >= 80 },
    { id: 'fangyuan', name: '五百年之约', grade: 'A', desc: '你终于回到了五百年前那个雨夜——这一次，你不会输。',
      check: s => s.flags.fangyuan && s.attrs.APT >= 8 && s.age >= 60 },
  ],
  events: [
    { id: 'g0', min: 0, max: 0, w: 10, once: true, txt: '你转生为古月家族的婴儿。襁褓中，你听见血脉深处一声蝉鸣。' },
    { id: 'g1', min: 15, max: 15, w: 12, once: true, txt: '觉醒仪式上，元石映出你的空窍——',
      opts: [
        { t: '资质出众，族人瞩目', fx: { APT: 2, FAME: 1 }, res: '长老抚须而笑，族学向你敞开。' },
        { t: '资质平平（丙等），无人问津', fx: { APT: -1, DAO: 1 }, res: '你在无人注意的角落冷笑：五百年后，谁还记得资质？' },
      ] },
    { id: 'g2', min: 15, max: 18, w: 9, once: true, fx: { PRIM: 1 }, txt: '你成功催动第一只蛊——望月蛊，月刃微凉。' },
    { id: 'g3', min: 16, max: 20, w: 7, txt: '每月的元石月例不够用，你决定——',
      opts: [
        { t: '进山采蛊材售卖', danger: 0.15, fx: { STONE: 2, BODY: -1 }, res: '青茅山的蛊材换了三块元石，也换了你一身的蚊子包。' },
        { t: '省吃俭用熬着', fx: { DAO: 1 }, res: '饿不死，也富不了。你习惯了。' },
      ] },
    { id: 'g4', min: 18, max: 30, w: 6, tag: 'crisis', txt: '青茅山狼潮暴动，村寨戒严——',
      opts: [
        { t: '随猎队守寨，魔道手段尽出', danger: 0.25, fx: { FAME: 2, STONE: 1 }, res: '狼王授首。有人说你的手法不像正道——说得对。' },
        { t: '协助转移妇孺', fx: { FAME: 1, DAO: 1 }, res: '你在混乱中救人无数，无人知晓你的魔道心肠。' },
      ] },
    { id: 'g5', min: 20, max: 35, w: 6, txt: '你得到一份残缺的炼蛊方子，你决定——',
      opts: [
        { t: '照方炼蛊，成败在天', danger: 0.35, fx: { APT: 1, STONE: -1 }, res: '炉开的一瞬，异香满室——成了，虽然只是二转。' },
        { t: '卖掉方子换元石', fx: { STONE: 2 }, res: '买方子的那人后来炸了炉。世事难料。' },
      ] },
    { id: 'g6', min: 22, max: 40, w: 5, fx: { PRIM: 1 }, txt: '你突破到二转蛊师，空窍中的元气旋涡快了一分。' },
    { id: 'g7', min: 25, max: 45, w: 6, once: true, tag: 'crisis', txt: '你在山谷发现血湖遗迹，湖水低语着诱惑——',
      opts: [
        { t: '取血炼蛊，图那大机缘', danger: 0.3, fx: { PRIM: 3, DAO: -1 }, res: '血蛊入窍的刹那，你听见了五百年的风声。' },
        { t: '绕道而行，不入是非', fx: { DAO: 1 }, res: '魔道大能也懂趋利避害，这才是活得久的秘诀。' },
      ] },
    { id: 'g8', min: 30, max: 55, w: 5, fx: { STONE: 2 }, txt: '你在坊市倒卖蛊材，低买高卖，商路渐通三族。' },
    { id: 'g9', min: 30, max: 60, w: 6, tag: 'crisis', txt: '正道宗门查到你的魔道痕迹，围山搜捕——',
      opts: [
        { t: '焚屋毁证，远走他乡', danger: 0.2, fx: { STONE: -2, FAME: 1 }, res: '你消失在茫茫夜色里，通缉令上画错了你的脸。' },
        { t: '反杀领队，嫁祸同伙', fx: { FAME: 2, DAO: -1 }, res: '正道内乱三月。你坐在山顶看戏。' },
      ] },
    { id: 'g10', min: 35, max: 70, w: 6, once: true, tag: 'crisis', txt: '三转瓶颈，空窍壁障坚固如铁——',
      opts: [
        { t: '以蛊破关，险中求胜', danger: 0.3, fx: { PRIM: 2, APT: 1 }, res: '壁障碎裂时，你的第一只三转蛊破壳而出。' },
        { t: '服元石羹水磨功夫', fx: { STONE: -2, PRIM: 1 }, res: '慢是慢了点，但稳。' },
      ] },
    { id: 'g11', min: 40, max: 80, w: 5, fx: { FAME: 1 }, txt: '你开始收弟子、建情报网——魔道也要讲基本法。' },
    { id: 'g12', min: 45, max: 85, w: 5, tag: 'crisis', txt: '五转之劫至，风云变色，仇家齐聚山下——',
      opts: [
        { t: '当众渡劫，杀伐立威', danger: 0.3, fx: { FAME: 3, PRIM: 2, BODY: -1 }, res: '劫云散去，山下尸横遍野。魔道巨擘之名，自此而定。' },
        { t: '假死脱身，隐姓埋名', fx: { DAO: 1 }, res: '棺木合葬了你的"尸体"。你在暗处笑了。' },
      ] },
    { id: 'g13', min: 50, max: 90, w: 4, fx: { APT: 1 }, txt: '你参悟智蛊残念，算路又深了一层。' },
    { id: 'g14', min: 55, max: 95, w: 4, fx: { STONE: 3 }, txt: '你的蛊虫商路垄断了三族坊市，元石堆成了山。' },
    { id: 'g15', min: 60, max: 95, w: 4, fx: { BODY: -1 }, txt: '数百年的蛊反噬累积，你的身体开始朽坏。' },
    { id: 'g16', min: 20, max: 90, w: 3, tag: 'calm', txt: '这一年无事发生。你在蛊房里听着蝉鸣，假寐半日。' },
    { id: 'g17', min: 20, max: 90, w: 3, fx: { DAO: 1 }, txt: '你夜观星象，将五百年前的旧路又推演了一遍。' },
  ],
});
