<template>
  <div>
    <v-container>
      <v-card>
        <v-row no-gutters align="center" class="px-3">
          <v-col cols="auto">
            <v-avatar size="64">
              <v-img src="@/assets/img/d2_cover.png" v-if="!heroFilter">
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      size="18"
                      width="2"
                      color="primary"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <Icon :name="`big-${heroFilter}`" v-if="heroFilter" />
            </v-avatar>
          </v-col>
          <v-col>
            <v-card-title>
              {{ categoryName }}
            </v-card-title>
            <v-card-subtitle>
              {{ statistics.speedruns }} runs by {{ statistics.users }} runners
            </v-card-subtitle>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="resetFilters()">
              <v-icon left>mdi-refresh</v-icon> Reset</v-btn
            >
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-container class="pt-0">
          <v-row no-gutters>
            <!--Category-->
            <v-col class="mt-3">
              <LeaderboardFilter column="category_id">
                <LeaderboardFilterItem :value="1" label="Normal" />
                <LeaderboardFilterItem :value="2" label="Hell" />
                <LeaderboardFilterItem :value="3" label="Pacifist" />
              </LeaderboardFilter>
            </v-col>
            <!--Players-->
            <v-col cols="12" md="auto" class="mt-3">
              <LeaderboardFilter column="players_category">
                <LeaderboardFilterItem any label="Any Players" />
                <LeaderboardFilterItem value="p1" icon="p1" />
                <LeaderboardFilterItem value="px" icon="px" />
                <LeaderboardFilterItem value="p8" icon="p8" />
              </LeaderboardFilter>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <!--Class-->
            <v-col class="mt-3">
              <LeaderboardFilter column="hero">
                <LeaderboardFilterItem any label="Any" />
                <LeaderboardFilterItem
                  v-for="hero of heroFilterValues"
                  :key="hero"
                  :value="hero"
                  :icon="hero"
                />
              </LeaderboardFilter>
            </v-col>
            <!--Core-->
            <v-col cols="12" md="auto" class="mt-3">
              <LeaderboardFilter column="hc">
                <LeaderboardFilterItem any label="Any Core" />
                <LeaderboardFilterItem :value="0" icon="sc" />
                <LeaderboardFilterItem :value="1" icon="hc" />
              </LeaderboardFilter>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-container v-if="!runs.length">
          <v-alert border="left" text type="primary" class="mb-0">
            <v-icon left color="primary">mdi-emoticon-sad-outline</v-icon>
            {{ categoryName }} category is empty.
          </v-alert>
        </v-container>
        <v-simple-table v-if="runs.length" dense class="text-no-wrap">
          <thead>
            <tr>
              <th>#</th>
              <th>Runner</th>
              <th>Time</th>
              <th>Hero</th>
              <th>Core</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(run, index) of runs" :key="run.id">
              <td class="grey--text">
                {{ index + 1 }}
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
                  <v-avatar size="20">
                    <CountryIcon :code="run.speedrun_user_country_code" />
                  </v-avatar>
                  {{ run.user_name }}
                </router-link>
              </td>
              <td>
                <a :href="run.speedrun_link" target="_blank">
                  {{ run.seconds_played | DurationFilter }}
                </a>
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
              <td>
                <span v-if="!run.hc">SC</span>
                <span v-if="run.hc" class="error--text">HC</span>
                <span class="grey--text ml-2">{{ run.players_category }}</span>
              </td>
              <td>{{ run.submit_time | FromNowFilter }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-divider v-if="pagination.more"></v-divider>
        <v-btn v-if="pagination.more" class="ma-4" @click="loadMore()">
          Load more speedruns
        </v-btn>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DurationFilter, FromNowFilter, HeroNameFilter } from '@/filters';
import Icon from '@/components/Icon.vue';
import CountryIcon from '@/components/CountryIcon.vue';
import LeaderboardFilter from '@/components/LeaderboardFilter.vue';
import LeaderboardFilterItem from '@/components/LeaderboardFilterItem.vue';

export default {
  name: 'Leaderboard',
  filters: {
    DurationFilter,
    HeroNameFilter,
    FromNowFilter
  },
  components: {
    Icon,
    CountryIcon,
    LeaderboardFilter,
    LeaderboardFilterItem
  },
  data() {
    return {
      heroFilterValues: ['ama', 'asn', 'nec', 'bar', 'pal', 'sor', 'dru']
    };
  },
  computed: {
    ...mapState({
      loading: state => state.leaderboard.loading,
      runs: state => state.leaderboard.runs,
      statistics: state => state.leaderboard.statistics,
      pagination: state => state.leaderboard.pagination,
      heroFilter: state => state.leaderboard.filters.hero
    }),

    categoryName() {
      let categoryName = 'Any% ';
      const filters = this.$store.state.leaderboard.filters;

      if (filters.category_id !== '') {
        switch (filters.category_id + '') {
          case '2':
            categoryName += 'Hell ';
            break;
          case '3':
            categoryName += 'Pacifist ';
            break;
        }
      }

      if (filters.hc !== '') {
        switch (filters.hc) {
          case 0:
            categoryName += 'Softcore ';
            break;
          case 1:
            categoryName += 'Hardcore ';
            break;
        }
      }

      if (filters.hero !== '') {
        switch (filters.hero) {
          case 'ama':
            categoryName += 'Amazon ';
            break;
          case 'asn':
            categoryName += 'Assassin ';
            break;
          case 'nec':
            categoryName += 'Necromancer ';
            break;
          case 'bar':
            categoryName += 'Barbarian ';
            break;
          case 'pal':
            categoryName += 'Paladin ';
            break;
          case 'sor':
            categoryName += 'Sorceress ';
            break;
          case 'dru':
            categoryName += 'Druid ';
            break;
        }
      }

      if (filters.players_category !== '') {
        switch (filters.players_category) {
          case 'p1':
            categoryName += 'Players 1 ';
            break;
          case 'px':
            categoryName += 'Players X ';
            break;
          case 'p8':
            categoryName += 'Players 8 ';
            break;
        }
      }

      return categoryName;
    },

    filtersHash() {
      const parts = [];
      const filters = this.$store.state.leaderboard.filters;

      switch (filters.category_id + '') {
        case '2':
          parts.push('hell');
          break;
        case '3':
          parts.push('pacifist');
          break;
      }

      if (filters.hc === 0) {
        parts.push('sc');
      } else if (filters.hc === 1) {
        parts.push('hc');
      }

      if (filters.hero !== '') {
        parts.push(filters.hero);
      }

      if (filters.players_category !== '') {
        parts.push(filters.players_category);
      }

      return parts.join('/');
    }
  },
  async mounted() {
    this.hashchangeHandler = () => this.hashchange();
    window.addEventListener('hashchange', this.hashchangeHandler);
    this.hashchange();
  },
  destroyed() {
    window.removeEventListener('hashchange', this.hashchangeHandler);
  },
  methods: {
    async resetFilters() {
      await this.$store.dispatch('leaderboard/resetFilters');
    },

    async hashchange() {
      const parts = window.location.hash.slice(1).split('/');
      const filters = this.$store.state.leaderboard.filters;
      const hashFilters = {
        category_id: 1,
        hc: '',
        players_category: '',
        hero: ''
      };

      if (parts.includes('hell') || parts.includes('2')) {
        hashFilters.category_id = 2;
      } else if (parts.includes('pacifist') || parts.includes('3')) {
        hashFilters.category_id = 3;
      }

      if (parts.includes('sc')) {
        hashFilters.hc = 0;
      } else if (parts.includes('hc')) {
        hashFilters.hc = 1;
      }

      if (parts.includes('p1')) {
        hashFilters.players_category = 'p1';
      } else if (parts.includes('px')) {
        hashFilters.players_category = 'px';
      } else if (parts.includes('p8')) {
        hashFilters.players_category = 'p8';
      }

      for (const hero of this.heroFilterValues) {
        if (parts.includes(hero)) {
          hashFilters.hero = hero;
          break;
        }
      }

      let changed = false;

      for (const column in hashFilters) {
        if (filters[column] !== hashFilters[column]) {
          changed = true;

          this.$store.commit('leaderboard/setFilterValue', {
            column,
            value: hashFilters[column]
          });
        }
      }

      if (changed) {
        await this.$store.dispatch('leaderboard/loadRuns');
      }
    },

    async loadMore() {
      await this.$store.dispatch('leaderboard/loadRuns', true);
    }
  },
  watch: {
    filtersHash(hash) {
      window.location.hash = hash;
    }
  }
};
</script>
