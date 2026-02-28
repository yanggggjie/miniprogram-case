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
    this._version = 0;
    this._touchTimer = null;
    this._recorderManager = wx.getRecorderManager();
    wx.setNavigationBarTitle({ title: '录音启动(fix)' });

    this._recorderManager.onStart(() => {
      this._recorderState = 'recording';
      if (!this.data.isTouching) {
        this._recorderState = 'stopping';
        this._recorderManager.stop();
      }
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
    this.clearTouchTimeout();
    if (this._recorderState === 'recording') {
      this._recorderManager.stop();
    }
    clearTimeout(this._errorTimer);
  },

  clearTouchTimeout() {
    if (this._touchTimer) {
      clearTimeout(this._touchTimer);
      this._touchTimer = null;
    }
  },

  waitForStop(callback) {
    if (this._recorderState === 'stop') {
      callback();
      return;
    }
    const poll = () => {
      if (this._recorderState === 'stop') {
        callback();
      } else {
        setTimeout(poll, 50);
      }
    };
    setTimeout(poll, 50);
  },

  onRecordTouchStart() {
    const currentVersion = ++this._version;
    this.setData({ isTouching: true, statusText: '录音中...' });
    wx.vibrateShort({ type: 'medium' });
    this.clearTouchTimeout();

    this.waitForStop(() => {
      if (!this.data.isTouching || this._version !== currentVersion) return;
      this._touchTimer = setTimeout(() => {
        if (!this.data.isTouching || this._version !== currentVersion) return;
        this._recorderManager.start(RECORDER_OPTIONS);
        this.clearTouchTimeout();
      }, 150);
    });
  },

  onRecordTouchEnd() {
    this.setData({ isTouching: false, statusText: '录音已停止' });
    this.clearTouchTimeout();
    if (this._recorderState === 'recording') {
      this._recorderState = 'stopping';
      this._recorderManager.stop();
    }
  },

  goToOtherPage() {
    this.clearTouchTimeout();
    if (this._recorderState === 'recording') {
      this._recorderState = 'stopping';
      this._recorderManager.stop();
    }
    this.waitForStop(() => {
      wx.redirectTo({ url: '/pages/recorder-start-bug/index' });
    });
  },
});
