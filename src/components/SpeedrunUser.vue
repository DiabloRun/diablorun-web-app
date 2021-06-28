<template>
  <span>
    <CountryIcon :code="run.user_country_code" />
    <a
      v-if="!run.user_id"
      :style="`color: ${run.user_color};`"
      :href="run.speedrun_user_weblink"
      target="_blank"
    >
      {{ run.user_name }}
      <v-icon small color="grey">mdi-open-in-new</v-icon>
    </a>
    <router-link
      v-if="run.user_id"
      :to="{
        name: 'User',
        params: { user_name: run.user_name }
      }"
      :style="`color: ${run.user_color};`"
    >
      <strong>{{ run.user_name }}</strong>
    </router-link>
  </span>
</template>

<script>
import CountryIcon from '@/components/CountryIcon.vue';

export default {
  name: 'SpeedrunUser',
  props: {
    run: Object
  },
  components: {
    CountryIcon
  }
};
</script>
