<template>
  <v-avatar size="24" class="mr-2">
    <v-img contain :src="icons[`./${code}.svg`]" />
  </v-avatar>
</template>

<script>
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
      icons
    };
  }
};
</script>
