<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-account-group-outline</v-icon>
            Active users
          </v-card-title>
          <v-card-subtitle v-if="activeUsers.length > 0">
            {{ activeUsers.length }} people currently playing
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text v-if="!activeUsers.length > 0">
            <v-icon left color="primary">mdi-emoticon-sad-outline</v-icon>
            No one is currently playing with our technology. Try finding some
            Diablo players from
            <a
              href="https://www.twitch.tv/directory/game/Diablo%20II"
              target="_blank"
              >Twitch</a
            >.
          </v-card-text>
          <v-row no-gutters v-if="activeUsers.length > 0" class="px-2 pb-4">
            <v-col
              v-for="user of activeUsers"
              :key="user.id"
              cols="12"
              md="6"
              lg="4"
              class="px-2 pt-4"
            >
              <v-card color="darkAccent">
                <v-row no-gutters align="center">
                  <v-col cols="auto" class="ml-3">
                    <v-avatar size="64">
                      <v-img
                        v-if="user.profile_image_url !== ''"
                        :src="user.user_profile_image_url"
                      ></v-img>
                      <v-icon
                        v-if="user.user_profile_image_url == ''"
                        size="64"
                        color="grey"
                      >
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
                      <v-icon small :class="`${user.hero}`">mdi-sword</v-icon>
                      Level {{ user.level }}
                      {{ user.hero | HeroNameFilter }}
                    </v-card-subtitle>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
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
