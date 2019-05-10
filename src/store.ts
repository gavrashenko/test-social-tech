import vue from 'vue';
import vuex from 'vuex';
import axios from 'axios';
import { IChatItem } from '@/interfaces/IChatItem';
import { IState } from '@/interfaces/IState';
import { IMessageItem } from '@/interfaces/IMessageItem';
import { webSocketManager } from '@/main';

vue.use(vuex);

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
      return chat ? !params.self ? chat.data.logoUrl : state.selfLogoUrl : state.selfLogoUrl;
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
