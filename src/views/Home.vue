<template>
  <v-container>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="text-center">
        <h1>Welcome to diablo.run</h1>
        <h1 class="subtitle">
          Download
          <a
            target="_blank"
            href="https://github.com/DiabloRun/DiabloInterface/releases/tag/v21.6.14"
            >Diablo Interface v21.6.14</a
          >
          for all the new features to work. Older versions are no longer
          supported.
        </h1>
        <v-btn :to="{ name: 'Interface Setup' }">
          <v-icon small left>mdi-cog</v-icon>
          Setup guide
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <!-- Recently submitted speedruns -->
      <v-col cols="12">
        <h1>Recently submitted speedruns</h1>
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
                <span v-if="run.category_rank > 3" class="silver--text">{{
                  run.category_rank
                }}</span>
                <v-icon v-if="run.category_rank == 1" small color="gold">
                  mdi-trophy-outline
                </v-icon>
                <v-icon
                  v-if="run.category_rank == 2"
                  small
                  color="grey lighten-1"
                >
                  mdi-trophy-outline
                </v-icon>
                <v-icon v-if="run.category_rank == 3" small color="bronze">
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
                <span v-if="!run.character_id" class="silver--text">
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
              <td class="silver--text">
                {{ run.submit_time | FromNowFilter }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <!-- Fresh records -->
      <v-col cols="12" lg="6">
        <h1>Fresh diablo.run records</h1>
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
                <v-icon small color="gold"> mdi-trophy-outline </v-icon>
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
                <span v-if="!run.character_id" class="silver--text">
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
              <td class="silver--text">
                {{ run.submit_time | FromNowFilter }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <!-- Most records -->
      <v-col cols="12" lg="6">
        <h1>Runners with the most records</h1>
        <v-simple-table dense class="text-no-wrap">
          <thead>
            <tr>
              <th>#</th>
              <th>Runner</th>
              <th><v-icon small left color="gold">mdi-trophy</v-icon>Gold</th>
              <th>
                <v-icon small left color="grey lighten-1">mdi-trophy</v-icon
                >Silver
              </th>
              <th>
                <v-icon small left color="bronze">mdi-trophy</v-icon>Bronze
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="runner of mostMedals" :key="runner.speedrun_user_id">
              <td>
                <span v-if="runner.rank > 3" class="silver--text">
                  {{ runner.rank }}
                </span>
                <v-icon v-if="runner.rank == 1" small color="gold">
                  mdi-trophy-outline
                </v-icon>
                <v-icon v-if="runner.rank == 2" small color="grey lighten-1">
                  mdi-trophy-outline
                </v-icon>
                <v-icon v-if="runner.rank == 3" small color="bronze">
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
