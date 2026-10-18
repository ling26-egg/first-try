/* ==================================================
   world-strange.js —— 世界三：奇异异世界（出现率 5%）
   属性：理智 / 灵视 / 体能 / 钱袋 / 心绪（精神）
   规则：这里的"要害"是理智——归零比死亡更可怕
   ================================================== */
WORLDS.push({
  id: 'eldritch', name: '奇异异世界', rate: '5%', weight: 0.05, color: '#6b4f9e',
  desc: '雾永远不散的城市，教堂的钟声多敲一下。这里的人讳莫如深：不要直视雾里的轮廓，不要回应门后的低语。',
  vital: 'SAN', mood: 'HEART', money: 'COIN',
  stats: [
    { key: 'SAN', name: '理智' }, { key: 'SEE', name: '灵视' }, { key: 'PHY', name: '体能' },
    { key: 'COIN', name: '钱袋' }, { key: 'HEART', name: '心绪' },
  ],
  talents: [
    { id: 'ironstomach', n: '铁胃',       g: 0, fx: { PHY: 1 } },
    { id: 'coin',        n: '好运硬币',   g: 0, fx: { HEART: 1, COIN: 1 } },
    { id: 'insomnia',    n: '失眠者',     g: 0, fx: { SEE: 1, SAN: -1 } },
    { id: 'oldword',     n: '通晓古文',   g: 0, fx: { SEE: 1 } },
    { id: 'watched',     n: '被注视者',   g: 0, fx: { SAN: -2, SEE: 1 } },
    { id: 'madtalk',     n: '疯言疯语',   g: 0, fx: { SAN: -1, COIN: 1 } },
    { id: 'medium',      n: '灵媒体质',   g: 1, fx: { SEE: 2, SAN: -1 } },
    { id: 'yinnyang',    n: '阴阳眼',     g: 1, fx: { SEE: 2 } },
    { id: 'keeper',      n: '守密人',     g: 1, fx: { SAN: 2 } },
    { id: 'bloodline',   n: '旧日血裔',   g: 2, fx: { SEE: 2, PHY: 1, SAN: -1 } },
  ],
  deaths: { weak: '理智崩解，你成了雾的一部分', natural: '在摇椅上安然老去' },
  endings: [
    { id: 'truth', name: '窥见真相', grade: 'S', desc: '你读完了那本不该存在的书，然后合上了它。世界重启了，只有你记得。',
      check: s => s.attrs.SEE >= 11 && s.attrs.SAN >= 5 },
    { id: 'poet', name: '疯狂诗人', grade: 'A', desc: '他们把你关进疯人院。你写的诗，一百年后仍让读者发疯。',
      check: s => s.attrs.SAN <= 3 && s.attrs.SEE >= 8 },
    { id: 'keeper', name: '守密一生', grade: 'A', desc: '你守住了那个秘密，直到坟墓。墓志铭只有一个字："嘘"。',
      check: s => s.attrs.SAN >= 9 && s.age >= 70 },
  ],
  events: [
    { id: 'e0', min: 0, max: 0, w: 10, once: true, txt: '你出生在雾夜，产房的灯闪了三下才稳住。' },
    { id: 'e1', min: 3, max: 6, w: 6, once: true, fx: { SEE: 1 }, txt: '你指着衣柜顶上"坐着的人"咯咯直笑，大人们脸色发白。' },
    { id: 'e2', min: 5, max: 15, w: 6, once: true, txt: '祖父的旧宅阁楼里有一本上锁的书——',
      opts: [
        { t: '撬开锁，读它', tag: 'crisis', fx: { SEE: 2, SAN: -1 }, res: '那些文字在你梦里游了一整年。' },
        { t: '尊重锁，离开', fx: { SAN: 1 }, res: '有些门，不开是对的。' },
      ] },
    { id: 'e3', min: 6, max: 16, w: 5, fx: { HEART: 1 }, txt: '母亲在灯下给你读童话，雾在窗外退了半尺。' },
    { id: 'e4', min: 10, max: 30, w: 5, tag: 'crisis', txt: '凌晨三点，浴室的镜子里，你比镜子慢了半拍——',
      opts: [
        { t: '盯着它，看谁先眨眼', fx: { SEE: 2, SAN: -2 }, res: '它先退开了。代价是你三个月不敢照镜子。' },
        { t: '蒙上镜子，念佛号', fx: { SAN: 1 }, res: '老法子有时候真管用。' },
      ] },
    { id: 'e5', min: 16, max: 40, w: 6, once: true, txt: '一封烫金请帖送到：渔村旅行的邀请——',
      opts: [
        { t: '赴约，探究渔村异闻', tag: 'crisis', fx: { SEE: 2, COIN: -1 }, res: '你听见了海底的歌声，逃了出来，耳道里全是盐。' },
        { t: '把请帖烧掉', fx: { SAN: 1 }, res: '灰烬里有一枚鱼鳞，你假装没看见。' },
      ] },
    { id: 'e6', min: 18, max: 60, w: 5, fx: { COIN: 1 }, txt: '你替古董商跑腿，报酬丰厚——东西越来越怪。' },
    { id: 'e7', min: 20, max: 50, w: 6, tag: 'crisis', txt: '教区的钟声今晚多敲了一下，全城的人都没入睡——',
      opts: [
        { t: '去钟楼看个究竟', danger: 0.2, fx: { SEE: 2, SAN: -1 }, res: '你看见钟绳自己晃动。从那天起你懂了一门"语言"。' },
        { t: '锁门，蒙头睡觉', fx: { HEART: -1 }, res: '你熬到天亮。钟声在你脑子里多绕了一年。' },
      ] },
    { id: 'e8', min: 22, max: 60, w: 5, cond: s => s.attrs.SEE >= 6, once: true, fx: { SEE: 1, SAN: -1 }, txt: '你在旧书摊淘到一页残稿，上面的文字会自己 rearrange。' },
    { id: 'e9', min: 25, max: 55, w: 5, tag: 'crisis', txt: '公寓的 13 层出现了，而电梯只到 12 层——',
      opts: [
        { t: '走楼梯上去', danger: 0.25, fx: { SEE: 2, COIN: 2 }, res: '13 层住着一位"收藏家"，他很满意你的胆量，付了钱。' },
        { t: '向物业反映', fx: { HEART: -1 }, res: '物业说：我们楼没有13层。之前没人反映过。' },
      ] },
    { id: 'e10', min: 28, max: 70, w: 4, fx: { SAN: -1 }, txt: '连续一个月，你梦见同一座沉没的城市。' },
    { id: 'e11', min: 30, max: 70, w: 4, cond: s => s.attrs.SAN <= 5, fx: { SEE: 1 }, txt: '住院部的白墙对你说话，语气意外地温柔。' },
    { id: 'e12', min: 35, max: 80, w: 5, once: true, txt: '收藏家再次来访，提出一笔交易——',
      opts: [
        { t: '卖掉"一段记忆"', fx: { COIN: 3, SAN: -1 }, res: '钱到账了。你只是想不起那笔钱是为卖什么。' },
        { t: '拒绝，关门', fx: { SAN: 1 }, res: '门外的雾叹了口气，散了。' },
      ] },
    { id: 'e13', min: 40, max: 85, w: 5, tag: 'crisis', txt: '雾进城了。这次它没有绕开教堂——',
      opts: [
        { t: '协助守夜人守钟', danger: 0.15, fx: { SAN: 1, COIN: 1 }, res: '钟声响起时，雾像退潮一样退了。你是幸存者里的名人。' },
        { t: '带着家人出城', fx: { COIN: -2, HEART: 1 }, res: '你在乡下住了半年，雾没有追来。大概没有。' },
      ] },
    { id: 'e14', min: 45, max: 90, w: 4, fx: { HEART: 1 }, txt: '你开始养花。只有在这个世界，这算勇敢的行为。' },
    { id: 'e15', min: 50, max: 90, w: 4, fx: { SAN: 1 }, txt: '晚年你把手记锁进抽屉：知道得越少，活得越久。' },
    { id: 'e16', min: 10, max: 90, w: 3, fx: { PHY: 1 }, txt: '你练了一手好体格——在这个世界，跑步是刚需。' },
    { id: 'e17', min: 10, max: 90, w: 3, tag: 'calm', txt: '一个难得的晴天。全城的人都在街上晒太阳，谁也不说话。' },
  ],
});
