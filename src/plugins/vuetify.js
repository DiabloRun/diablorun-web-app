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
        primary: '#9276ed',
        secondary: '#252236',
        link: '#d3b8ae',

        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',

        error: '#ED9276',
        info: '#7695ED',
        success: '#76ED92',
        warning: '#fbc02d',
        danger: ''

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
