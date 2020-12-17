<template>
  <div id="twitch-embed"></div>
</template>

<script>
export default {
  props: {
    username: String
  },
  mounted() {
    // eslint-disable-next-line
    new Twitch.Embed('twitch-embed', {
      width: '100%',
      height: '700',
      channel: this.username
    });
  }
};
</script>
