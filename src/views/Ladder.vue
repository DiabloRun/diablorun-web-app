<template>
  <v-container>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="text-center">
        <h1>Join the single player ladder</h1>
        <h1 class="subtitle">
          Create a new character with
          <a
            target="_blank"
            href="https://github.com/DiabloRun/DiabloInterface/releases/tag/v21.6.14"
            >Diablo Interface v21.6.14</a
          >
          opened and connected to diablo.run. Alpha ladder ends at the end of
          June.
        </h1>
        <v-btn :to="{ name: 'Interface Setup' }">
          <v-icon small left>mdi-cog</v-icon>
          Setup guide
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense class="mt-5">
      <v-col cols="auto" class="mr-3">
        <v-avatar size="64">
          <v-img src="@/assets/img/d2_cover.png" v-if="!heroFilter" />
          <Icon :name="`big-${heroFilter}`" v-if="heroFilter" />
        </v-avatar>
      </v-col>
      <v-col class="my-auto">
        <h2>{{ categoryName }} Single Player Ladder</h2>
        <h2 class="subtitle">
          {{ statistics.users }} players with
          {{ statistics.characters }} characters this season
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
        <DataFilter store="ladder" column="d2_mod">
          <DataFilterItem value="D2" label="D2" />
          <DataFilterItem value="PD2" label="PD2" />
        </DataFilter>
      </v-col>
      <!--Class-->
      <v-col md="auto">
        <DataFilter store="ladder" column="hero">
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
        <DataFilter store="ladder" column="hc">
          <DataFilterItem any label="Any Core" />
          <DataFilterItem :value="0" icon="sc" />
          <DataFilterItem :value="1" icon="hc" />
        </DataFilter>
      </v-col>
    </v-row>

    <v-alert
      v-if="!characters.length"
      text
      color="primary"
      class="mb-0 font-weight-medium text-center"
    >
      {{ categoryName }} ladder is empty
    </v-alert>

    <v-simple-table v-if="characters.length" dense class="text-no-wrap">
      <thead>
        <tr>
          <th>#</th>
          <th>Runner</th>
          <th>Hero</th>
          <th>Level</th>
          <th>Experience</th>
          <th>Core</th>
          <th>Playtime</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(character, index) of characters" :key="character.id">
          <td class="silver--text">
            {{ index + 1 }}
            <v-icon v-if="index == 0" small color="gold">
              mdi-trophy-outline
            </v-icon>
            <v-icon v-if="index == 1" small color="silver">
              mdi-trophy-outline
            </v-icon>
            <v-icon v-if="index == 2" small color="bronze">
              mdi-trophy-outline
            </v-icon>
          </td>
          <td>
            <router-link
              :to="{
                name: 'User',
                params: { user_name: character.user_name }
              }"
              :style="`color: ${character.user_color};`"
            >
              <strong>{{ character.user_name }}</strong>
            </router-link>
          </td>
          <td>
            <router-link
              :to="{
                name: 'Character',
                params: {
                  user_name: character.user_name,
                  character_slug: character.name + character.id
                }
              }"
            >
              <v-icon v-if="!character.hc" small :class="`${character.hero}`">
                mdi-sword
              </v-icon>
              <v-icon v-if="character.hc" small :class="`${character.hero}`">
                mdi-skull-outline
              </v-icon>
              {{ character.hero | HeroNameFilter }}
              {{ character.name }}
            </router-link>
          </td>
          <td>
            {{ character.level }}
          </td>
          <td>
            {{ character.experience | BigNumberFilter }}
          </td>
          <td>
            <span v-if="!character.hc">SC</span>
            <span v-if="character.hc" class="error--text text--lighten-2"
              >HC</span
            >
          </td>
          <td>
            {{ character.in_game_time | DurationFilter }}
          </td>
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
import {
  DurationFilter,
  FromNowFilter,
  HeroNameFilter,
  BigNumberFilter
} from '@/filters';
import Icon from '@/components/Icon.vue';
import DataFilter from '@/components/DataFilter.vue';
import DataFilterItem from '@/components/DataFilterItem.vue';

export default {
  name: 'Leaderboard',
  filters: {
    DurationFilter,
    HeroNameFilter,
    FromNowFilter,
    BigNumberFilter
  },
  components: {
    Icon,
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
      loading: state => state.ladder.loading,
      characters: state => state.ladder.characters,
      statistics: state => state.ladder.statistics,
      pagination: state => state.ladder.pagination,
      heroFilter: state => state.ladder.filters.hero
    }),

    categoryName() {
      let categoryName = '';
      const filters = this.$store.state.ladder.filters;

      if (filters.d2_mod == 'PD2') {
        categoryName += 'PD2 ';
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

      return categoryName;
    },

    filtersHash() {
      const parts = [];
      const filters = this.$store.state.ladder.filters;

      switch (filters.d2_mod) {
        case 'D2':
          parts.push('D2');
          break;
        case 'PD2':
          parts.push('PD2');
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
      await this.$store.dispatch('ladder/resetFilters');
    },

    async hashchange() {
      const parts = window.location.hash.slice(1).split('/');
      const filters = this.$store.state.ladder.filters;
      const hashFilters = {
        d2_mod: 'D2',
        hc: '',
        hero: ''
      };

      if (parts.includes('D2')) {
        hashFilters.d2_mod = 'D2';
      } else if (parts.includes('PD2')) {
        hashFilters.d2_mod = 'PD2';
      }

      if (parts.includes('sc')) {
        hashFilters.hc = 0;
      } else if (parts.includes('hc')) {
        hashFilters.hc = 1;
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

          this.$store.commit('ladder/setFilterValue', {
            column,
            value: hashFilters[column]
          });
        }
      }

      if (changed) {
        await this.$store.dispatch('ladder/loadCharacters');
      }
    },

    async loadMore() {
      await this.$store.dispatch('ladder/loadCharacters', true);
    }
  },
  watch: {
    filtersHash(hash) {
      window.location.hash = hash;
    }
  }
};
</script>
