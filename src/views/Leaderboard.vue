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
    </v-row>
    <v-row dense class="my-5">
      <!--Category-->
      <v-col cols="12">
        <v-row dense>
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
          <v-col cols="auto" class="my-auto">
            <router-link
              :to="'/wiki/' + category.name.toLowerCase() + '-rules'"
            >
              <v-btn class="mr-3" color="primary">
                <v-icon left>mdi-script-text</v-icon>
                {{ categoryName }} category rules
              </v-btn>
            </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  outlined
                  color="primary"
                  @click="resetFilters()"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Reset filters</span>
            </v-tooltip>
          </v-col>
        </v-row>
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
      <!--Players-->
      <v-col md="auto" v-if="!category.px_only">
        <DataFilter store="leaderboard" column="players_category">
          <DataFilterItem any label="Any Players" />
          <DataFilterItem value="p1" icon="p1" />
          <DataFilterItem value="px" icon="px" />
          <DataFilterItem value="p8" icon="p8" />
        </DataFilter>
      </v-col>
      <!--Core-->
      <v-col cols="auto">
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

    <v-data-table
      v-if="runs.length"
      class="text-no-wrap"
      :headers="headers"
      :items="runs"
      :items-per-page="-1"
      :hide-default-footer="true"
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ index + 1 }}</td>
          <td>
            <a :href="item.speedrun_link" target="_blank" class="monospace">
              {{ item.seconds_played | DurationFilter }}
            </a>
          </td>
          <td><SpeedrunUser :run="item" /></td>
          <td>
            <v-avatar size="30px">
              <Icon :name="item.players_category" />
            </v-avatar>
            <v-tooltip bottom v-if="item.hc">
              <template v-slot:activator="{ on, attrs }">
                <v-avatar v-bind="attrs" v-on="on" size="30px" class="ml-1 hc">
                  <Icon :name="item.hero" />
                </v-avatar>
              </template>
              <span> Hardcore {{ item.hero | HeroNameFilter }}</span>
            </v-tooltip>
            <v-tooltip bottom v-if="!item.hc">
              <template v-slot:activator="{ on, attrs }">
                <v-avatar v-bind="attrs" v-on="on" size="30px" class="ml-1">
                  <Icon :name="item.hero" />
                </v-avatar>
              </template>
              <span> Softcore {{ item.hero | HeroNameFilter }}</span>
            </v-tooltip>
            <v-tooltip bottom v-if="item.category_rank == 1">
              <template v-slot:activator="{ on, attrs }">
                <v-avatar v-bind="attrs" v-on="on" size="30px" class="ml-1">
                  <v-icon color="gold" class="ml-1">
                    mdi-trophy-outline
                  </v-icon>
                </v-avatar>
              </template>
              <span>
                Gold in {{ item.category_name }} ({{ item.players_category }})
                {{ item.hc ? 'Harcore' : 'Softcore' }}
                {{ item.hero | HeroNameFilter }}</span
              >
            </v-tooltip>
            <v-tooltip bottom v-if="item.category_rank == 2">
              <template v-slot:activator="{ on, attrs }">
                <v-avatar v-bind="attrs" v-on="on" size="30px" class="ml-1">
                  <v-icon color="silver" class="ml-1">
                    mdi-trophy-outline
                  </v-icon>
                </v-avatar>
              </template>
              <span>
                Silver in {{ item.category_name }} ({{ item.players_category }})
                {{ item.hc ? 'Harcore' : 'Softcore' }}
                {{ item.hero | HeroNameFilter }}</span
              >
            </v-tooltip>
            <v-tooltip bottom v-if="item.category_rank == 3">
              <template v-slot:activator="{ on, attrs }">
                <v-avatar v-bind="attrs" v-on="on" size="30px" class="ml-1">
                  <v-icon color="bronze" class="ml-1">
                    mdi-trophy-outline
                  </v-icon>
                </v-avatar>
              </template>
              <span>
                Bronze in {{ item.category_name }} ({{ item.players_category }})
                {{ item.hc ? 'Harcore' : 'Softcore' }}
                {{ item.hero | HeroNameFilter }}</span
              >
            </v-tooltip>
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
      heroFilterValues: ['ama', 'asn', 'nec', 'bar', 'pal', 'sor', 'dru'],
      headers: [
        { text: 'Rank', value: 'rank' },
        { text: 'Time', value: 'seconds_played' },
        { text: 'Runner', value: 'user_name' },
        { text: 'Hero', value: 'hero' },
        { text: 'Submitted', value: 'submit_time', align: 'end' }
      ]
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
