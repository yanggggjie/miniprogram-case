const RECORDER_OPTIONS = {
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
};

Page({
  data: {
    isTouching: false,
    statusText: '按住按钮开始录音',
    showError: false,
    errorMsg: '',
  },

  onLoad() {
    this._recorderState = 'stop';
    this._errorTimer = null;
    this._recorderManager = wx.getRecorderManager();
    wx.setNavigationBarTitle({ title: '录音启动(bug)' });

    this._recorderManager.onStart(() => {
      this._recorderState = 'recording';
    });

    this._recorderManager.onStop(() => {
      this._recorderState = 'stop';
    });

    this._recorderManager.onError((err) => {
      this._recorderState = 'stop';
      this.setData({
        showError: true,
        errorMsg: err.errMsg || '未知错误',
      });
      clearTimeout(this._errorTimer);
      this._errorTimer = setTimeout(() => {
        this.setData({ showError: false });
      }, 3000);
    });
  },

  onUnload() {
    if (this._recorderState === 'recording') {
      this._recorderManager.stop();
    }
    clearTimeout(this._errorTimer);
  },

  onRecordTouchStart() {
    this.setData({ isTouching: true, statusText: '录音中...' });
    wx.vibrateShort({ type: 'medium' });
    this._recorderManager.start(RECORDER_OPTIONS);
  },

  onRecordTouchEnd() {
    this.setData({ isTouching: false, statusText: '录音已停止' });
    if (this._recorderState === 'recording') {
      this._recorderState = 'stopping';
      this._recorderManager.stop();
    }
  },

  async goToOtherPage() {
    if (this._recorderState === 'recording') {
      this._recorderState = 'stopping';
      this._recorderManager.stop();
    }
    const self = this;
    async function* pollUntilStop() {
      while (self._recorderState !== 'stop') {
        await new Promise((r) => setTimeout(r, 50));
        yield;
      }
    }
    for await (const _ of pollUntilStop()) {}
    wx.redirectTo({ url: '/pages/recorder-start-fix/index' });
  },
});
