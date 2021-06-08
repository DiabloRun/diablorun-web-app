<template>
  <v-container v-if="user" class="mt-5">
    <v-row dense>
      <!-- User icon -->
      <v-col cols="auto" class="mr-3">
        <v-avatar size="64">
          <img
            v-if="user.profile_image_url !== ''"
            :src="user.profile_image_url"
          />
          <v-icon v-if="user.profile_image_url == ''" size="64" color="primary">
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-col>
      <!-- Title -->
      <v-col class="my-auto">
        <h2>
          {{ user.name }}
        </h2>
        <h2 class="subtitle">
          Played {{ latestCharacter.update_time | FromNowFilter }} with
          <router-link
            :to="{
              name: 'Character',
              params: {
                user_name: latestCharacter.user_name,
                character_slug: '@'
              }
            }"
          >
            {{ latestCharacter.hero | HeroNameFilter }}
            {{ latestCharacter.name }}
          </router-link>
        </h2>
      </v-col>
      <v-col cols="auto" class="my-auto">
        <v-btn icon :href="`https://twitch.com/${user.name}`" target="_blank">
          <v-icon> mdi-twitch </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-row dense class="mt-3">
          <v-col class="my-auto">
            <v-row>
              <v-col cols="auto">
                <v-icon left color="gold"> mdi-trophy-outline </v-icon>
                {{ speedrunsStatistics.gold }}
              </v-col>
              <v-col cols="auto">
                <v-icon left color="silver"> mdi-trophy-outline </v-icon>
                {{ speedrunsStatistics.silver }}
              </v-col>
              <v-col cols="auto">
                <v-icon left color="bronze"> mdi-trophy-outline </v-icon>
                {{ speedrunsStatistics.bronze }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="3" xl="2">
            <v-text-field
              dense
              outlined
              :value="'https://diablo.run/' + user.name + '/@'"
              label="Share active character link"
              readonly
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="auto" class="my-auto">
            <v-btn
              :to="{
                name: 'Character',
                params: {
                  user_name: latestCharacter.user_name,
                  character_slug: '@'
                }
              }"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <!-- Content -->
      <v-col cols="12" class="mt-3">
        <v-card>
          <div v-if="characters.length">
            <v-card-title> Hero history </v-card-title>
            <v-card-text>
              <v-simple-table dense class="text-no-wrap">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Core</th>
                    <th>Hero</th>
                    <th>Area</th>
                    <th>Playtime</th>
                    <th>Added</th>
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
                        >{{ character.name }}
                      </router-link>
                      <v-icon v-if="character.dead" small color="error">
                        mdi-skull-crossbones
                      </v-icon>
                    </td>
                    <td>{{ character.level }}</td>
                    <td>
                      <span v-if="!character.hc">SC</span>
                      <span v-if="character.hc" class="error--text">HC</span>
                    </td>
                    <td>
                      <v-icon
                        v-if="!character.hc"
                        small
                        :class="`${character.hero}`"
                      >
                        mdi-sword
                      </v-icon>
                      <v-icon
                        v-if="character.hc"
                        small
                        :class="`${character.hero}`"
                      >
                        mdi-skull-outline
                      </v-icon>
                      {{ character.hero | HeroNameFilter }}
                    </td>
                    <td>{{ character.area | AreaNameFilter }}</td>
                    <td>{{ character.in_game_time | DurationFilter }}</td>
                    <td>{{ character.start_time | FromNowFilter }}</td>
                    <td v-if="isEditor">
                      <a @click="deleteCharacter(character)"> Delete </a>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
              <v-btn
                v-if="moreCharacters"
                class="mt-3"
                small
                @click="loadMoreCharacters()"
              >
                <v-icon left>mdi-chevron-down</v-icon> Load more
              </v-btn>
            </v-card-text>
          </div>

          <div v-if="speedruns.length">
            <v-divider />
            <v-card-title> Race standings </v-card-title>
            <v-card-text>
              <v-simple-table dense class="text-no-wrap">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Time</th>
                    <th>Category</th>
                    <th>Hero</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="run of speedruns" :key="run.id">
                    <td class="grey--text">
                      <span v-if="run.category_rank > 3">{{
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
                        {{ run.hc ? 'HC' : '' }}
                        {{ run.players_category }}
                      </router-link>
                    </td>
                    <td>
                      <router-link
                        v-if="run.character_id"
                        :to="{
                          name: 'Character',
                          params: {
                            user_name: run.user_name,
                            character_slug:
                              run.character_name + run.character_id
                          }
                        }"
                      >
                        <v-icon v-if="!run.hc" small :class="`${run.hero}`">
                          mdi-sword
                        </v-icon>
                        <v-icon v-if="run.hc" small :class="`${run.hero}`">
                          mdi-skull-outline
                        </v-icon>
                        {{ run.hero | HeroNameFilter }}
                      </router-link>
                      <span v-if="!run.character_id">
                        <v-icon v-if="!run.hc" small :class="`${run.hero}`">
                          mdi-sword
                        </v-icon>
                        <v-icon v-if="run.hc" small :class="`${run.hero}`">
                          mdi-skull-outline
                        </v-icon>
                        {{ run.hero | HeroNameFilter }}
                      </span>
                    </td>
                    <td>{{ run.submit_time | FromNowFilter }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
              <v-btn
                v-if="speedrunsPagination.more"
                class="mt-3"
                small
                @click="loadMoreSpeedruns()"
              >
                <v-icon left>mdi-chevron-down</v-icon> Load more
              </v-btn>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';

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
// import Icon from '@/components/Icon.vue';

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
    // Icon
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
      latestCharacter(state) {
        const id = state.characters.latestIds[this.username];
        return state.characters.snapshots[id].character;
      }
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
        this.characters = characters.data;
        this.moreCharacters = characters.meta.more;
        this.offsetCharacters = characters.meta.offset;
        this.loadingCharacters = false;

        this.speedruns = speedruns.speedruns;
        this.speedrunsStatistics = speedruns.statistics;
        this.speedrunsPagination = speedruns.pagination;
        this.loadingSpeedruns = false;

        this.$store.commit('characters/set', lastUpdate);
        this.$store.dispatch('characters/subscribeToUser', this.username);
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
          message: `Are you sure you wish to delete level ${character.level} ${character.name}?`,
          verify: `Delete ${character.name}`
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
  },
  destroyed() {
    this.$store.dispatch('characters/unsubscribeFromUser', this.username);
  }
};
</script>
