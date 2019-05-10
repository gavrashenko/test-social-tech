import store from '@/store';
import { IMessageItem } from '@/interfaces/IMessageItem';
import WebSocketManager from '@/WebSocketManager';

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
