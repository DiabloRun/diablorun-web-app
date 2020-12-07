<template>
  <div>
    <!-- Hero -->
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column">
              <h1 class="title is-2">{{ categoryName }}</h1>
            </div>
            <div class="column is-narrow">
              <figure class="image is-48x48">
                <img
                  class="has-glow is-rounded"
                  src="@/assets/img/d2_cover.png"
                  v-if="!heroFilter"
                />
                <Icon
                  imgClass="has-glow is-rounded"
                  :name="`big-${heroFilter}`"
                  v-if="heroFilter"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Quick Statistics -->
    <section class="hero is-dark has-margin-bottom">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-mobile is-vcentered">
            <div class="column">
              <h1 class="subtitle is-4">
                {{ statistics.speedruns }} runs by
                {{ statistics.users }} runners
              </h1>
            </div>
            <div class="column is-narrow">
              <button
                class="button is-primary has-tooltip-left"
                data-tooltip="Reset Filters"
                @click="resetFilters()"
              >
                <span class="icon is-small">
                  <img src="@/assets/img/icons/reset.png" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Filters -->
    <section class="section">
      <div class="container">
        <div class="columns is-overflow-visible is-multiline">
          <!--Category-->
          <div class="column is-4">
            <LeaderboardFilter column="category_id">
              <LeaderboardFilterItem :value="1" label="Normal" />
              <LeaderboardFilterItem :value="2" label="Hell" />
              <LeaderboardFilterItem :value="3" label="Pacifist" />
            </LeaderboardFilter>
          </div>
          <!--Core-->
          <div class="column is-4">
            <LeaderboardFilter column="hc">
              <LeaderboardFilterItem any label="Any Core" />
              <LeaderboardFilterItem :value="0" icon="sc" />
              <LeaderboardFilterItem :value="1" icon="hc" />
            </LeaderboardFilter>
          </div>
          <!--Players-->
          <div class="column is-4">
            <LeaderboardFilter column="players_category">
              <LeaderboardFilterItem any label="Any Players" />
              <LeaderboardFilterItem value="p1" icon="p1" />
              <LeaderboardFilterItem value="px" icon="px" />
              <LeaderboardFilterItem value="p8" icon="p8" />
            </LeaderboardFilter>
          </div>
          <!--Class-->
          <div class="column">
            <LeaderboardFilter column="hero">
              <LeaderboardFilterItem any label="Any Class" />
              <LeaderboardFilterItem
                v-for="hero of heroFilterValues"
                :key="hero"
                :value="hero"
                :icon="hero"
              />
            </LeaderboardFilter>
          </div>
        </div>
      </div>
    </section>
    <!-- Category is empty -->
    <section class="section" v-if="!runs.length > 0">
      <div class="container">
        <div class="notification is-dark has-text-centered">
          <p>There are no submitted runs in this category.</p>
        </div>
      </div>
    </section>
    <!-- Table -->
    <section class="section" v-if="runs.length > 0">
      <div class="container">
        <div class="columns">
          <div class="column">
            <table class="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th class="has-text-centered has-text-fade">#</th>
                  <th>Runner</th>
                  <th class="has-text-centered has-text-right-mobile">Time</th>
                  <th class="has-text-centered">Hero</th>
                  <th class="has-text-centered is-hidden-mobile">Core</th>
                  <th class="has-text-centered is-hidden-mobile">Players</th>
                  <th class="has-text-right is-hidden-touch">Submitted</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(run, index) of runs" :key="run.id">
                  <td class="is-narrow has-text-centered">
                    <p :class="`subtitle is-6 has-text-fade rank-${index + 1}`">
                      {{ index + 1 }}
                    </p>
                  </td>
                  <td class="is-narrow">
                    <CountryIcon
                      imgClass="flag"
                      :code="run.speedrun_user_country_code"
                    />
                    <p class="subtitle is-5">
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
                      <span v-if="run.character_id">
                        <span class="has-text-fade">as</span>
                        <router-link
                          :to="{
                            name: 'Character',
                            params: {
                              user_name: run.user_name,
                              character_slug:
                                run.character_name + run.character_id
                            }
                          }"
                        >
                          {{ run.character_name }}
                        </router-link>
                      </span>
                    </p>
                  </td>
                  <td class="has-text-centered has-text-right-mobile">
                    <p class="subtitle is-5">
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </p>
                  </td>
                  <td class="has-text-centered">
                    <span
                      :class="
                        `is-hidden-touch has-hero ${run.hero} subtitle is-5`
                      "
                      >{{ run.hero | HeroNameFilter }}</span
                    >
                    <span
                      :class="
                        `is-hidden-desktop has-hero ${run.hero} subtitle is-5`
                      "
                      >{{ run.hero }}</span
                    >
                  </td>
                  <td class="has-text-centered is-hidden-mobile">
                    <span v-if="!run.hc" class="subtitle is-5"
                      ><span class="has-text-grey">SC</span></span
                    >
                    <span v-if="run.hc" class="subtitle is-5"
                      ><span class="has-text-warning">HC</span></span
                    >
                  </td>
                  <td class="has-text-centered is-hidden-mobile">
                    <p class="subtitle is-5">{{ run.players_category }}</p>
                  </td>
                  <td class="is-narrow is-hidden-touch has-text-right">
                    <p class="subtitle is-6">
                      {{ run.submit_time | FromNowFilter }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              v-if="pagination.more"
              class="button is-primary"
              :class="{ 'is-loading': pagination.loading }"
              @click="loadMore()"
            >
              Load more
            </button>
          </div>
        </div>
      </div>
    </section>
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

      categoryName += 'Leaderboard';

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
