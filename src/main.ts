import vue from 'vue';
import AppVue from './App.vue';
import router from './router';
import store from './store';

vue.config.productionTip = false;

new vue({
  router,
  store,
  render: h => h(AppVue),
}).$mount('#app');
