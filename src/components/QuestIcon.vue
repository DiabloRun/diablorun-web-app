<template>
  <img :class="imgClass" :src="icons[`./${id}.png`]" />
</template>

<script>
const icons = {};
const modules = require.context('@/assets/img/quests', true);

for (const key of modules.keys()) {
  icons[key] = modules(key);
}

export default {
  name: 'QuestIcon',
  props: {
    id: [String, Number],
    imgClass: String
  },
  data() {
    return {
      icons
    };
  }
};
</script>
