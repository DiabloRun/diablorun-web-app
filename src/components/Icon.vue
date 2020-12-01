<template>
  <img :class="imgClass" :src="icons[`./${name}.png`]">
</template>

<script>
const icons = {};
const modules = require.context('@/assets/img/icons', true);

for (const key of modules.keys()) {
  icons[key] = modules(key);
}

export default {
  name: 'Icon',
  props: {
    name: String,
    imgClass: String
  },
  data() {
    return {
      icons
    };
  }
}
</script>
