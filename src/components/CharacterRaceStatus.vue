<template>
  <div>
    <v-icon v-if="status === 'ready'" color="success">mdi-account-check</v-icon>
    <v-icon v-if="status === 'disqualified'" color="warning"
      >mdi-account-cancel</v-icon
    >
    <v-icon v-if="status === 'finished'" color="primary"
      >mdi-flag-variant-outline</v-icon
    >
    <v-icon v-if="status === 'dead'" color="error">mdi-skull-crossbones</v-icon>
    <span v-if="status === 'playing'">
      <v-icon small color="white">mdi-run-fast</v-icon>
      <span v-if="time_left !== null">{{ time_left }}</span>
    </span>
  </div>
</template>

<script>
import { FromNowFilter, TrimmedDurationFilter } from '@/filters';

export default {
  name: 'CharacterRaceStatus',
  props: {
    character: Object,
    start: Number,
    finish: Number
  },
  filters: {
    FromNowFilter
  },
  data() {
    return {
      interval: null,
      status: '',
      finish_time_from_now: null,
      time_left: null
    };
  },
  mounted() {
    this.interval = setInterval(() => this.update(), 1000);
    this.update();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    update() {
      if (this.character.disqualified) {
        this.status = 'disqualified';
        return;
      }

      const time = Math.floor(
        (new Date().getTime() + this.$store.state.ws.timeOffset) / 1000
      );

      if (!this.start || time <= this.start) {
        this.status = 'ready';
        return;
      }

      const finish = this.character.finish_time || this.finish;
      const prevStatus = this.status;

      if (finish && time > finish) {
        this.status = 'finished';
        this.finish_time_from_now = FromNowFilter(
          finish + this.$store.state.ws.timeOffset / 1000
        );
      } else if (this.character.hc && this.character.dead) {
        this.status = 'dead';
      } else {
        this.status = 'playing';
        this.time_left = finish ? TrimmedDurationFilter(finish - time) : null;
      }

      if (
        prevStatus !== 'finished' &&
        this.status === 'finished' &&
        !this.character.is_finished &&
        this.character.finish_time !== this.finish
      ) {
        this.character.is_finished = true;
        this.$store.dispatch('ws/updateRace', {
          characters: [
            {
              id: this.character.id,
              user_id: this.character.user_id,
              is_finished: true
            }
          ],
          notifications: []
        });
      }
    }
  }
};
</script>
