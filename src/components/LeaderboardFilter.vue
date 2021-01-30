<template>
  <v-btn-toggle borderless :value="value">
    <slot />
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'LeaderboardFilter',
  props: {
    column: String
  },
  computed: {
    value() {
      return this.$store.state.leaderboard.filters[this.column] === ''
        ? 'any'
        : this.$store.state.leaderboard.filters[this.column];
    }
  }
};
</script>
