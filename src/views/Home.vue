<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-icon left>mdi-trophy-outline</v-icon>
            Recently submitted speedruns
          </v-card-title>
          <v-divider></v-divider>
          <v-simple-table dense>
            <thead>
              <tr>
                <th>#</th>
                <th>Runner</th>
                <th>Time</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="run of latestSpeedruns" :key="run.id">
                <td>{{ run.category_rank }}</td>
                <td>
                  <a
                    v-if="!run.user_id"
                    :style="`color: ${run.speedrun_user_dark_color_from};`"
                    :href="run.speedrun_user_weblink"
                    target="_blank"
                  >
                    {{ run.speedrun_user_name }}
                  </a>
                  <router-link
                    v-if="run.user_id"
                    :to="{
                      name: 'User',
                      params: { user_name: run.user_name }
                    }"
                    :style="
                      `color: ${run.user_color ||
                        run.speedrun_user_dark_color_from};`
                    "
                  >
                    {{ run.user_name }}
                  </router-link>
                </td>
                <td>{{ run.seconds_played | DurationFilter }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'Leaderboard',
                      hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                        run.hero
                      }/${run.players_category}`
                    }"
                  >
                    {{ run.category_name }}
                    <span :class="`has-hero ${run.hero}`">
                      {{ run.hero }}
                    </span>
                    <span v-if="!run.hc"> SC</span>
                    <span v-if="run.hc">HC</span>
                    {{ run.players_category }}
                  </router-link>
                </td>
                <td>{{ run.submit_time | FromNowFilter }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            <v-icon left color="yellow accent-4">mdi-trophy</v-icon>
            Fresh world records
          </v-card-title>
          <v-divider></v-divider>
          <v-simple-table dense>
            <thead>
              <tr>
                <th>#</th>
                <th>Runner</th>
                <th>Time</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="run of latestSpeedruns" :key="run.id">
                <td>{{ run.category_rank }}</td>
                <td>
                  <a
                    v-if="!run.user_id"
                    :style="`color: ${run.speedrun_user_dark_color_from};`"
                    :href="run.speedrun_user_weblink"
                    target="_blank"
                  >
                    {{ run.speedrun_user_name }}
                  </a>
                  <router-link
                    v-if="run.user_id"
                    :to="{
                      name: 'User',
                      params: { user_name: run.user_name }
                    }"
                    :style="
                      `color: ${run.user_color ||
                        run.speedrun_user_dark_color_from};`
                    "
                  >
                    {{ run.user_name }}
                  </router-link>
                </td>
                <td>{{ run.seconds_played | DurationFilter }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'Leaderboard',
                      hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                        run.hero
                      }/${run.players_category}`
                    }"
                  >
                    {{ run.category_name }}
                    <span :class="`has-hero ${run.hero}`">
                      {{ run.hero }}
                    </span>
                    <span v-if="!run.hc"> SC</span>
                    <span v-if="run.hc">HC</span>
                    {{ run.players_category }}
                  </router-link>
                </td>
                <td>{{ run.submit_time | FromNowFilter }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pt-3">
      <v-col>
        <v-card>
          <v-card-title>
            <v-icon left>mdi-medal</v-icon>
            Runners with most records
          </v-card-title>
          <v-divider></v-divider>
          <v-simple-table dense>
            <thead>
              <tr>
                <th>#</th>
                <th>Runner</th>
                <th>
                  <v-icon small left color="yellow accent-4">mdi-trophy</v-icon
                  >Gold
                </th>
                <th>
                  <v-icon small left color="grey lighten-1">mdi-trophy</v-icon
                  >Silver
                </th>
                <th>
                  <v-icon small left color="brown">mdi-trophy</v-icon>Bronze
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="runner of mostMedals" :key="runner.speedrun_user_id">
                <td>{{ runner.rank }}</td>
                <td>
                  <a
                    v-if="!runner.user_id"
                    :style="`color: ${runner.speedrun_user_dark_color_from};`"
                    :href="runner.speedrun_user_weblink"
                    target="_blank"
                  >
                    {{ runner.speedrun_user_name }}
                  </a>
                  <router-link
                    v-if="runner.user_id"
                    :to="{
                      name: 'User',
                      params: { user_name: runner.user_name }
                    }"
                    :style="
                      `color: ${runner.user_color ||
                        runner.speedrun_user_dark_color_from};`
                    "
                  >
                    {{ runner.user_name }}
                  </router-link>
                </td>
                <td>
                  {{ runner.gold }}
                </td>
                <td>
                  {{ runner.silver }}
                </td>
                <td>
                  {{ runner.bronze }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { HeroNameFilter } from '@/filters';
import { FromNowFilter } from '@/filters';
import { DurationFilter } from '@/filters';
// import CountryIcon from '@/components/CountryIcon.vue';
// import BlogPostBox from '@/components/BlogPostBox.vue';
import blog from '@/router/wiki.js';

export default {
  filters: {
    HeroNameFilter,
    FromNowFilter,
    DurationFilter
  },
  components: {
    // CountryIcon,
    // BlogPostBox
  },
  name: 'Home',
  data() {
    return {
      latestSpeedruns: [],
      latestRecords: [],
      latestPost: blog[0],
      mostMedals: []
    };
  },
  async mounted() {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/home`);
    const data = await res.json();
    console.log(data);
    this.latestSpeedruns = data.latestSpeedruns;
    this.latestRecords = data.latestRecords;
    this.mostMedals = data.mostMedals;
  }
};
</script>
