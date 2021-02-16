<template>
  <v-container fluid class="pa-2">
    <v-row dense>
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title> Recently submitted speedruns </v-card-title>
          <v-divider></v-divider>
          <v-simple-table dense class="text-no-wrap">
            <thead>
              <tr>
                <th>#</th>
                <th>Runner</th>
                <th>Time</th>
                <th>Category</th>
                <th>Hero</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="run of latestSpeedruns" :key="run.id">
                <td>
                  <span v-if="run.category_rank > 3" class="grey--text">{{
                    run.category_rank
                  }}</span>
                  <v-icon
                    v-if="run.category_rank == 1"
                    small
                    color="yellow accent-4"
                  >
                    mdi-trophy-outline
                  </v-icon>
                  <v-icon
                    v-if="run.category_rank == 2"
                    small
                    color="grey lighten-1"
                  >
                    mdi-trophy-outline
                  </v-icon>
                  <v-icon v-if="run.category_rank == 3" small color="brown">
                    mdi-trophy-outline
                  </v-icon>
                </td>
                <td>
                  <a
                    v-if="!run.user_id"
                    :style="`color: ${run.speedrun_user_dark_color_from};`"
                    :href="run.speedrun_user_weblink"
                    target="_blank"
                  >
                    {{ run.speedrun_user_name
                    }}<v-icon small right color="grey">mdi-open-in-new</v-icon>
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
                    <CountryIcon :code="run.speedrun_user_country_code" />
                    <strong>{{ run.user_name }}</strong>
                  </router-link>
                </td>
                <td>
                  <a :href="run.speedrun_link" target="_blank">
                    {{ run.seconds_played | DurationFilter }}
                  </a>
                </td>
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
                    <span v-if="!run.hc"> SC</span>
                    <span v-if="run.hc">HC</span>
                    {{ run.players_category }}
                  </router-link>
                </td>
                <td>
                  <v-icon v-if="!run.hc" small :class="`${run.hero}`">
                    mdi-sword
                  </v-icon>
                  <v-icon v-if="run.hc" small :class="`${run.hero}`">
                    mdi-skull-outline
                  </v-icon>
                  <span v-if="!run.character_id">
                    {{ run.hero | HeroNameFilter }}
                  </span>
                  <span v-if="run.character_id">
                    <router-link
                      :to="{
                        name: 'Character',
                        params: {
                          user_name: run.user_name,
                          character_slug: run.character_name + run.character_id
                        }
                      }"
                    >
                      {{ run.hero | HeroNameFilter }}
                    </router-link>
                  </span>
                </td>
                <td>{{ run.submit_time | FromNowFilter }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title> Fresh world records </v-card-title>
          <v-divider></v-divider>
          <v-simple-table dense class="text-no-wrap">
            <thead>
              <tr>
                <th>#</th>
                <th>Runner</th>
                <th>Time</th>
                <th>Category</th>
                <th>Hero</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="run of latestRecords" :key="run.id">
                <td>
                  <v-icon small color="yellow accent-4">
                    mdi-trophy-outline
                  </v-icon>
                </td>
                <td>
                  <a
                    v-if="!run.user_id"
                    :style="`color: ${run.speedrun_user_dark_color_from};`"
                    :href="run.speedrun_user_weblink"
                    target="_blank"
                  >
                    {{ run.speedrun_user_name
                    }}<v-icon small right color="grey">mdi-open-in-new</v-icon>
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
                    <CountryIcon :code="run.speedrun_user_country_code" />
                    <strong>{{ run.user_name }}</strong>
                  </router-link>
                </td>
                <td>
                  <a :href="run.speedrun_link" target="_blank">
                    {{ run.seconds_played | DurationFilter }}
                  </a>
                </td>
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
                    <span v-if="!run.hc"> SC</span>
                    <span v-if="run.hc">HC</span>
                    {{ run.players_category }}
                  </router-link>
                </td>
                <td>
                  <v-icon v-if="!run.hc" small :class="`${run.hero}`">
                    mdi-sword
                  </v-icon>
                  <v-icon v-if="run.hc" small :class="`${run.hero}`">
                    mdi-skull-outline
                  </v-icon>
                  <span v-if="!run.character_id">
                    {{ run.hero | HeroNameFilter }}
                  </span>
                  <span v-if="run.character_id">
                    <router-link
                      :to="{
                        name: 'Character',
                        params: {
                          user_name: run.user_name,
                          character_slug: run.character_name + run.character_id
                        }
                      }"
                    >
                      {{ run.hero | HeroNameFilter }}
                    </router-link>
                  </span>
                </td>
                <td>{{ run.submit_time | FromNowFilter }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title> Runners with the most records </v-card-title>
          <v-divider></v-divider>
          <v-simple-table dense class="text-no-wrap">
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
                <td>
                  <span v-if="runner.rank > 3" class="grey--text">
                    {{ runner.rank }}
                  </span>
                  <v-icon v-if="runner.rank == 1" small color="yellow accent-4">
                    mdi-trophy-outline
                  </v-icon>
                  <v-icon v-if="runner.rank == 2" small color="grey lighten-1">
                    mdi-trophy-outline
                  </v-icon>
                  <v-icon v-if="runner.rank == 3" small color="brown">
                    mdi-trophy-outline
                  </v-icon>
                </td>
                <td>
                  <a
                    v-if="!runner.user_id"
                    :style="`color: ${runner.speedrun_user_dark_color_from};`"
                    :href="runner.speedrun_user_weblink"
                    target="_blank"
                  >
                    {{ runner.speedrun_user_name
                    }}<v-icon small right color="grey">mdi-open-in-new</v-icon>
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
                    <CountryIcon :code="runner.speedrun_user_country_code" />
                    <strong>{{ runner.user_name }}</strong>
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
      <v-col cols="12" lg="6">
        <v-card class="fill-height">
          <v-card-title> Active race </v-card-title>
          <v-divider></v-divider>
          Active race here
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { HeroNameFilter } from '@/filters';
import { FromNowFilter } from '@/filters';
import { DurationFilter } from '@/filters';
import CountryIcon from '@/components/CountryIcon.vue';
// import BlogPostBox from '@/components/BlogPostBox.vue';
import blog from '@/router/wiki.js';

export default {
  filters: {
    HeroNameFilter,
    FromNowFilter,
    DurationFilter
  },
  components: {
    CountryIcon
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
