import vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import Home from './views/Home.vue';
import NotFound from './views/NotFound.vue';

vue.use(VueRouter);

const router: VueRouter = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('./views/Chat.vue'),
      beforeEnter: async (to, from, next) => {
        const isExistingPage = store.state.chatsList.find(x => x.id === to.params.id);
        if (isExistingPage) {
          next();
        } else {
          next({ name: 'not-found' });
        }
      },
    },
    { path: '*', name: 'not-found', component: NotFound },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (store.state.chatsList.length === 0) {
    await store.dispatch('getChatsList');
  }
  next();
});

export default router;
