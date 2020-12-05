<template>
  <div v-if="character">
    <p>
      <span class="subtitle"><CharacterUser :character="character"/></span>
      <span v-if="notification.type === 'start'">
        joined the race
      </span>
      <span v-if="notification.type === 'finish'">
        finished the race
      </span>
      <span v-if="notification.type === 'disqualify'">
        was disqualified
      </span>
      <span v-if="notification.type === 'claim'">
        got {{ notification.points }} points for
        <span v-if="rule.type === 'quest'">
          {{ rule.quest_id | QuestShortNameFilter }}
        </span>
        <span v-if="rule.type === 'for'">
          {{ rule.counter }} {{ rule.stat | StatNameFilter }}
        </span>
      </span>
      <span v-if="notification.type === 'lose'">
        lost {{ -notification.points }} points for going below
        {{ rule.counter }} {{ rule.stat | StatNameFilter }}
      </span>
      <span class="has-text-fade">{{ timeFromNow }}</span>
    </p>
  </div>
</template>

<script>
import { FromNowFilter, QuestShortNameFilter, StatNameFilter } from '@/filters';
import CharacterUser from '@/components/CharacterUser.vue';

export default {
  name: 'RaceNotification',
  props: {
    index: Number,
    notification: Object,
    rules: Array,
    characters: Array
  },
  filters: {
    QuestShortNameFilter,
    StatNameFilter
  },
  components: {
    CharacterUser
  },
  data() {
    return {
      interval: null,
      character: {},
      rule: {},
      timeFromNow: ''
    };
  },
  created() {
    this.character = this.characters.find(
      character => character.id === this.notification.character_id
    );

    this.rule = this.rules.find(rule => rule.id === this.notification.rule_id);
  },
  mounted() {
    this.interval = setInterval(() => this.update(), 60000);
    this.update();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    update() {
      this.timeFromNow = FromNowFilter(
        this.notification.time + this.$store.state.ws.timeOffset / 1000
      );
    }
  }
};
</script>
