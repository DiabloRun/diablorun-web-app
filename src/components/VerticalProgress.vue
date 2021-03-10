<template>
  <div v-bind:style="wrapper" class="ovh bdrs50p wct">
    <div v-bind:style="progress" class="wct"></div>
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
      default: 64
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
        transition: 'transform 1s'
      };
    },
    wrapper() {
      return {
        borderWidth: '3px',
        borderStyle: 'solid',
        width: this.size + 'px',
        height: this.size + 'px',
        borderColor: this.$vuetify.theme.themes.dark.secondary
      };
    }
  }
};
</script>
