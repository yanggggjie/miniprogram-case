Component({
  properties: {
    msgList: { type: Array, value: [] },
  },

  lifetimes: {
    ready() {
      this.triggerEvent('ready');
    },
  },
});
