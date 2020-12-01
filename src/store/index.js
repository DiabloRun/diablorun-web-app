import Vue from 'vue';
import Vuex from 'vuex';
import ws from './ws';
import auth from './auth';
import leaderboard from './leaderboard';
import app from './app';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    ws,
    auth,
    leaderboard,
    app
  }
});
