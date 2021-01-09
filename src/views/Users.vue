<template>
  <v-container class="pa-6">
    <v-card>
      <v-card-title>
        <v-icon left color="white">mdi-sword-cross</v-icon>
        Currently playing
      </v-card-title>
      <v-divider></v-divider>
      <v-row class="pa-6 pb-3">
        <v-col
          cols="12"
          md="6"
          lg="4"
          v-for="user of activeUsers"
          :key="user.id"
        >
          <v-card elevation="1" color="grey darken-4">
            <v-row no-gutters align="center">
              <v-col cols="auto" class="ml-3">
                <v-avatar size="64" v-if="user.user_profile_image_url !== ''">
                  <img :src="user.user_profile_image_url" alt="John" />
                </v-avatar>
                <v-avatar size="64" v-if="user.user_profile_image_url == ''">
                  <v-icon size="64" color="primary">
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
              </v-col>
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
                  Level {{ user.level }} {{ user.hero | HeroNameFilter }}
                </v-card-subtitle>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
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
