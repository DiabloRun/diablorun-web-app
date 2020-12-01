<template>
  <span :class="{ 'title is-4': !tag, 'tag is-large': tag, 'has-text-success': status === 'started', 'has-text-danger': status === 'starting', 'has-text-danger': status === 'finished' }">
    <audio ref="hostile">
      <source src="https://diablo.run/static/audio/hostile.wav" type="audio/wav">
    </audio>
    <audio ref="whip1">
      <source src="https://diablo.run/static/audio/overseer/whip1.wav" type="audio/wav">
    </audio>
    <audio ref="whipcrack1">
      <source src="https://diablo.run/static/audio/overseer/whipcrack1.wav" type="audio/wav">
    </audio>
    <audio ref="whip2">
      <source src="https://diablo.run/static/audio/overseer/whip2.wav" type="audio/wav">
    </audio>
    <audio ref="whipcrack2">
      <source src="https://diablo.run/static/audio/overseer/whipcrack2.wav" type="audio/wav">
    </audio>
    <audio ref="whip3">
      <source src="https://diablo.run/static/audio/overseer/whip3.wav" type="audio/wav">
    </audio>
    <audio ref="whipcrack3">
      <source src="https://diablo.run/static/audio/overseer/whipcrack3.wav" type="audio/wav">
    </audio>
    <span v-if="status === ''">
      Race hasn't started yet
    </span>
    <span v-if="status === 'starting'">
      The race is starting in {{ duration }}
    </span>
    <span v-if="status === 'started'">
      <span v-if="!duration">Race started</span>
      <span v-if="duration">{{ duration }}</span>
    </span>
    <span v-if="status === 'finished'">
      Race finished
    </span>
  </span>
</template>

<script>
import moment from 'moment';
import 'moment-duration-format';

export default {
  name: 'RaceCountdown',
  props: {
    tag: {
      type: Boolean,
      default: false
    },
    start: Number,
    finish: Number
  },
  data() {
    return {
      interval: null,
      status: '',
      seconds: null,
      duration: ''
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
      const time = Math.floor((new Date().getTime() + this.$store.state.ws.timeOffset) / 1000);
      const prevStatus = this.status;

      if (this.start && this.finish && time > this.finish) {
        this.status = 'finished';
        this.seconds = null;
      } else if (this.start && time > (this.start + 1)) {
        this.status = 'started';
        this.seconds = time - this.start; //this.finish ? (this.finish - time) : null;
      } else if (this.start) {
        this.status = 'starting';
        this.seconds = this.start + 1 - time;

        switch (this.seconds) {
          case 5:
            this.$refs.whip1.volume = 0.4;
            this.$refs.whip1.play();
            break;
          case 4:
            this.$refs.whipcrack1.volume = 0.4;
            this.$refs.whipcrack1.play();
            break;
          case 3:
            this.$refs.whip2.volume = 0.4;
            this.$refs.whip2.play();
            break;
          case 2:
            this.$refs.whipcrack2.volume = 0.4;
            this.$refs.whipcrack2.play();
            break;
          case 1:
            this.$refs.whip3.volume = 0.4;
            this.$refs.whip3.play();
            break;
        }
      } else {
        this.status = '';
        this.seconds = null;
      }

      if (this.seconds !== null) {
        this.duration = moment.duration(this.seconds, 'seconds').format('hh:mm:ss');
      } else {
        this.duration = '';
      }

      if (prevStatus === 'starting' && this.status === 'started') {
        this.$refs.hostile.volume = 0.4;
        this.$refs.hostile.play();
      }
    }
  }
}
</script>
