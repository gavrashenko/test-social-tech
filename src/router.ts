import vue from 'vue';
import vueRouter from 'vue-router';
import HomeVue from './views/Home.vue';
import store from './store';
import NotFoundVue from './views/NotFound.vue';
import { Route, VueRouter } from 'vue-router/types/router';

vue.use(vueRouter);

const router: VueRouter = new vueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeVue,
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('./views/Chat.vue'),
      beforeEnter: async (to: Route, from: Route, next: Function) => {
        const isExistingPage = store.state.chatsList.find(x => x.id === to.params.id);
        if (isExistingPage) {
          next();
        } else {
          next({ name: 'not-found' });
        }
      },
    },
    { path: '*', name: 'not-found', component: NotFoundVue },
  ],
});

router.beforeEach(async (to: Route, from: Route, next: Function) => {
  if (store.state.chatsList.length === 0) {
    await store.dispatch('getChatsList');
  }
  next();
});

export default router;
