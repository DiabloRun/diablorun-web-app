import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      dark: {
        secondary: '#0f0d27',

        primary: '#8f0d27',
        primaryDark: '#1d1312',
        error: '#e53935',
        info: '#1E88E5',
        success: '#c0ca33',
        warning: '#fdd835',
        accent: '#82B1FF',
        app: '#1e1e1e',
        appIcon: '#1e1e1e',
        darker: '#121212',
        darkAccent: '#222222',
        twitch: '#b9a3e3',
        discord: '#7289d9'

        /*
        sor: '#26A69A',
        nec: '#00BCD4',
        ama: '#FFD54F',
        dru: '#FF8A65',
        asn: '#ae4ebe',
        pal: '#E0E0E0',
        bar: '#e57373'
        */
      }
    },
    dark: true
  }
});
