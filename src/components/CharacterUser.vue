<template>
  <span>
    <CountryIcon imgClass="flag" :code="character.user_country_code" />
    <router-link
      :style="`color: ${character.user_color};`"
      :to="`/${character.user_name}/${character.name}${character.id}`"
    >
      {{ character.user_name }}
    </router-link>
  </span>
</template>

<script>
import CountryIcon from '@/components/CountryIcon.vue';

export default {
  name: 'CharacterUser',
  props: {
    character: Object
  },
  components: {
    CountryIcon
  }
};
</script>
