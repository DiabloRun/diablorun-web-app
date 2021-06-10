<template>
  <v-btn-toggle borderless :value="value">
    <slot />
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'DataFilter',
  props: {
    column: String,
    store: String
  },
  computed: {
    value() {
      return this.$store.state[this.store].filters[this.column] === ''
        ? 'any'
        : this.$store.state[this.store].filters[this.column];
    }
  }
};
</script>
