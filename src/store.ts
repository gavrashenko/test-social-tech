import vue from 'vue';
import vuex from 'vuex';
import axios from 'axios';
import IChatItem from '@/interfaces/IChatItem';
import IState from '@/interfaces/IState';
import IMessageItem from '@/interfaces/IMessageItem';
import WebSocketManager from '@/WebSocketManager';

const webSocketManager = new WebSocketManager('ws://localhost:4700');

vue.use(vuex);

const store = new vuex.Store({
  state: {
    chatsList: [],
    messagesBuffer: [],
    network: true,
    selfLogoUrl: 'http://www.dejurka.ru/wp-content/uploads/2014/08/41.jpg',
  },
  getters: {
    chatsList: (state: IState) => state.chatsList,
    messagesByChatId: (state: IState) => (id: string) => {
      const chat = state.chatsList.find((x: IChatItem) => x.id === id);
      return chat ? chat.messages : [];
    },
    logoByChatId: (state: IState) => (params: {id: string, self: boolean}) => {
      const chat = state.chatsList.find((x: IChatItem) => x.id === params.id);
      if (chat) {
        return params.self ? state.selfLogoUrl : chat.data.logoUrl;
      }
      return state.selfLogoUrl;
    },
    chatNameByChatId: (state: IState) => (id: string) => {
      const chat = state.chatsList.find((x: IChatItem) => x.id === id);
      return chat ? chat.data.name : '';
    },
  },
  actions: {
    async getChatsList({ commit }) {
      try {
        const res = await axios.get('http://localhost:4700/get-messages');
        if (res.data) {
          commit('setChatsList', res.data);
        }
      } catch (e) {
        console.error(e);
      }
    },
    sendMessage({ commit, state }, msg: IMessageItem) {
      if (state.network) {
        webSocketManager.sendMessage(msg);
      } else {
        commit('addMessageToBuffer', msg);
      }
      commit('addMessageToChat', msg);
    },
  },
  mutations: {
    setChatsList(state, payload) {
      state.chatsList = payload;
    },
    addMessageToBuffer(state, payload) {
      state.messagesBuffer.push(payload);
    },
    addMessageToChat(state, payload) {
      const chat = state.chatsList.find((x: IChatItem) => x.id === payload.chatId);
      if (!chat) {
        return;
      }
      chat.messages.push(payload);
    },
    network(state, payload) {
      state.network = payload;
    },
  },
});

webSocketManager.on('message', (data: IMessageItem) => {
  store.commit('addMessageToChat', data);
});

webSocketManager.on('disconnect', () => {
  store.commit('network', false);
});

webSocketManager.on('open', () => {
  const { messagesBuffer } = store.state;
  if (store.state.messagesBuffer.length) {
    messagesBuffer.forEach((msg) => {
      webSocketManager.sendMessage(msg);
    });
    store.state.messagesBuffer = [];
  }
});

export default store;
