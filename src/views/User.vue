<template>
  <div>
    <!-- Hero -->
    <section class="hero is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div
              v-if="user.profile_image_url !== ''"
              class="column is-narrow py-0"
            >
              <figure class="image is-64x64">
                <img
                  :src="user.profile_image_url"
                  class="is-rounded has-glow"
                />
              </figure>
            </div>
            <div class="column">
              <h1 class="title">{{ user.name }}</h1>
            </div>
            <div class="column is-narrow has-text-grey is-hidden-mobile">
              <p>
                {{ user.name }} last active
                {{ latestCharacter.update_time | FromNowFilter }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Character history -->
    <section class="section" v-if="characters.length > 0">
      <div class="container">
        <h1 class="subtitle">Character history</h1>
        <div class="columns is-vcentered is-mobile">
          <div class="column is-narrow">
            <div class="box">
              <div class="columns is-mobile is-vcentered">
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
                    <figure class="image is-48x48">
                      <Icon
                        :imgClass="
                          `has-glow-${latestCharacter.hero} is-rounded`
                        "
                        :name="`big-${latestCharacter.hero}`"
                      />
                    </figure>
                  </router-link>
                </div>
                <div class="column">
                  <p class="title is-5">
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
                  <p class="subtitle is-6">
                    Level {{ latestCharacter.level }}
                    <span class="has-text-grey">in</span>
                    {{ latestCharacter.difficulty | DifficultyFilter }}
                    {{ latestCharacter.area | AreaNameFilter }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="column has-text-right is-hidden-mobile">
            <router-link
              :to="{
                name: 'Character',
                params: {
                  user_name: latestCharacter.user_name,
                  character_slug: '@'
                }
              }"
            >
              <button
                v-if="moreCharacters"
                class="button is-small is-primary has-tooltip-left"
                :data-tooltip="
                  user.name + '/@ always links to active character'
                "
              >
                <span class="is-hidden-mobile"
                  >diablo.run/{{ latestCharacter.user_name }}/</span
                >@
              </button>
            </router-link>
          </div>
          <div
            class="column is-narrow has-tooltip-left is-hidden-mobile"
            :data-tooltip="user.name + ' on Twitch'"
          >
            <figure class="image is-24x24">
              <a :href="`https://twitch.com/${user.name}`" target="_blank">
                <img src="@/assets/img/icons/TwitchGlitchWhite.svg" />
              </a>
            </figure>
          </div>
        </div>
        <table class="table is-narrow is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hero</th>
              <th>Core</th>
              <th>Location</th>
              <th class="is-hidden-mobile">In-game time</th>
              <th class="is-hidden-mobile">Added</th>
              <th v-if="isEditor">Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="character of characters" :key="character.id">
              <td>
                <router-link
                  :to="
                    `/${character.user_name}/${character.name}${character.id}`
                  "
                >
                  {{ character.name }}
                </router-link>
              </td>
              <td>
                <span
                  :class="
                    `is-hidden-desktop has-text-capitalized ${character.hero}`
                  "
                  >{{ character.hero }}
                </span>
                <span :class="`is-hidden-touch ${character.hero}`">
                  {{ character.hero | HeroNameFilter }}
                </span>
              </td>
              <td>
                <span v-if="!character.hc">SC</span>
                <span v-if="character.hc" class="has-text-danger">HC</span>
              </td>
              <td>
                <span v-if="!(character.hc && character.dead)">
                  {{ character.area | AreaNameFilter }}
                </span>
                <span
                  v-if="character.hc && character.dead"
                  class="has-text-warning"
                >
                  Died in {{ character.area | AreaNameFilter }}
                </span>
              </td>
              <td class="is-hidden-mobile">
                {{ character.seconds_played | DurationFilter }}
              </td>
              <td class="is-hidden-mobile has-text-grey is-narrow">
                {{ character.start_time | FromNowFilter }}
              </td>
              <td v-if="isEditor" class="is-narrow">
                <a class="has-text-danger" @click="deleteCharacter(character)">
                  Delete
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          v-if="moreCharacters"
          class="button is-small is-primary"
          :class="{ 'is-loading': loadingCharacters }"
          @click="loadMoreCharacters()"
        >
          Load more characters
        </button>
      </div>
    </section>
    <!-- Speedrun history -->
    <section class="section pt-0" v-if="speedruns.length > 0">
      <div class="container">
        <div class="columns is-mobile is-multiline">
          <div class="column is-full-mobile">
            <h1 class="subtitle">
              <CountryIcon imgClass="flag" :code="user.country_code" />
              {{ latestCharacter.user_name }}'s Speedruns
            </h1>
          </div>
          <div class="column is-narrow">
            <p class="subtitle has-text-grey">
              <span class="rank-1">{{ speedrunsStatistics.gold }}</span> Gold
            </p>
          </div>
          <div class="column is-narrow">
            <p class="subtitle has-text-grey">
              <span class="rank-2">{{ speedrunsStatistics.silver }}</span>
              Silver
            </p>
          </div>
          <div class="column is-narrow">
            <p class="subtitle has-text-grey">
              <span class="rank-3">{{ speedrunsStatistics.bronze }}</span>
              Bronze
            </p>
          </div>
        </div>
        <table class="table is-fullwidth is-narrow is-striped is-hoverable">
          <thead>
            <tr>
              <th class="is-narrow has-text-centered">#</th>
              <th>Time</th>
              <th>Category</th>
              <th class="is-hidden-mobile has-text-centered">Armory</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="run of speedruns" :key="run.id">
              <td class="has-text-grey has-text-centered">
                <span :class="`rank-${run.category_rank}`">
                  {{ run.category_rank }}
                </span>
              </td>
              <td class="is-narrow">
                <span class="is-family-monospace">
                  <a :href="run.speedrun_link" target="_blank">
                    {{ run.seconds_played | DurationFilter }}
                  </a>
                </span>
              </td>
              <td class="is-narrow">
                <router-link
                  :to="{
                    name: 'Leaderboard',
                    hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                      run.hero
                    }/${run.players_category}`
                  }"
                >
                  {{ run.category_name }}
                  <span :class="`has-hero ${run.hero} is-hidden-touch`">
                    {{ run.hero | HeroNameFilter }}
                  </span>
                  <span :class="`has-hero ${run.hero} is-hidden-desktop`">
                    {{ run.hero }}
                  </span>
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
              </td>
              <td class="is-hidden-mobile has-text-centered">
                <span v-if="run.character_id" class="subtitle is-6">
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
                </span>
              </td>
              <td class="has-text-grey is-narrow">
                {{ run.submit_time | FromNowFilter }}
              </td>
            </tr>
          </tbody>
        </table>
        <button
          v-if="speedrunsPagination.more"
          class="button is-small is-primary"
          :class="{ 'is-loading': loadingSpeedruns }"
          @click="loadMoreSpeedruns()"
        >
          Load more speedruns
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
import CountryIcon from '@/components/CountryIcon.vue';
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
    Icon,
    CountryIcon
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
      latestCharacter: state => state.ws.character
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

        this.characters = this.characters.filter(c => c !== character);

        if (!this.characters.length) {
          await this.loadMoreCharacters();
        }
      }
    }
  }
};
</script>
