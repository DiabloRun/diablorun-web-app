import Vue from 'vue';
import App from './App.vue';
// import './registerServiceWorker';
import router from './router';
import store from './store';
import HighchartsVue from 'highcharts-vue';

Vue.use(HighchartsVue);

Vue.config.productionTip = false;

async function run() {
  const access_token = localStorage.getItem('diablorun_access_token');

  if (access_token) {
    await store.dispatch('auth/signIn', access_token);
  }

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
}

run();
