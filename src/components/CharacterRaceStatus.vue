<template>
  <div>
    <v-icon v-if="status === 'ready'" color="success">mdi-account-check</v-icon>
    <v-icon v-if="status === 'disqualified'" color="warning"
      >mdi-account-cancel</v-icon
    >
    <span v-if="status === 'finished'">
      <v-icon color="primary">mdi-flag-variant-outline</v-icon>
      {{ time }}
    </span>

    <v-icon v-if="status === 'dead'" color="error">mdi-skull-crossbones</v-icon>

    <span v-if="status === 'playing'">
      <v-icon small color="white">mdi-run-fast</v-icon>
      <span v-if="time !== null">{{ time }}</span>
    </span>
  </div>
</template>

<script>
import ws from '@/plugins/ws';
import { FromNowFilter, TrimmedDurationFilter } from '@/filters';

export default {
  name: 'CharacterRaceStatus',
  props: {
    race: Object,
    character: Object
  },
  filters: {
    FromNowFilter
  },
  data() {
    return {
      interval: null,
      status: '',
      finish_time_from_now: null,
      time_left: null,
      time: null
    };
  },
  mounted() {
    this.interval = setInterval(() => this.update(), 1000);
    this.update();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  watch: {
    race() {
      this.update();
    },
    character() {
      this.update();
    }
  },
  methods: {
    update() {
      if (this.character.disqualified) {
        this.status = 'disqualified';
        //clearInterval(this.interval);
        return;
      }

      const time = Math.floor(Date.now() / 1000 + ws.timeOffset);

      if (this.character.finish_time) {
        this.status = 'finished';
        //this.finish_time_from_now = FromNowFilter(finish + this.$store.state.ws.timeOffset / 1000);
        this.time = TrimmedDurationFilter(
          this.character.finish_time - this.race.start_time
        );
        //clearInterval(this.interval);
      } else if (this.character.hc && this.character.dead) {
        this.status = 'dead';
        //clearInterval(this.interval);
      } else {
        this.status = 'playing';
        //this.time_left = finish ? TrimmedDurationFilter(finish - time) : null;
        this.time = TrimmedDurationFilter(time - this.race.start_time);
      }

      if (this.race.type === 'points_chase') {
        this.time = this.character.points;
      }
    }
  }
};
</script>
