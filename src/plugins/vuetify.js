import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    options: {
      customProperties: true
    },
    themes: {
      dark: {
        primary: '#ff6d00',
        secondary: '#fafafa',
        darker: '#1e1e1e',
        darkAccent: '#222222',
        accent: '#82B1FF',
        error: '#E53935',
        info: '#1E88E5',
        success: '#43A047',
        warning: '#FDD835',
        twitch: '#b9a3e3',
        discord: '#7289d9'
      }
    }
  }
});
