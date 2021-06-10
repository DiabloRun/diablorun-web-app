import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import leaderboard from './leaderboard';
import ladder from './ladder';
import app from './app';
import characters from './characters';
import race from './race';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    leaderboard,
    ladder,
    app,
    characters,
    race
  }
});
