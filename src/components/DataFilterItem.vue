<template>
  <v-btn color="secondary" large @click="select()" :value="any ? 'any' : value">
    <span v-if="label">{{ label }}</span>
    <v-avatar v-if="icon" size="30px">
      <Icon :name="icon" />
    </v-avatar>
  </v-btn>
</template>

<script>
import Icon from '@/components/Icon.vue';

export default {
  name: 'DataFilterItem',
  components: {
    Icon
  },
  props: {
    any: Boolean,
    value: [String, Number],
    icon: String,
    label: String
  },
  methods: {
    getFilter() {
      let parent = this.$parent;

      while (parent && parent.$options._componentTag !== 'DataFilter') {
        parent = parent.$parent;
      }

      return parent;
    },
    async select() {
      const filter = this.getFilter();

      await this.$store.dispatch(`${filter.store}/selectFilter`, {
        column: this.$parent.$parent.column,
        value: this.any ? '' : this.value
      });
    }
  }
};
</script>
