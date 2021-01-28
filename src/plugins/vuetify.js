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
        primary: '#ff6d00',
        app: '#1e1e1e',
        appIcon: '#1e1e1e',
        darker: '#1e1e1e',
        darkAccent: '#222222',
        accent: '#82B1FF',
        error: '#E53935',
        info: '#1E88E5',
        success: '#43A047',
        warning: '#FDD835',
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
      },
    },
    dark: true,
  }
});
