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
        <CountryIcon v-if="user.country_code" :code="user.country_code" />
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
    </v-row>
    <v-row dense>
      <v-col cols="12" v-if="characters.length">
        <h1>Hero History</h1>
        <v-data-table
          class="text-no-wrap"
          :headers="headers"
          :items="characters"
          :items-per-page="-1"
          :hide-default-footer="true"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>
                <router-link
                  class="ml-1"
                  :class="{ 'hc--text': item.hc }"
                  :to="{
                    name: 'Character',
                    params: {
                      user_name: item.user_name,
                      character_slug: item.name + item.id
                    }
                  }"
                >
                  <v-avatar size="30px" class="mr-1">
                    <Icon v-if="item.hc" :name="item.hero" class="hc" />
                    <Icon v-if="!item.hc" :name="item.hero" />
                  </v-avatar>
                  <v-icon v-if="item.dead" class="mr-1" color="error">
                    mdi-skull-crossbones
                  </v-icon>
                  {{ item.name }}
                </router-link>
              </td>
              <td>
                {{ item.level }}
              </td>
              <td>{{ item.area | AreaNameFilter }}</td>
              <td>{{ item.difficulty | DifficultyFilter }}</td>
              <td class="monospace">
                {{ item.in_game_time | DurationFilter }}
              </td>
              <td class="text-right">
                {{ item.start_time | FromNowFilter }}
                <!-- TODO: Deleting characters. Doesn't work, not sure why
                  <td v-if="isEditor">
                    <a @click="deleteCharacter(character)"> Delete </a>
                  </td>
                -->
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-btn
          v-if="moreCharacters"
          class="mt-3"
          small
          @click="loadMoreCharacters()"
        >
          <v-icon left>mdi-chevron-down</v-icon> Load more
        </v-btn>
      </v-col>
      <v-col v-if="speedruns.length">
        <h1>Leaderboard standings</h1>
        <v-data-table
          class="text-no-wrap"
          :headers="speedrunsHeaders"
          :items="speedruns"
          :items-per-page="-1"
          :hide-default-footer="true"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>
                {{ item.category_rank }}
              </td>
              <td class="monospace">
                <a :href="item.speedrun_link" target="_blank">
                  {{ item.seconds_played | DurationFilter }}
                </a>
              </td>
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
                <v-tooltip bottom v-if="item.hc">
                  <template v-slot:activator="{ on, attrs }">
                    <v-avatar
                      v-bind="attrs"
                      v-on="on"
                      size="30px"
                      class="ml-1 hc"
                    >
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
                    Gold in {{ item.category_name }} ({{
                      item.players_category
                    }})
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
                    Silver in {{ item.category_name }} ({{
                      item.players_category
                    }})
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
                    Bronze in {{ item.category_name }} ({{
                      item.players_category
                    }})
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
        <v-btn
          v-if="speedrunsPagination.more"
          class="mt-3"
          small
          @click="loadMoreSpeedruns()"
        >
          <v-icon left>mdi-chevron-down</v-icon> Load more
        </v-btn>
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
  PlayersCategoryNameFilter,
  BigNumberFilter
} from '@/filters';
import CountryIcon from '@/components/CountryIcon.vue';
import Icon from '@/components/Icon.vue';

export default {
  name: 'Character',
  filters: {
    FromNowFilter,
    DifficultyFilter,
    AreaNameFilter,
    DurationFilter,
    HeroNameFilter,
    PlayersCategoryNameFilter,
    BigNumberFilter
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
    loadingSpeedruns: true,
    headers: [
      { text: 'Hero', value: 'character_name', sortable: false },
      { text: 'Level', value: 'level' },
      { text: 'Area', value: 'area' },
      { text: 'Difficulty', value: 'difficulty' },
      {
        text: 'Playtime',
        value: 'in_game_time'
      },
      { text: 'Added', value: 'start_time', align: 'end' }
    ],
    speedrunsHeaders: [
      { text: 'Rank', value: 'category_rank' },
      { text: 'Time', value: 'seconds_played' },
      { text: 'Category', value: 'category_name' },
      { text: 'Hero', value: 'character_name', sortable: false },
      { text: 'Submitted', value: 'submit_time', align: 'end' }
    ]
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
        `${process.env.VUE_APP_API_URL}/characters?user_name=${this.username}&offset=${this.offsetCharacters}&limit=30`
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
        `${process.env.VUE_APP_API_URL}/speedruns?user_id=${this.user.id}&offset=${this.speedrunsPagination.offset}&limit=30&order_by=submit_time&order_dir=DESC`
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

        this.characters = this.characters.filter((c) => c !== character);

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
