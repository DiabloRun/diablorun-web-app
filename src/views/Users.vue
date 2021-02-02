<template>
  <v-container class="pa-2">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Active users
          </v-card-title>
          <v-card-subtitle v-if="activeUsers.length === 1">
            {{ activeUsers.length }} person currently playing
          </v-card-subtitle>
          <v-card-subtitle v-if="activeUsers.length > 1">
            {{ activeUsers.length }} people currently playing
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-container
            v-if="!activeUsers.length"
            class="pa-2 font-weight-medium"
          >
            <v-alert class="mb-0" border="left" text color="primary">
              <v-icon left color="primary">mdi-emoticon-sad-outline</v-icon>
              No one is currently playing with our technology. Try finding some
              Diablo players from
              <a
                href="https://www.twitch.tv/directory/game/Diablo%20II"
                target="_blank"
                >Twitch</a
              >.
            </v-alert>
          </v-container>
          <v-row dense v-if="activeUsers.length" class="px-2 pt-2 pb-1">
            <v-col
              v-for="user of activeUsers"
              :key="user.id"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card
                hover
                color="darkAccent"
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
                    <router-link
                      :to="{
                        name: 'Character',
                        params: {
                          user_name: user.user_name,
                          character_slug: '@'
                        }
                      }"
                    >
                      <v-avatar size="64" class="mr-2">
                        <v-img :src="user.user_profile_image_url"></v-img>
                      </v-avatar>
                    </router-link>
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
