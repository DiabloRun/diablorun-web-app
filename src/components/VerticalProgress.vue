<template>
  <div v-bind:style="wrapper">
    <div v-bind:style="progress"></div>
  </div>
</template>

<script>
export default {
  name: 'VerticalProgress',
  props: {
    total: {
      type: Number,
      default: 1,
      required: true
    },
    current: {
      type: Number,
      default: 0,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    size: {
      type: Number,
      default: 48
    }
  },
  data() {
    return {
      show: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.show = true;
    }, 300);
  },
  computed: {
    progress() {
      return {
        transform: this.show
          ? 'translateY(' + (1 - this.current / this.total) * 100 + '%)'
          : 'translateY(100%)',
        width: this.size + 'px',
        height: this.size + 'px',
        background: this.$vuetify.theme.themes.dark[this.color],
        transition: 'all 1s'
      };
    },
    wrapper() {
      return {
        borderRadius: '50%',
        borderWidth: '1px',
        borderStyle: 'solid',
        overflow: 'hidden',
        width: this.size + 'px',
        height: this.size + 'px',
        borderColor: this.$vuetify.theme.themes.dark[this.color]
      };
    }
  }
};
</script>
