<template>
  <li class="tab" :class="{ 'is-active': any ? ($parent.value === '') : (value === $parent.value) }">
    <a @click="select()">
      <span v-if="label">{{ label }}</span>
      <span v-if="icon" class="icon">
        <Icon imgClass="is-rounded-slightly" :name="icon" />
      </span>
    </a>
  </li>
</template>

<script>
import Icon from '@/components/Icon.vue';

export default {
  name: 'LeaderboardFilterItem',
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
    async select() {
      await this.$store.dispatch('leaderboard/selectFilter', {
        column: this.$parent.column,
        value: this.any ? '' : this.value
      });
    }
  }
}
</script>
