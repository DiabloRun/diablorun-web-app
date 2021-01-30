<template>
  <v-img contain :src="icons[`./${code}.svg`]" />
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
