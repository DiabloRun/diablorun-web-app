<template>
  <div class="tabs is-fullwidth is-toggle">
    <ul>
      <slot />
    </ul>
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
  },
}
</script>
