import vue from 'vue';
import vuex from 'vuex';
import axios from 'axios';
import { IChatItem } from '@/interfaces/IChatItem';
import { IState } from '@/interfaces/IState';
import { IMessageItem } from '@/interfaces/IMessageItem';
import { webSocketManager } from '@/main';

vue.use(vuex);

// const webSocketManager = new WebSocketManager('ws://localhost:8999');
// webSocketManager.on('open', () => {
//   console.log(555);
// });
//
// webSocketManager.on('message',(data: IMessageItem) => {
//   console.log(data);
// });

export default new vuex.Store({
  state: {
    chatsList: [],
    messagesBuffer: [],
    network: true,
    selfLogoUrl: 'http://www.dejurka.ru/wp-content/uploads/2014/08/41.jpg',
  },
  getters: {
    chatsList: (state: IState) => {
      return state.chatsList;
    },
    messagesByChatId: (state: IState) => (id: string) => {
      const chat = state.chatsList.find((x: IChatItem) => x.id === id);
      return chat ? chat.messages : [];
    },
    logoByChatId: (state: IState) => (params: {id: string, self: boolean}) => {
      const chat = state.chatsList.find((x: IChatItem) => x.id === params.id);
      return chat ? !params.self ? chat.data.chat_img_url : state.selfLogoUrl : state.selfLogoUrl;
    },
  },
  actions: {
    async getChatsList({ commit }) {
      try {
        const res = await axios.get('http://localhost:8999/get-messages');
        if (res.data) {
          commit('setChatsList', res.data);
        }
      } catch (e) {
        console.log(e);
      }
    },
    sendMessage({ commit, state }, msg: IMessageItem) {
      if (state.network) {
        webSocketManager.sendMessage(msg);
      } else {
        commit('addMessageToBuffer', msg);
      }
      commit('addMessage', msg);
    },
  },
  mutations: {
    setChatsList(state, payload) {
      state.chatsList = payload;
    },
    addMessageToBuffer(state, payload) {
      state.messagesBuffer.push(payload);
      console.log(state.messagesBuffer);
    },
    addMessage(state, payload) {
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
