<template>
  <span>
    <v-icon v-if="status === 'ready'" color="success">mdi-account-check</v-icon>
    <v-icon v-if="status === 'disqualified'" color="warning"
      >mdi-account-cancel</v-icon
    >
    <v-icon v-if="status === 'playing'" small color="white"
      >mdi-run-fast</v-icon
    >
    <v-icon v-if="status === 'dead'" color="error">mdi-skull-crossbones</v-icon>
    <v-icon v-if="status === 'finished'" color="primary"
      >mdi-flag-variant-outline</v-icon
    >

    <span v-if="time !== null">
      {{ time }}

      <v-chip v-if="bonus < 0" color="success">
        {{ bonus }}
      </v-chip>
      <v-chip v-if="bonus > 0" color="error"> +{{ bonus }} </v-chip>
    </span>
  </span>
</template>

<script>
import ws from '@/plugins/ws';
import { TrimmedDurationFilter } from '@/filters';

export default {
  name: 'CharacterRaceStatus',
  props: {
    race: Object,
    character: Object
  },
  data() {
    return {
      interval: null,
      status: '',
      finish_time_from_now: null,
      time_left: null,
      time: null,
      bonus: 0
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

      const time = Math.floor((Date.now() + ws.timeOffset) / 1000);

      if (this.character.finish_time) {
        this.status = 'finished';
        //this.finish_time_from_now = FromNowFilter(finish + this.$store.state.ws.timeOffset / 1000);
        this.time = TrimmedDurationFilter(
          this.character.finish_time -
            this.race.start_time -
            this.character.points
        );
        //clearInterval(this.interval);
      } else if (this.character.hc && this.character.dead) {
        this.status = 'dead';
        //clearInterval(this.interval);
      } else {
        this.status = 'playing';
        //this.time_left = finish ? TrimmedDurationFilter(finish - time) : null;
        this.time = TrimmedDurationFilter(
          time - this.race.start_time - this.character.points
        );
      }

      if (this.race.type === 'points_chase') {
        this.time = this.character.points;
        this.bonus = 0;
      } else {
        this.bonus = -this.character.points;
      }
    }
  }
};
</script>
