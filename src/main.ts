import vue from 'vue';
import AppVue from './App.vue';
import router from './router';
import store from './store';
import { IMessageItem } from '@/interfaces/IMessageItem';
import WebSocketManager from '@/WebSocketManager';

vue.config.productionTip = false;

new vue({
  router,
  store,
  render: h => h(AppVue),
}).$mount('#app');

export const webSocketManager = new WebSocketManager('ws://localhost:4700');

webSocketManager.on('message', (data: IMessageItem) => {
  store.commit('addMessageToChat', data);
});

webSocketManager.on('disconnect', () => {
  store.commit('network', false);
});

webSocketManager.on('open', () => {
  const messagesBuffer = store.state.messagesBuffer;
  if (store.state.messagesBuffer.length) {
    messagesBuffer.forEach((msg) => {
      webSocketManager.sendMessage(msg);
    });
    store.state.messagesBuffer = [];
  }
});
