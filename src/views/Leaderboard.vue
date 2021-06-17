<template>
  <v-container>
    <v-row dense class="mt-5">
      <v-col cols="auto" class="mr-3">
        <v-avatar size="64">
          <v-img src="@/assets/img/d2_cover.png" v-if="!heroFilter" />
          <Icon :name="`big-${heroFilter}`" v-if="heroFilter" />
        </v-avatar>
      </v-col>
      <v-col class="my-auto">
        <h2>
          {{ categoryName }}
        </h2>
        <h2 class="subtitle">
          {{ statistics.speedruns }} runs by {{ statistics.users }} runners
        </h2>
      </v-col>
      <v-col cols="auto" class="my-auto">
        <v-btn outlined color="primary" @click="resetFilters()">
          <v-icon left>mdi-refresh</v-icon> Reset
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense class="my-5">
      <!--Category-->
      <v-col>
        <DataFilter store="leaderboard" column="category_id">
          <DataFilterItem
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            :label="category.name"
          />
        </DataFilter>
      </v-col>
      <!--Players-->
      <v-col cols="12" md="auto" v-if="!category.px_only">
        <DataFilter store="leaderboard" column="players_category">
          <DataFilterItem any label="Any Players" />
          <DataFilterItem value="p1" icon="p1" />
          <DataFilterItem value="px" icon="px" />
          <DataFilterItem value="p8" icon="p8" />
        </DataFilter>
      </v-col>
      <!--Class-->
      <v-col>
        <DataFilter store="leaderboard" column="hero">
          <DataFilterItem any label="Any" />
          <DataFilterItem
            v-for="hero of heroFilterValues"
            :key="hero"
            :value="hero"
            :icon="hero"
          />
        </DataFilter>
      </v-col>
      <!--Core-->
      <v-col cols="12" md="auto">
        <DataFilter store="leaderboard" column="hc">
          <DataFilterItem any label="Any Core" />
          <DataFilterItem :value="0" icon="sc" />
          <DataFilterItem :value="1" icon="hc" />
        </DataFilter>
      </v-col>
    </v-row>

    <v-alert
      v-if="!runs.length"
      text
      color="primary"
      class="mb-0 font-weight-medium text-center"
    >
      {{ categoryName }} category is empty
    </v-alert>

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
          <td class="silver--text">
            {{ index + 1 }}
            <v-icon v-if="run.category_rank == 1" small color="gold">
              mdi-trophy-outline
            </v-icon>
            <v-icon v-if="run.category_rank == 2" small color="silver">
              mdi-trophy-outline
            </v-icon>
            <v-icon v-if="run.category_rank == 3" small color="bronze">
              mdi-trophy-outline
            </v-icon>
          </td>
          <td>
            <SpeedrunUser :run="run" />
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
          <td>
            <span v-if="!run.hc">SC</span>
            <span v-if="run.hc" class="error--text text--lighten-2">HC</span>
            <span class="silver--text ml-2">{{ run.players_category }}</span>
          </td>
          <td class="silver--text">{{ run.submit_time | FromNowFilter }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-btn small v-if="pagination.more" class="mt-5" @click="loadMore()">
      <v-icon left>mdi-chevron-down</v-icon> Load more
    </v-btn>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { DurationFilter, FromNowFilter, HeroNameFilter } from '@/filters';
import Icon from '@/components/Icon.vue';
import SpeedrunUser from '@/components/SpeedrunUser.vue';
import DataFilter from '@/components/DataFilter.vue';
import DataFilterItem from '@/components/DataFilterItem.vue';

export default {
  name: 'Leaderboard',
  filters: {
    DurationFilter,
    HeroNameFilter,
    FromNowFilter
  },
  components: {
    Icon,
    SpeedrunUser,
    DataFilter,
    DataFilterItem
  },
  data() {
    return {
      heroFilterValues: ['ama', 'asn', 'nec', 'bar', 'pal', 'sor', 'dru']
    };
  },
  computed: {
    ...mapState({
      loading: state => state.leaderboard.loading,
      category: state =>
        state.leaderboard.categories.find(
          c => c.id === parseInt(state.leaderboard.filters.category_id)
        ),
      categories: state => state.leaderboard.categories,
      runs: state => state.leaderboard.runs,
      statistics: state => state.leaderboard.statistics,
      pagination: state => state.leaderboard.pagination,
      heroFilter: state => state.leaderboard.filters.hero
    }),

    categoryName() {
      let categoryName = '';
      const filters = this.$store.state.leaderboard.filters;

      if (this.category) {
        categoryName += `${this.category.name} `;
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

      if (
        filters.players_category !== '' &&
        (!this.category || !this.category.px_only)
      ) {
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

      if (this.category) {
        parts.push(this.category.name.toLowerCase());
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
    await this.$store.dispatch('leaderboard/loadCategories');

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

      for (const category of this.categories) {
        if (
          parts.includes(category.id + '') ||
          parts.includes(category.name.toLowerCase())
        ) {
          hashFilters.category_id = category.id;
        }
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
