<template>
  <span>
    <CountryIcon v-if="user.country_code" :code="user.country_code" />
    <router-link
      :to="{
        name: 'User',
        params: { user_name: user.name }
      }"
      :style="`color: ${user.color};`"
    >
      <strong>{{ user.name }}</strong>
    </router-link>
  </span>
</template>

<script>
import CountryIcon from '@/components/CountryIcon.vue';

export default {
  name: 'DiabloRunUser',
  props: {
    user: Object
  },
  components: {
    CountryIcon
  }
};
</script>
