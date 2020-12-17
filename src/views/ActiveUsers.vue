<template>
  <div>
    <!-- Hero -->
    <section class="hero is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Currently active players</h1>
        </div>
      </div>
    </section>
    <!-- Userlist -->
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div
            v-for="user of activeUsers"
            :key="user.id"
            class="column is-4-desktop is-6-tablet is-full-mobile"
          >
            <div class="box">
              <div class="columns is-vcentered is-mobile">
                <div
                  v-if="user.user_profile_image_url !== ''"
                  class="column is-narrow"
                >
                  <router-link
                    :to="{
                      name: 'Character',
                      params: {
                        user_name: user.user_name,
                        character_slug: '@'
                      }
                    }"
                  >
                    <figure class="image is-48x48">
                      <img
                        :src="user.user_profile_image_url"
                        class="is-rounded"
                      />
                    </figure>
                  </router-link>
                </div>
                <div class="column">
                  <h2 class="title is-5">
                    <router-link
                      :to="{
                        name: 'Character',
                        params: {
                          user_name: user.user_name,
                          character_slug: '@'
                        }
                      }"
                      >{{ user.user_name }}
                    </router-link>
                  </h2>
                  <h1 class="subtitle is-6">
                    <span class="has-text-grey">Level {{ user.level }} </span>
                    <span :class="`has-hero ${user.hero}`">{{
                      user.hero | HeroNameFilter
                    }}</span>
                  </h1>
                </div>
                <div
                  class="column is-narrow has-tooltip-left"
                  :data-tooltip="user.user_name + ' on Twitch'"
                >
                  <figure class="image is-24x24">
                    <a
                      :href="`https://twitch.com/${user.user_name}`"
                      target="_blank"
                    >
                      <img src="@/assets/img/icons/TwitchGlitchWhite.svg" />
                    </a>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { HeroNameFilter } from '@/filters';

export default {
  filters: {
    HeroNameFilter
  },
  name: 'ActiveUsers',
  data() {
    return {
      activeUsers: []
    };
  },
  async mounted() {
    await this.pullActiveUsers();
    this.interval = setInterval(() => this.pullActiveUsers(), 10000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async pullActiveUsers() {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/active-users`);
      this.activeUsers = await res.json();
      console.log(this.activeUsers);
    }
  }
};
</script>
