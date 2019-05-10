<template>
  <main class="main">
    <div class="container">
      <div class="row">
        <div class="col-9">
          <div class="chat-wrap">
            <div class="contacts-wrap">
              <div class="contact">
                <router-link v-for="chat in chatsList" :to="`/chat/${chat.id}`" class="contact-user" active-class="active">
                    <div class="contact-user-foto online">
                      <a href=""><img :src="chat.data.chat_img_url" alt=""></a>
                    </div>
                    <div class="contact-user-info">
                      <div class="contact-user-top">
                        <a href="" class="contact-user-name">
                          {{chat.data.chat_name}}
                        </a>
                      </div>
                    </div>
                </router-link>
              </div>
            </div>
            <div class="chat-block">
              <router-view/>
            </div>
          </div>
        </div>
        <div class="col-3" style="color: white;">
          <img src="https://static.wixstatic.com/media/803fd3_60fb86fb945a4b7bab2d88f9624fbac5~mv2.png/v1/fill/w_586,h_114,al_c,q_80,usm_0.66_1.00_0.01/803fd3_60fb86fb945a4b7bab2d88f9624fbac5~mv2.webp" alt="" style="width: 100%; padding: 5px">
          Тестовое задание на позицию: <br>
          <b style="float:right">Middle Frontend Developer</b>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import vue from 'vue';
import { mapGetters } from 'vuex';

export default vue.extend({
  computed: {
    ...mapGetters([
      'chatsList',
    ]),
  },
});
</script>

<style lang="scss" scoped>
@import './assets/styles/bootstrap-reboot.css';
@import './assets/styles/style.css';

.chat-wrap {
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24);
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.contacts-wrap {
  width: 240px;
  min-width: 240px;
  overflow: hidden;
}

.contact {
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 60px;
  position: relative;
  height: 683px;
}

.contact-user {
  padding: 16px 8px 16px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: .2s all linear;
}

.contact-user:hover {
  background-color: #F5F5F5;
  transition: .2s all linear;
  text-decoration: none;
}

.contact-user.active {
  background-color: #F5F5F5;
}

.contact-user-foto {
  width: 40px;
  height: 40px;
  min-width: 40px;
  margin-right: 8px;
  position: relative;
}

.contact-user-foto.online:after {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 6px;
  height: 6px;
  background-color: #04C01B;
  border-radius: 50px;
}

.contact-user-foto a {
  display: block;
  border: 2px solid #F0FAFF;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: #DDE5EB;
  overflow: hidden;
}

.contact-user-foto a img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-user-info {
  flex-grow: 1;
}

.contact-user-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

.contact-user-name {
  font-weight: 600;
  line-height: normal;
  font-size: 12px;
  color: #000000;
}

.contact-user-name:hover {
  text-decoration: none;
  color: #000000;
}

.contact-user-text {
  font-weight: 600;
  line-height: 21px;
  font-size: 12px;
  color: #8C8C8C;

  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-block {
  width: 100%;
}
</style>
