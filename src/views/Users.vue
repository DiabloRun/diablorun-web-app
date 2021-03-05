<template>
  <v-container>
    <v-row dense class="mt-5">
      <!-- Title -->
      <v-col class="mb-4">
        <h2>Active users</h2>
        <h2 v-if="activeUsers.length === 1" class="subtitle">
          {{ activeUsers.length }} person currently playing
        </h2>
        <h2 v-if="activeUsers.length > 1" class="subtitle">
          {{ activeUsers.length }} people currently playing
        </h2>
      </v-col>
      <!-- Empty error -->
      <v-col v-if="!activeUsers.length" cols="12">
        <v-alert
          text
          color="primary"
          class="ma-0 font-weight-medium text-center"
        >
          No one is currently playing with our technology
        </v-alert>
      </v-col>
      <!-- Userlist -->
      <v-col v-if="activeUsers.length" cols="12">
        <v-row dense>
          <v-col
            v-for="user of activeUsers"
            :key="user.id"
            cols="12"
            md="4"
            lg="3"
          >
            <v-card
              hover
              :to="{
                name: 'Character',
                params: {
                  user_name: user.user_name,
                  character_slug: '@'
                }
              }"
            >
              <v-row no-gutters align="center">
                <v-col>
                  <v-card-title>
                    <router-link
                      :to="{
                        name: 'Character',
                        params: {
                          user_name: user.user_name,
                          character_slug: '@'
                        }
                      }"
                    >
                      {{ user.user_name }}
                    </router-link>
                  </v-card-title>
                  <v-card-subtitle>
                    Level {{ user.level }}
                    {{ user.hero | HeroNameFilter }}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="auto">
                  <v-avatar size="64" class="mr-3">
                    <v-img :src="user.user_profile_image_url"></v-img>
                  </v-avatar>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
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
