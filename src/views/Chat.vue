<template>
  <div class="blocked-wrap">
    <div style="position: relative">
      <div class="chat">
        <MessageItem
                v-for="message in messagesByChatId($route.params.id).slice().reverse()"
                :key="message.id"
                v-bind:class="{'user-message': message.data.self}"
                :message="message"
        >
        </MessageItem>
        <div class="no-messages"
             v-if="messagesByChatId($route.params.id).length === 0"
        >
          start chat with {{chatNameByChatId($route.params.id)}}
        </div>
      </div>
    </div>
    <div class="chat-form">
      <form action="">
        <div class="textarea-wrap">
          <textarea placeholder="Text"
                    v-model="message"
                    @keyup.enter.exact="onSendMessage"
          >
          </textarea>
        </div>
        <div class="textarea-count-wrap">
          <div class="checkbox-wrap">
            <label>Press Enter to send, Shift+Enter for new line</label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import vue from 'vue';
import store from '@/store';
import { mapActions, mapGetters } from 'vuex';
import router from '../router';
import MessageItem from '@/components/MessageItem.vue';

export default vue.extend({
  store,
  router,
  components: {
    MessageItem,
  },
  computed: {
    ...mapGetters([
      'messagesByChatId',
      'logoByChatId',
      'chatNameByChatId',
    ]),
  },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    ...mapActions([
      'sendMessage',
    ]),
    onSendMessage(): void {
      const parsedMsg = this.trimText(this.message);
      if (parsedMsg === '') {
        this.message = parsedMsg;
        return;
      }
      this.sendMessage({
        id: `${Date.now()}`,
        data: {
          text: parsedMsg,
          createdAt: Date.now(),
          self: true,
        },
        chatId: this.$route.params.id,
      });
      this.message = '';
    },
    trimText(text: string): string {
      return text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').replace(/(<([^>]+)>)/ig, '').replace(/\n/g, '<br />');
    },
  },
});
</script>

<style lang="scss" scoped>
  .chat-block {
    flex-grow: 1;
    min-width: 680px;
    max-width: 680px;
  }

  .blocked-wrap {
    position: relative;
  }

  .chat {
    background: linear-gradient(0.08deg, #607D8B 0.09%, #90A4AE 99.95%);
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    max-width: 100%;
    height: 450px;
    padding: 36px 24px 24px;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;
    border-bottom: 2px solid #F2F2F2;
    border-top: 2px solid #F2F2F2;

    &:after {
      content: '';
      display: block;
      height: 36px;
      width: 100%;
      min-height: 8px;
    }
  }

  .no-messages {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }

  .chat-form {
    padding: 22px 16px 16px;

    .textarea-wrap {
      margin-bottom: 16px;

      textarea {
        height: 163px;
      }
    }

    .checkbox-wrap {

      label {
        font-weight: 400;
      }
    }
  }

  .textarea-count-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .chat-form-btn {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 24px 16px 16px 16px;
    background: #FAFAFA;

    .main-btn:last-child {
      margin-right: 0;
    }
  }

</style>
