import Vue from 'vue';
import VueRouter from 'vue-router';
import BlogRouter from './wiki';
import Race from '@/views/Race.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/wiki',
    name: 'Wiki',
    component: () => import(/* webpackChunkName: "blog" */ '../views/Wiki.vue')
  },
  ...BlogRouter,
  {
    path: '/board',
    name: 'Leaderboard',
    component: () =>
      import(/* webpackChunkName: "leaderboard" */ '../views/Leaderboard.vue')
  },
  {
    path: '/ladder',
    name: 'Ladder',
    component: () =>
      import(/* webpackChunkName: "leaderboard" */ '../views/Ladder.vue')
  },
  {
    path: '/bounties',
    name: 'Bounties',
    component: () =>
      import(/* webpackChunkName: "bounties" */ '../views/Bounties.vue')
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import(/* webpackChunkName: "team" */ '../views/Team.vue')
  },
  {
    path: '/setup',
    name: 'Interface Setup',
    component: () =>
      import(/* webpackChunkName: "setup" */ '../views/Profile.vue')
  },
  {
    path: '/Bot',
    name: 'Bot',
    component: () => import(/* webpackChunkName: "setup" */ '../views/Bot.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () =>
      import(/* webpackChunkName: "setup" */ '../views/Profile.vue')
  },
  {
    path: '/profile/patreon',
    name: 'Patreon',
    component: () =>
      import(/* webpackChunkName: "setup" */ '../views/Patreon.vue')
  },
  {
    path: '/race-editor/:editor_token',
    name: 'Race Editor',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/RaceEditor.vue')
  },
  {
    path: '/race/:slug',
    name: 'Race',
    component: Race
  },
  /*
  {
    path: '/races',
    name: 'Races',
    component: () =>
      import(/* webpackChunkName: "races" * '../views/Races.vue')
  },
  */
  {
    path: '/users',
    name: 'Users',
    component: () =>
      import(/* webpackChunkName: "leaderboard" */ '../views/Users.vue')
  },
  {
    path: '/table/*',
    name: 'Table',
    component: () =>
      import(/* webpackChunkName: "table" */ '../views/Table.vue')
  },
  {
    path: '/:user_name',
    name: 'User',
    component: () =>
      import(/* webpackChunkName: "leaderboard" */ '../views/User.vue')
  },
  {
    path: '/:user_name/:character_slug',
    name: 'Character',
    component: () =>
      import(/* webpackChunkName: "leaderboard" */ '../views/Character.vue')
  },
  {
    path: '/:user_name/:character_slug/statistics',
    name: 'Character Statistics',
    component: () =>
      import(
        /* webpackChunkName: "leaderboard" */ '../views/CharacterStatistics.vue'
      )
  }
];

const router = new VueRouter({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, _from, next) => {
  if (to.params.character_slug && to.params.character_slug !== '@') {
    document.title = `${to.params.character_slug} - diablo.run`;
  } else if (to.params.user_name) {
    document.title = `${to.params.user_name} - diablo.run`;
  } else {
    document.title = `${to.name} - diablo.run`;
  }

  next();
});

export default router;
