<template>
  <v-img :src="icons[`./${name}.png`]">
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          size="18"
          width="2"
          color="primary"
        ></v-progress-circular>
      </v-row>
    </template>
  </v-img>
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
};
</script>
