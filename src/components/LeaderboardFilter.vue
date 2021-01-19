<template>
  <div>
    <v-btn-toggle dense borderless>
      <slot />
    </v-btn-toggle>
  </div>
</template>

<script>
export default {
  name: 'LeaderboardFilter',
  props: {
    column: String
  },
  computed: {
    value() {
      return this.$store.state.leaderboard.filters[this.column];
    }
  }
};
</script>
