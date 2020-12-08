<template>
  <div>
    <!-- Hero -->
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column">
              <h1 class="title is-2">Active Users</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Toolbar -->
    <section class="hero is-dark has-margin-bottom">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-multiline is-mobile">
            <div class="column">
              <h1 class="subtitle is-4">
                Users that are currently playing the game
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div v-for="user of activeUsers" :key="user.id" class="column is-4">
            <div class="box">
              <router-link
                :to="{
                  name: 'Character',
                  params: {
                    user_name: user.user_name,
                    character_slug: '@'
                  }
                }"
              >
                <div class="columns is-vcentered">
                  <div
                    v-if="user.user_profile_image_url !== ''"
                    class="column is-narrow"
                  >
                    <figure class="image is-48x48">
                      <img
                        :src="user.user_profile_image_url"
                        class="is-rounded"
                      />
                    </figure>
                  </div>
                  <div class="column">
                    <h1 class="title">{{ user.user_name }}</h1>
                    <h1 class="subtitle">
                      Level {{ user.level }} {{ user.hero | HeroNameFilter }}
                    </h1>
                  </div>
                </div>
              </router-link>
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
