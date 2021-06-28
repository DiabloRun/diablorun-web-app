<template>
  <v-container>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="text-center">
        <h1>Welcome to diablo.run</h1>
        <h1 class="subtitle">
          Download
          <a
            target="_blank"
            href="https://github.com/DiabloRun/DiabloInterface/releases/tag/v21.6.16"
            >Diablo Interface v21.6.16</a
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
    <v-row>
      <!-- Recently submitted speedruns -->
      <v-col cols="12">
        <h1>Recently submitted speedruns</h1>
        <v-data-table
          class="text-no-wrap"
          :headers="headers"
          :items="latestSpeedruns"
          :hide-default-footer="true"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.category_rank }}</td>
              <td>
                <a :href="item.speedrun_link" target="_blank" class="monospace">
                  {{ item.seconds_played | DurationFilter }}
                </a>
              </td>
              <td><SpeedrunUser :run="item" /></td>
              <td>
                <router-link
                  :to="{
                    name: 'Leaderboard',
                    hash: `#${item.category_id}/${item.hc ? 'hc' : 'sc'}/${
                      item.hero
                    }/${item.players_category}`
                  }"
                >
                  {{ item.category_name }}
                </router-link>
              </td>
              <td>
                <v-avatar size="30px">
                  <Icon :name="item.players_category" />
                </v-avatar>
                <v-avatar size="30px" class="ml-1">
                  <Icon v-if="item.hc" :name="item.hero" class="hc" />
                  <Icon v-if="!item.hc" :name="item.hero" />
                </v-avatar>
                <v-icon
                  v-if="item.category_rank == 1"
                  color="gold"
                  class="ml-1"
                >
                  mdi-trophy-outline
                </v-icon>
                <v-icon
                  v-if="item.category_rank == 2"
                  color="silver"
                  class="ml-1"
                >
                  mdi-trophy-outline
                </v-icon>
                <v-icon
                  v-if="item.category_rank == 3"
                  color="bronze"
                  class="ml-1"
                >
                  mdi-trophy-outline
                </v-icon>
                <router-link
                  class="ml-1"
                  :class="{ 'hc--text': item.hc }"
                  :to="{
                    name: 'Character',
                    params: {
                      user_name: item.user_name,
                      character_slug: item.character_name + item.character_id
                    }
                  }"
                >
                  {{ item.character_name }}
                </router-link>
              </td>
              <td class="text-right">{{ item.submit_time | FromNowFilter }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
      <!-- Fresh records -->
      <v-col cols="12" lg="6">
        <h1>Fresh records</h1>
        <v-data-table
          class="text-no-wrap"
          :headers="headers"
          :items="latestRecords"
          :hide-default-footer="true"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.category_rank }}</td>
              <td>
                <a :href="item.speedrun_link" target="_blank" class="monospace">
                  {{ item.seconds_played | DurationFilter }}
                </a>
              </td>
              <td><SpeedrunUser :run="item" /></td>
              <td>
                <router-link
                  :to="{
                    name: 'Leaderboard',
                    hash: `#${item.category_id}/${item.hc ? 'hc' : 'sc'}/${
                      item.hero
                    }/${item.players_category}`
                  }"
                >
                  {{ item.category_name }}
                </router-link>
              </td>
              <td>
                <v-avatar size="30px">
                  <Icon :name="item.players_category" />
                </v-avatar>
                <v-avatar size="30px" class="ml-1">
                  <Icon v-if="item.hc" :name="item.hero" class="hc" />
                  <Icon v-if="!item.hc" :name="item.hero" />
                </v-avatar>
                <v-icon
                  v-if="item.category_rank == 1"
                  color="gold"
                  class="ml-1"
                >
                  mdi-trophy-outline
                </v-icon>
                <v-icon
                  v-if="item.category_rank == 2"
                  color="silver"
                  class="ml-1"
                >
                  mdi-trophy-outline
                </v-icon>
                <v-icon
                  v-if="item.category_rank == 3"
                  color="bronze"
                  class="ml-1"
                >
                  mdi-trophy-outline
                </v-icon>
                <router-link
                  class="ml-1"
                  :class="{ 'hc--text': item.hc }"
                  :to="{
                    name: 'Character',
                    params: {
                      user_name: item.user_name,
                      character_slug: item.character_name + item.character_id
                    }
                  }"
                >
                  {{ item.character_name }}
                </router-link>
              </td>
              <td class="text-right">{{ item.submit_time | FromNowFilter }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
      <!-- Most records -->
      <v-col cols="12" lg="6">
        <h1>Runners with the most records</h1>
        <v-data-table
          class="text-no-wrap"
          :headers="mostMedalsHeaders"
          :items="mostMedals"
          :hide-default-footer="true"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>
                <span v-if="item.rank > 3" class="silver--text">
                  {{ item.rank }}
                </span>
                <v-icon v-if="item.rank == 1" color="gold">
                  mdi-trophy-outline
                </v-icon>
                <v-icon v-if="item.rank == 2" color="grey lighten-1">
                  mdi-trophy-outline
                </v-icon>
                <v-icon v-if="item.rank == 3" color="bronze">
                  mdi-trophy-outline
                </v-icon>
              </td>
              <td><SpeedrunUser :run="item" /></td>
              <td>{{ item.gold }}</td>
              <td>{{ item.silver }}</td>
              <td>{{ item.bronze }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { HeroNameFilter } from '@/filters';
import { FromNowFilter } from '@/filters';
import { DurationFilter } from '@/filters';
import SpeedrunUser from '@/components/SpeedrunUser.vue';
// import BlogPostBox from '@/components/BlogPostBox.vue';
import blog from '@/router/wiki.js';
import Icon from '@/components/Icon.vue';

export default {
  filters: {
    HeroNameFilter,
    FromNowFilter,
    DurationFilter
  },
  components: {
    SpeedrunUser,
    Icon
    // BlogPostBox
  },
  name: 'Home',
  data() {
    return {
      latestSpeedruns: [],
      latestRecords: [],
      latestPost: blog[0],
      mostMedals: [],
      headers: [
        { text: 'Rank', value: 'rank', sortable: false },
        { text: 'Time', value: 'seconds_played', sortable: false },
        { text: 'Runner', value: 'user_name', sortable: false },
        { text: 'Category', value: 'category_name', sortable: false },
        { text: 'Hero', value: 'hero', sortable: false },
        {
          text: 'Submitted',
          value: 'submit_time',
          align: 'end',
          sortable: false
        }
      ],
      mostMedalsHeaders: [
        { text: 'Rank', value: 'rank', sortable: false },
        { text: 'Runner', value: 'user_name', sortable: false },
        { text: 'Gold', value: 'gold' },
        { text: 'Silver', value: 'silver' },
        { text: 'Bronze', value: 'bronze' }
      ]
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
