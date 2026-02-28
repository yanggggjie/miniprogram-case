const CHAT_TEMPLATES = [
  { isMe: false, text: '在吗？' },
  { isMe: true, text: '在的，怎么了' },
  { isMe: false, text: '周末有空吗？想约你出来吃个饭' },
  { isMe: true, text: '周六可以' },
  { isMe: false, text: '行，那我定个餐厅，到时候发你地址' },
  { isMe: true, text: '好' },
  { isMe: false, text: '对了，你看了最近那个很火的综艺没？就是那个明星跳水的' },
  { isMe: true, text: '还没，好看吗' },
  { isMe: false, text: '超好看的！笑死我了哈哈哈哈，强烈推荐你看一下，每一期都有惊喜' },
  { isMe: true, text: '行 我今晚看看' },
  { isMe: false, text: '你最近工作忙不忙啊' },
  { isMe: true, text: '还行吧，这周赶了个需求，加了两天班，刚忙完' },
  { isMe: false, text: '辛苦了辛苦了' },
  { isMe: true, text: '习惯了hh' },
  { isMe: false, text: '诶你上次说想学吉他，后来学了吗' },
  { isMe: true, text: '买了把琴，练了两周就吃灰了😂' },
  { isMe: false, text: '哈哈哈哈 我就知道' },
  { isMe: true, text: '等我有空一定捡起来' },
  { isMe: false, text: '我信你个鬼' },
  { isMe: true, text: '😅' },
  { isMe: false, text: '话说你家那只猫最近怎么样了' },
  { isMe: true, text: '胖了好多，已经快12斤了，每天就知道吃和睡' },
  { isMe: false, text: '天哪，发张照片给我看看' },
  { isMe: true, text: '等下拍一张，它现在正趴在键盘上挡我打字呢' },
  { isMe: false, text: '哈哈哈哈哈太可爱了吧！我也好想养一只，但是我妈不让' },
  { isMe: true, text: '先斩后奏，抱回家她就没办法了' },
  { isMe: false, text: '我可不敢，上次带回来一只仓鼠她追着我打了三条街' },
  { isMe: true, text: '笑死' },
  { isMe: false, text: '对了周六吃完饭要不要去看电影？最近有部科幻片评分很高，好像叫什么星际什么的' },
  { isMe: true, text: '可以啊，我去查一下排片时间' },
  { isMe: false, text: '好嘞！那就这么说定了' },
  { isMe: true, text: '嗯嗯，到时候见' },
  { isMe: false, text: '拜拜~' },
  { isMe: true, text: '88' },
  { isMe: false, text: '等等！差点忘了，你帮我带那本书了吗' },
  { isMe: true, text: '啊……忘了，我明天带' },
  { isMe: false, text: '你每次都说明天😤' },
  { isMe: true, text: '这次是真的！我现在就放到包里' },
  { isMe: false, text: '好吧好吧，我再信你一次' },
  { isMe: true, text: '放好了，截图给你看' },
];

function pickFromPool(id) {
  const poolLen = CHAT_TEMPLATES.length;
  const index = ((id % poolLen) + poolLen) % poolLen;
  const tpl = CHAT_TEMPLATES[index];
  return { id, isMe: tpl.isMe, text: tpl.text };
}

function generateMessages(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(pickFromPool(i));
  }
  return list;
}

Page({
  data: {
    loading: true,
    msgList: [],
    renderTime: '',
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '占位符(bug)' });
    this._startTime = Date.now();
    setTimeout(() => {
      const msgList = generateMessages(10000);
      this.setData({ msgList, loading: false });
    }, 100);
  },

  onChatListReady() {
    const cost = Date.now() - this._startTime;
    this.setData({ renderTime: cost + 'ms' });
  },

  goToOtherPage() {
    wx.redirectTo({ url: '/pages/component-placeholder-fix/index' });
  },
});
