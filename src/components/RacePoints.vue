<template>
  <div>
    <p v-for="point of points" :key="point.id">
      <span
        class="subtitle is-5"
        :class="{
          'has-text-success': point.amount > 0,
          'has-text-warning': point.amount < 0
        }"
      >
        {{ point.amount > 0 ? '+' : '' }}{{ point.amount }}
      </span>
      <span v-if="point.type === 'quest'">
        <!-- <QuestIcon :id="point.quest_id" /> -->
        for {{ point.quest_id | QuestShortNameFilter }} quest in
        {{ point.difficulty | DifficultyFilter }}
        <span v-if="point.time_type === 'first'">
          first
        </span>
        <span v-if="point.time_type === 'in_under'">
          in under {{ point.time }}
        </span>
      </span>
      <span v-if="point.type === 'per'">
        per {{ point.counter }} {{ point.stat | StatNameFilter }}
        <span v-if="point.time_type === 'max'">(for max reached)</span>
      </span>
      <span v-if="point.type === 'for'">
        for reaching {{ point.counter }}
        {{ point.stat | StatNameFilter }}
        <span v-if="point.time_type === 'first'">first</span>
      </span>
    </p>
  </div>
</template>

<script>
import {
  DifficultyFilter,
  QuestNameFilter,
  QuestShortNameFilter,
  StatNameFilter
} from '@/filters';

export default {
  name: 'RacePoints',
  filters: {
    DifficultyFilter,
    QuestNameFilter,
    QuestShortNameFilter,
    StatNameFilter
  },
  props: {
    points: Array
  }
};
</script>
