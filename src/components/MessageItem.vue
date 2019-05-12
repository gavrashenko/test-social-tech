<template>
  <div class="chat-message">
    <div class="chat-message-foto">
        <img :src="logoByChatId({id: $route.params.id, self: message.data.self})" :alt="message.id">
    </div>
    <div class="chat-message-text"
         v-html="message.data.text">
    </div>
    <div class="chat-message-time">
        {{messageTime}}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store';
import { mapGetters } from 'vuex';
import moment from 'moment';
import router from '../router';
import IMessageItem from '../interfaces/IMessageItem';

export default Vue.extend({
  store,
  router,
  props: {
    message: {
      type: Object as () => IMessageItem,
    },
  },
  computed: {
    ...mapGetters([
      'messagesByChatId',
      'logoByChatId',
    ]),
  },
  data() {
    return {
      messageTime: '',
    };
  },
  created(): void {
    this.messageTime = moment(this.message.data.createdAt).fromNow();
    setInterval(() => {
      this.messageTime = moment(this.message.data.createdAt).fromNow();
    }, 30000);
  },
});
</script>

<style scoped lang="scss">
  .chat-message {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    align-items: flex-end;
    margin-top: 24px;
    padding-right: 56px;
    flex-wrap: wrap;

    &.user-message {
      justify-content: flex-start;
      flex-direction: row-reverse;
      padding-left: 56px;
      padding-right: 0;
    }
  }

  .chat-message-time {
    width: 100%;
    margin-top: 8px;
    font-weight: 600;
    line-height: 24px;
    font-size: 12px;
    letter-spacing: 0.25px;
    color: #FFFFFF;
    padding-left: 56px;
  }

  .chat-message-foto {
    min-width: 40px;
    width: 40px;
    height: 40px;
    border: 2px solid #F0FAFF;
    border-radius: 100px;
    overflow: hidden;
    background-color: #DDE5EB;
    margin-right: 16px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .chat-message-text {
    max-width: 520px;
    width: calc(100% - 56px);
    padding: 16px;
    background: #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16), 0 4px 6px rgba(0, 0, 0, 0.1);
    font-weight: normal;
    line-height: 24px;
    font-size: 16px;
    text-align: justify;
    letter-spacing: 0.25px;
    color: #000000;
    border-radius: 16px;
    border-bottom-left-radius: 0;
    word-wrap: break-word;
  }

  .user-message {
    .chat-message-foto {
      margin-left: 16px;
      margin-right: 0;
    }

    .chat-message-text {
      background: #2B3038;
      color: #FFFFFF;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16), 0 4px 6px rgba(0, 0, 0, 0.1);
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 0;
      font-weight: 300;
    }

    .chat-message-time {
      padding-left: 0;
      padding-right: 56px;
      text-align: right;
    }
  }
</style>
