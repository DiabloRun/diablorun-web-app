<template>
  <div class="columns">
    <div class="column">
      <input class="input" type="date" placeholder="Date" v-model="date" />
    </div>
    <div class="column">
      <input class="input" type="time" placeholder="Time" v-model="time" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'DateTimeInput',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ['value'],
  data() {
    return {
      date: '',
      time: ''
    };
  },
  watch: {
    date() {
      this.updateDateTime();
    },
    time() {
      this.updateDateTime();
    },
    value: {
      handler(value) {
        if (!value) {
          return;
        }

        const d = moment(value * 1000);
        this.date = d.format('YYYY-MM-DD');
        this.time = d.format('HH:mm');
      },
      immediate: true
    }
  },
  methods: {
    updateDateTime() {
      this.$emit(
        'change',
        Math.floor(
          new Date(`${this.date || ''} ${this.time || ''}`).getTime() / 1000
        )
      );
    }
  }
};
</script>
