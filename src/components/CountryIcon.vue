<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-avatar size="24" class="mr-2" v-bind="attrs" v-on="on">
        <v-img contain :src="icons[`./${code}.svg`]" />
      </v-avatar>
    </template>
    <span>{{ countryName }}</span>
  </v-tooltip>
</template>

<script>
import { countries } from '@diablorun/diablorun-data';

const icons = {};
const modules = require.context('@/assets/img/flags', true);

for (const key of modules.keys()) {
  icons[key] = modules(key);
}

export default {
  name: 'CountryIcon',
  props: {
    code: String,
    imgClass: String
  },
  data() {
    return {
      icons,
      countries
    };
  },
  computed: {
    countryName() {
      return countries[this.code.toUpperCase()];
    }
  }
};
</script>
