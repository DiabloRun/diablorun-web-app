<template>
  <div>
    <!-- Hero account -->
    <section class="hero is-primary" v-if="user">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div v-if="user.profile_image_url !== ''" class="column is-narrow">
              <figure class="image is-64x64">
                <img :src="user.profile_image_url" class="is-rounded" />
              </figure>
            </div>
            <div class="column">
              <h1 class="title is-2">{{ user.name }}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Quick Statistics -->
    <section class="hero is-dark has-margin-bottom" v-if="latestCharacter">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-multiline is-mobile">
            <div class="column">
              <h1 class="subtitle is-4">
                Active {{ latestCharacter.update_time | FromNowFilter }}
              </h1>
            </div>
            <div
              class="column is-narrow has-tooltip-left"
              :data-tooltip="user.name + ' on Twitch'"
            >
              <figure class="image is-24x24">
                <a :href="`https://twitch.com/${user.name}`" target="_blank">
                  <img src="@/assets/img/icons/TwitchGlitchWhite.svg" />
                </a>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Latest active hero -->
    <section class="section" v-if="latestCharacter">
      <div class="container">
        <div class="columns">
          <div class="column is-4-desktop">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">Latest character</p>
              </header>
              <div class="card-content">
                <div class="content">
                  <div class="columns is-mobile">
                    <div class="column is-narrow">
                      <router-link
                        :to="{
                          name: 'Character',
                          params: {
                            user_name: latestCharacter.user_name,
                            character_slug: '@'
                          }
                        }"
                      >
                        <Icon
                          imgClass="has-glow"
                          :name="`big-${latestCharacter.hero}`"
                        />
                      </router-link>
                    </div>
                    <div class="column">
                      <p class="title">
                        <router-link
                          :to="{
                            name: 'Character',
                            params: {
                              user_name: latestCharacter.user_name,
                              character_slug: '@'
                            }
                          }"
                          >{{ latestCharacter.name }}</router-link
                        >
                      </p>
                      <p class="subtitle is-5">
                        {{ latestCharacter.area | AreaNameFilter }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <p class="card-footer-item">
                  Level {{ latestCharacter.level }}
                </p>
                <p class="card-footer-item">
                  {{ latestCharacter.difficulty | DifficultyFilter }} Difficulty
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Character history -->
    <section class="section" v-if="characters.length > 0">
      <div class="container">
        <h1 class="subtitle is-4">{{ user.name }}'s character history</h1>
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th class="is-narrow has-text-centered">LVL</th>
              <th>Name</th>
              <th class="has-text-centered">Hero</th>
              <th class="has-text-centered">Core</th>
              <th class="has-text-centered is-hidden-touch">Location</th>
              <th class="has-text-centered is-hidden-touch">In-game time</th>
              <th
                class="is-hidden-mobile"
                :class="{
                  'has-text-centered': isEditor,
                  'has-text-right': !isEditor
                }"
              >
                Added
              </th>
              <th class="has-text-right" v-if="isEditor">Edit</th>
            </tr>
          </thead>
          <tbody class="has-no-overflow">
            <tr v-for="character of characters" :key="character.id">
              <!-- Rank -->
              <td class="has-text-centered is-narrow">
                <p class="subtitle is-5">{{ character.level }}</p>
              </td>
              <!-- Name -->
              <td class="is-narrow has-no-overflow">
                <p class="subtitle is-5">
                  <router-link
                    :to="`/${character.user_name}/${character.name}${character.id}`"
                  >
                    {{ character.name }}
                  </router-link>
                </p>
              </td>
              <!-- Hero -->
              <td class="has-text-centered">
                <span
                  :class="`is-hidden-desktop has-hero ${character.hero} subtitle is-5`"
                  >{{ character.hero }}</span
                >
                <span
                  :class="`is-hidden-touch has-hero ${character.hero} subtitle is-5`"
                  >{{ character.hero | HeroNameFilter }}</span
                >
              </td>
              <!-- Core -->
              <td class="has-text-centered">
                <div class="is-hidden-touch">
                  <span v-if="!character.hc" class="subtitle is-5 has-text-grey"
                    >SC</span
                  >
                  <span
                    v-if="character.hc"
                    class="subtitle is-5 has-text-warning"
                    >HC</span
                  >
                </div>
                <div class="is-hidden-desktop">
                  <span v-if="!character.hc" class="subtitle is-5 has-text-grey"
                    >SC</span
                  >
                  <span
                    v-if="character.hc"
                    class="subtitle is-5 has-text-warning"
                    ><span
                      v-if="character.hc && character.dead"
                      class="subtitle is-5 has-text-warning"
                      >Dead </span
                    >HC</span
                  >
                </div>
              </td>
              <!-- Location -->
              <td class="has-text-centered is-hidden-touch">
                <p
                  class="subtitle is-5"
                  v-if="!(character.hc && character.dead)"
                >
                  {{ character.area | AreaNameFilter }}
                </p>
                <p
                  v-if="character.hc && character.dead"
                  class="subtitle is-5 has-text-warning"
                >
                  Dead
                </p>
              </td>
              <!-- Playtime -->
              <td class="has-text-centered is-hidden-touch">
                <p class="subtitle is-5">
                  {{ character.seconds_played | DurationFilter }}
                </p>
              </td>
              <!-- Added -->
              <td
                class="is-narrow is-hidden-mobile"
                :class="{
                  'has-text-centered': isEditor,
                  'has-text-right': !isEditor
                }"
              >
                {{ character.start_time | FromNowFilter }}
              </td>
              <!-- Edit -->
              <td class="has-text-right" v-if="isEditor">
                <span :class="`is-hidden-touch subtitle is-5`"
                  ><a
                    class="has-text-danger"
                    @click="deleteCharacter(character)"
                    >Delete</a
                  ></span
                >
                <span :class="`is-hidden-desktop subtitle is-5`"
                  ><a
                    class="has-text-danger"
                    @click="deleteCharacter(character)"
                    >Del</a
                  ></span
                >
              </td>
            </tr>
          </tbody>
        </table>

        <button
          v-if="moreCharacters"
          class="button is-primary"
          :class="{ 'is-loading': loadingCharacters }"
          @click="loadMoreCharacters()"
        >
          Load more
        </button>
      </div>
    </section>
    <!-- Speedruns -->
    <section class="section" v-if="speedruns.length > 0">
      <div class="container">
        <div class="columns is-mobile is-multiline">
          <div class="column is-full-mobile">
            <h1 class="subtitle is-4">{{ user.name }}'s speedruns</h1>
          </div>
          <div class="column is-narrow">
            <p class="subtitle is-5 has-text-grey">
              <span class="rank-1">{{ speedrunsStatistics.gold }}</span> Gold
            </p>
          </div>
          <div class="column is-narrow">
            <p class="subtitle is-5 has-text-grey">
              <span class="rank-2">{{ speedrunsStatistics.silver }}</span>
              Silver
            </p>
          </div>
          <div class="column is-narrow">
            <p class="subtitle is-5 has-text-grey">
              <span class="rank-3">{{ speedrunsStatistics.bronze }}</span>
              Bronze
            </p>
          </div>
        </div>
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th class="has-text-centered has-text-fade">#</th>
              <th>Hero</th>
              <th>Category</th>
              <th class="has-text-centered has-text-right-mobile">Time</th>
              <th class="has-text-centered is-hidden-touch">Armory</th>
              <th class="has-text-right is-hidden-mobile">Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="run of speedruns" :key="run.id">
              <!-- Rank -->
              <td class="is-narrow has-text-centered">
                <p
                  :class="`subtitle is-6 has-text-fade rank-${run.category_rank}`"
                >
                  {{ run.category_rank }}
                </p>
              </td>
              <!-- Hero -->
              <td class="is-narrow">
                <p class="subtitle is-5">
                  <span :class="`has-hero ${run.hero} is-hidden-touch`">
                    {{ run.hero | HeroNameFilter }}
                  </span>
                  <span :class="`has-hero ${run.hero} is-hidden-desktop`">
                    {{ run.hero }}
                  </span>
                </p>
              </td>
              <!-- Category -->
              <td class="is-narrow">
                <p class="subtitle is-5">
                  <router-link
                    :to="{
                      name: 'Leaderboard',
                      hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                        run.hero
                      }/${run.players_category}`
                    }"
                  >
                    {{ run.category_name }}
                    <span class="is-hidden-touch">
                      {{ run.hc ? 'Hardcore' : 'Softcore' }}
                    </span>
                    <span class="is-hidden-desktop">
                      {{ run.hc ? 'HC' : 'SC' }}
                    </span>
                    <span class="is-hidden-touch">
                      {{ run.players_category | PlayersCategoryNameFilter }}
                    </span>
                    <span class="is-hidden-desktop">
                      {{ run.players_category }}
                    </span>
                  </router-link>
                </p>
              </td>
              <!-- Time -->
              <td class="has-text-centered has-text-right-mobile">
                <p class="subtitle is-5">
                  <a :href="run.speedrun_link" target="_blank">
                    {{ run.seconds_played | DurationFilter }}
                  </a>
                </p>
              </td>
              <!-- Character -->
              <td class="has-text-centered is-hidden-touch">
                <span class="has-text-fade" v-if="!run.character_id"
                  >Unlinked</span
                >
                <p v-if="run.character_id" class="subtitle is-5">
                  <router-link
                    :to="{
                      name: 'Character',
                      params: {
                        user_name: run.user_name,
                        character_slug: run.character_name + run.character_id
                      }
                    }"
                  >
                    {{ run.character_name }}
                  </router-link>
                </p>
              </td>
              <!-- Submit time -->
              <td class="is-narrow is-hidden-mobile has-text-right">
                {{ run.submit_time | FromNowFilter }}
              </td>
            </tr>
          </tbody>
        </table>

        <button
          v-if="speedrunsPagination.more"
          class="button is-primary"
          :class="{ 'is-loading': loadingSpeedruns }"
          @click="loadMoreSpeedruns()"
        >
          Load more
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.table th {
  word-wrap: none;
  white-space: nowrap;
}
</style>

<script>
import { mapState } from 'vuex';
import {
  FromNowFilter,
  DifficultyFilter,
  AreaNameFilter,
  DurationFilter,
  HeroNameFilter,
  PlayersCategoryNameFilter
} from '@/filters';
import Icon from '@/components/Icon.vue';

export default {
  name: 'Character',
  filters: {
    FromNowFilter,
    DifficultyFilter,
    AreaNameFilter,
    DurationFilter,
    HeroNameFilter,
    PlayersCategoryNameFilter
  },
  components: {
    Icon
  },
  data: () => ({
    user: null,
    username: '',
    characters: [],
    moreCharacters: false,
    offsetCharacters: '',
    loadingCharacters: true,
    speedruns: [],
    speedrunsStatistics: {},
    speedrunsPagination: {},
    loadingSpeedruns: true
  }),
  computed: {
    ...mapState({
      latestCharacter: (state) => state.ws.character
    }),
    isEditor() {
      if (!this.$store.state.auth.user) {
        return false;
      }

      return this.$store.state.auth.user.login === this.username.toLowerCase();
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler({ params: { user_name } }) {
        this.username = user_name.toLowerCase();

        const res = await fetch(
          `${process.env.VUE_APP_API_URL}/users/${this.username}/profile`
        );
        const { user, lastUpdate, characters, speedruns } = await res.json();

        this.user = user;

        await this.$store.dispatch('ws/subscribeToCharacter', {
          name: this.username,
          lastUpdate
        });

        this.characters = characters.data;
        this.moreCharacters = characters.meta.more;
        this.offsetCharacters = characters.meta.offset;
        this.loadingCharacters = false;

        this.speedruns = speedruns.speedruns;
        this.speedrunsStatistics = speedruns.statistics;
        this.speedrunsPagination = speedruns.pagination;
        this.loadingSpeedruns = false;
      }
    }
  },
  methods: {
    async loadMoreCharacters() {
      this.loadingCharacters = true;

      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/characters?user_name=${this.username}&offset=${this.offsetCharacters}&limit=10`
      );
      const { data, meta } = await res.json();

      this.characters = this.characters.concat(data);
      this.moreCharacters = meta.more;
      this.offsetCharacters = meta.offset;
      this.loadingCharacters = false;
    },

    async loadMoreSpeedruns() {
      this.loadingSpeedruns = true;

      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/speedruns?user_id=${this.user.id}&offset=${this.speedrunsPagination.offset}&limit=10&order_by=submit_time&order_dir=DESC`
      );
      const { speedruns, statistics, pagination } = await res.json();

      this.speedruns = this.speedruns.concat(speedruns);
      this.speedrunsStatistics = statistics;
      this.speedrunsPagination = pagination;
      this.loadingSpeedruns = false;
    },

    async deleteCharacter(character) {
      if (
        await this.$store.dispatch('app/confirm', {
          title: 'Delete character',
          message: `Are you sure you wish to delete the character ${character.name}?`,
          verify: 'Delete'
        })
      ) {
        try {
          const res = await fetch(
            `${process.env.VUE_APP_API_URL}/characters/${character.id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${this.$store.state.auth.user.api_key}`
              }
            }
          );

          if (res.status !== 200) {
            throw new Error(await res.text());
          }
        } catch ({ message }) {
          await this.$store.dispatch('app/confirm', {
            title: 'Failed to delete character',
            message,
            verify: 'OK',
            verifyClass: '',
            cancelable: false
          });
          return;
        }

        this.characters = this.characters.filter((c) => c !== character);

        if (!this.characters.length) {
          await this.loadMoreCharacters();
        }
      }
    }
  }
};
</script>
