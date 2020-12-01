<template>
  <img :class="imgClass" :src="icons[`./${code ? code.toUpperCase() : 'ZZZ'}.png`]">
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
}
</script>
