const LOADING_HEIGHT = 52;
const LOAD_MORE_COUNT = 5;
const LOAD_MORE_DELAY = 1200;

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
  { isMe: true, text: '放好了，截图给你看,' },
];

let nextId = 1000;

function pickFromPool(id) {
  const poolLen = CHAT_TEMPLATES.length;
  const index = ((id % poolLen) + poolLen) % poolLen;
  const tpl = CHAT_TEMPLATES[index];
  return { id, isMe: tpl.isMe, text: tpl.text };
}

function generateInitialMessages() {
  const list = [];
  for (let i = 0; i < 20; i++) {
    list.push(pickFromPool(nextId - 20 + i));
  }
  nextId -= 20;
  return list;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadMoreMessages() {
  const list = [];
  for (let i = 0; i < LOAD_MORE_COUNT; i++) {
    list.push(pickFromPool(nextId - LOAD_MORE_COUNT + i));
  }
  nextId -= LOAD_MORE_COUNT;
  return delay(LOAD_MORE_DELAY).then(() => list);
}

Page({
  data: {
    isFixMode: false,
    msgList: [],
    tempMsgList: [],
    scrollY: true,
    scrollTop: 0,
    scrollWithAnimation: true,
    loadingMore: false,
    scrollViewHeight: 0,
  },

  onLoad() {
    this.calcScrollViewHeight();
    this.setData({ msgList: generateInitialMessages() });
  },

  calcScrollViewHeight() {
    const query = wx.createSelectorQuery().in(this);
    query.select('.page').boundingClientRect((rect) => {
      if (rect) {
        this.setData({ scrollViewHeight: rect.height });
      }
    }).exec();
  },

  toggleMode() {
    nextId = 1000;
    this.setData({
      isFixMode: !this.data.isFixMode,
      msgList: generateInitialMessages(),
      tempMsgList: [],
      scrollY: true,
      scrollTop: 0,
      scrollWithAnimation: true,
      loadingMore: false,
    });
  },

  onScroll(e) {
    this._realScrollTop = e.detail.scrollTop;
  },

  async onScrollToUpperBuggy() {
    if (this.data.loadingMore) return;
    this.setData({ loadingMore: true });

    const moreMsgList = await loadMoreMessages();
    this.setData({
      msgList: moreMsgList.concat(this.data.msgList),
      loadingMore: false,
    });
  },

  async onScrollToUpperFix() {
    if (this.data.loadingMore) return;
    this.setData({ loadingMore: true, scrollWithAnimation: false, scrollTop: 0 });

    const moreMsgList = await loadMoreMessages();

    // 预渲染 + 滚动定位
    this.setData({ tempMsgList: moreMsgList, scrollY: false }, () => {
      setTimeout(() => {
        const scrollTop = this._realScrollTop || 0;
        setTimeout(() => {
          wx.createSelectorQuery()
            .in(this)
            .select('.temp-chat-area')
            .boundingClientRect((rect) => {
              const tempAreaHeight = rect?.height || 0;

              this.setData({ scrollY: false }, () => {
                this.setData({ scrollY: true }, () => {
                  setTimeout(() => {
                    const newScrollTop =
                      scrollTop + tempAreaHeight + Math.random() / 100 - LOADING_HEIGHT;

                    this.setData(
                      {
                        msgList: moreMsgList.concat(this.data.msgList),
                        tempMsgList: [],
                        loadingMore: false,
                        scrollTop: Math.max(0, newScrollTop),
                      },
                      () => {
                        setTimeout(() => {
                          this.setData({ scrollWithAnimation: true, scrollY: true });
                        }, 150);
                      },
                    );
                  }, 100);
                });
              });
            })
            .exec();
        }, 100);
      });
    });
  },
});
