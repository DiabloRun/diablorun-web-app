<template v-if="race">
  <div v-if="race">
    <v-container fluid v-if="!streamOverlay && !isPopup" class="mt-5">
      <!-- Header -->
      <v-row dense>
        <v-col class="my-auto">
          <h2>{{ race.name }}</h2>
        </v-col>
        <v-col cols="auto">
          <v-text-field
            outlined
            dense
            :value="race.id"
            label="Race"
            readonly
            hide-details
            class="mt-3"
          ></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-text-field
            outlined
            dense
            prepend-inner-icon="mdi-share"
            :value="'https://diablo.run/race/' + race.id"
            :label="'Share ' + race.name"
            readonly
            hide-details
            class="my-3"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Content -->
      <v-row dense>
        <!-- Leaderboard -->
        <v-col cols="12" md="9" sm="12">
          <v-row dense>
            <v-col cols="12">
              <v-card>
                <v-row no-gutters>
                  <v-col>
                    <RaceCountdown
                      :start="race.start_time"
                      :finish="race.finish_time"
                    />
                  </v-col>
                </v-row>

                <v-divider></v-divider>

                <v-card-text v-if="!characters.length">
                  <v-icon left color="primary">mdi-emoticon-sad-outline</v-icon>
                  No one has finished the race yet.
                </v-card-text>
                <RaceCharactersTable
                  v-if="characters.length"
                  :race="race"
                  :characters="characters"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <v-row dense>
            <v-col cols="12">
              <v-card>
                <v-card-title>Rules</v-card-title>
                <v-divider></v-divider>

                <!-- Conditions -->
                <v-card-text>
                  <span
                    v-for="condition of finish_conditions"
                    :key="condition.id"
                  >
                    <p
                      v-if="
                        condition.type === 'time' &&
                          condition.time_type === 'race'
                      "
                    >
                      <span class="subtitle is-5 text--danger">Finish:</span>
                      race ends {{ condition.time }} after the start of the
                      race.
                    </p>
                    <p
                      v-if="
                        condition.type === 'time' &&
                          condition.time_type === 'character'
                      "
                    >
                      <span class="subtitle is-5 has-text-danger">Finish:</span>
                      race ends {{ condition.time }} after character creation.
                    </p>
                    <p v-if="condition.type === 'quest'">
                      <!--<QuestIcon :id="condition.quest_id" />-->
                      <span class="subtitle is-5 has-text-danger">Finish:</span>
                      complete
                      {{ condition.quest_id | QuestShortNameFilter }}
                      in {{ condition.difficulty | DifficultyFilter }}.
                    </p>
                    <p v-if="condition.type === 'stat'">
                      <span class="subtitle is-5 has-text-danger">Finish:</span>
                      reach {{ condition.counter }}
                      {{ condition.stat | StatNameFilter }}.
                    </p>
                  </span>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                  <!-- In-game requirements -->
                  <v-row class="pt-3">
                    <v-col v-if="!race.entry_hc" cols="auto">
                      <v-icon small color="primary"> mdi-sword </v-icon>
                      Softcore
                    </v-col>
                    <v-col v-if="race.entry_hc" cols="auto" class="error--text">
                      <v-icon small color="error"> mdi-skull-outline </v-icon>
                      Hardcore
                    </v-col>
                    <v-col cols="auto">
                      <v-icon small color="primary">
                        mdi-slash-forward-box
                      </v-icon>
                      Players set to {{ race.entry_players }}
                    </v-col>
                    <v-col v-if="race.entry_classic" cols="auto">
                      <v-icon small color="primary">
                        mdi-alpha-c-circle
                      </v-icon>
                      Classic
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="pt-1">
                    <v-col>
                      <v-avatar
                        size="42"
                        class="mr-2 mt-2"
                        v-for="hero of entry_heroes"
                        :key="hero"
                      >
                        <Icon :name="'big-' + hero" />
                      </v-avatar>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider v-if="race.description"></v-divider>
                <v-card-text
                  v-if="race.description"
                  class="white--text"
                  :inner-html.prop="race.description | ParagraphsFilter"
                >
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-row dense>
                <v-col v-if="positivePoints.length">
                  <v-card class="fill-height">
                    <h5 class="py-2 pl-4">Points</h5>
                    <v-divider></v-divider>
                    <RacePoints :points="positivePoints" />
                  </v-card>
                </v-col>
                <v-col v-if="negativePoints.length">
                  <v-card class="fill-height">
                    <h5 class="py-2 pl-4">Penalties</h5>
                    <v-divider></v-divider>
                    <RacePoints :points="negativePoints" />
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <!-- Finish conditions -->
                  <v-card class="fill-height">
                    <h5 class="py-2 pl-4">Finish conditions</h5>
                    <v-divider></v-divider>
                    <v-list dense>
                      <v-list-item
                        v-for="condition of finish_conditions"
                        :key="condition.id"
                      >
                        <v-list-item-title
                          v-if="
                            condition.type === 'time' &&
                              condition.time_type === 'race'
                          "
                        >
                          <span class="subtitle is-5 has-text-danger"
                            >Finish:</span
                          >
                          race ends {{ condition.time }} after the start of the
                          race.
                        </v-list-item-title>
                        <v-list-item-title
                          v-if="
                            condition.type === 'time' &&
                              condition.time_type === 'character'
                          "
                        >
                          <span class="subtitle is-5 has-text-danger"
                            >Finish:</span
                          >
                          race ends {{ condition.time }} after character
                          creation.
                        </v-list-item-title>
                        <v-list-item-title v-if="condition.type === 'quest'">
                          <!--<QuestIcon :id="condition.quest_id" />-->
                          <span class="subtitle is-5 has-text-danger"
                            >Finish:</span
                          >
                          complete
                          {{ condition.quest_id | QuestShortNameFilter }}
                          in {{ condition.difficulty | DifficultyFilter }}.
                        </v-list-item-title>
                        <v-list-item-title
                          v-if="condition.type === 'super_unique'"
                        >
                          <span class="subtitle is-5 has-text-danger"
                            >Finish:</span
                          >
                          kill
                          {{ condition.monster_id }}
                          in {{ condition.difficulty | DifficultyFilter }}.
                        </v-list-item-title>
                        <v-list-item-title v-if="condition.type === 'stat'">
                          <span class="subtitle is-5 has-text-danger"
                            >Finish:</span
                          >
                          reach {{ condition.counter }}
                          {{ condition.stat | StatNameFilter }}.
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <!-- Users in race lobby -->
            <v-col cols="12">
              <v-card>
                <v-row no-gutters>
                  <v-col>
                    <v-card-title> Lobby </v-card-title>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-card-text v-if="!lobby.length">
                  <v-icon left color="primary">mdi-emoticon-sad-outline</v-icon>
                  No users in the lobby.
                </v-card-text>
                <v-simple-table v-if="lobby.length > 0" class="text-no-wrap">
                  <tbody>
                    <tr v-for="user of lobby" :key="user.id">
                      <td><DiabloRunUser :user="user" /></td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div v-if="streamOverlay">
      <div
        class="notification is-dark has-text-centered"
        v-if="!characters.length > 0"
      >
        <p>Noone has entered the race.</p>
      </div>
      <table
        class="table is-fullwidth is-transparent"
        v-if="characters.length > 0"
      >
        <thead>
          <tr class="has-light-text-fade">
            <th>
              <span class="mr-2">
                <RaceCountdown
                  :tag="false"
                  :start="race.start_time"
                  :finish="race.finish_time"
                />
              </span>
            </th>
            <th class="has-text-right is-narrow">
              <span class="title is-4">area</span>
            </th>
            <th class="has-text-right is-narrow">
              <span class="title is-4">pts</span>
            </th>
            <th class="has-text-right is-narrow">
              <span class="title is-4">lvl</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="character of characters" :key="character.id">
            <td>
              <p class="title is-4 is-narrow">
                <CharacterUser :character="character" />
              </p>
            </td>
            <td class="has-text-right has-no-overflow">
              <p class="title is-4">
                {{ character.area | AreaNameFilter }}
              </p>
            </td>
            <td class="has-text-right is-narrow">
              <p class="title is-4">
                {{ character.points }}
              </p>
            </td>
            <td class="has-text-right is-narrow">
              <p class="title is-4">
                {{ character.level }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="isPopup">
      <RaceCountdown :start="race.start_time" :finish="race.finish_time" />
      <v-simple-table dense v-if="characters.length > 0" class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Pts</th>
            <th>Runner</th>
            <th>Area</th>
            <th>Lvl</th>
            <th>
              <v-icon small color="error"> mdi-skull-crossbones </v-icon>
            </th>
            <th>
              <v-icon small color="warning"> mdi-gold </v-icon>
            </th>
            <th>Hero</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="character of characters" :key="character.id">
            <td>
              <span v-if="character.rank > 3" class="grey--text">
                {{ character.rank }}
              </span>
              <v-icon v-if="character.rank == 1" small color="yellow accent-4">
                mdi-trophy-outline
              </v-icon>
              <v-icon v-if="character.rank == 2" small color="grey lighten-1">
                mdi-trophy-outline
              </v-icon>
              <v-icon v-if="character.rank == 3" small color="brown">
                mdi-trophy-outline
              </v-icon>
            </td>
            <td>
              {{ character.points }}
            </td>
            <td>
              <CharacterUser :character="character" />
              <v-icon v-if="character.dead" small color="error">
                mdi-skull-crossbones
              </v-icon>
            </td>
            <td style="max-width: 80px" class="text-truncate">
              {{ character.area | AreaNameFilter }}
            </td>
            <td>{{ character.level }}</td>
            <td>{{ character.deaths }}</td>
            <td>{{ character.gold_total }}</td>
            <td>
              {{ character.hero }}
            </td>
            <td>
              <CharacterRaceStatus :race="race" :character="character" />
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-divider></v-divider>
      <v-sheet class="pa-3">
        <!-- Conditions -->
        <div v-for="condition of finish_conditions" :key="condition.id">
          <p v-if="condition.type === 'time' && condition.time_type === 'race'">
            <span class="subtitle is-5 has-text-danger">Finish:</span>
            race ends {{ condition.time }} after the start of the race.
          </p>
          <p
            v-if="
              condition.type === 'time' && condition.time_type === 'character'
            "
          >
            <span class="subtitle is-5 has-text-danger">Finish:</span>
            race ends {{ condition.time }} after character creation.
          </p>
          <p v-if="condition.type === 'quest'">
            <!--<QuestIcon :id="condition.quest_id" />-->
            <span class="subtitle is-5 has-text-danger">Finish:</span>
            complete
            {{ condition.quest_id | QuestShortNameFilter }}
            in {{ condition.difficulty | DifficultyFilter }}.
          </p>
          <p v-if="condition.type === 'stat'">
            <span class="subtitle is-5 has-text-danger">Finish:</span>
            reach {{ condition.counter }} {{ condition.stat | StatNameFilter }}.
          </p>
        </div>
      </v-sheet>
      <v-divider></v-divider>
      <v-row no-gutters>
        <v-col v-if="positivePoints.length">
          <v-sheet class="fill-height">
            <RacePoints :points="positivePoints" />
          </v-sheet>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col v-if="negativePoints.length">
          <v-sheet class="fill-height">
            <RacePoints :points="negativePoints" />
          </v-sheet>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';
// Race page styles

.mr-2 {
  margin-right: 1rem;
}
</style>

<script>
import { mapState } from 'vuex';
import {
  FromNowFilter,
  AreaNameFilter,
  DifficultyFilter,
  QuestNameFilter,
  QuestShortNameFilter,
  HeroNameFilter,
  StatNameFilter,
  LocalTimeFilter,
  ParagraphsFilter
} from '@/filters';
import Icon from '@/components/Icon.vue';
import RaceCountdown from '@/components/RaceCountdown.vue';
// import RaceNotification from '@/components/RaceNotification.vue';
import DiabloRunUser from '@/components/DiabloRunUser.vue';
import CharacterUser from '@/components/CharacterUser.vue';
import CharacterRaceStatus from '@/components/CharacterRaceStatus.vue';
// import ScatterChart from '@/components/ScatterChart.vue';
import RacePoints from '@/components/RacePoints.vue';
import RaceCharactersTable from '@/components/RaceCharactersTable.vue';

export default {
  name: 'Race',
  filters: {
    FromNowFilter,
    AreaNameFilter,
    DifficultyFilter,
    QuestNameFilter,
    QuestShortNameFilter,
    HeroNameFilter,
    StatNameFilter,
    LocalTimeFilter,
    ParagraphsFilter
  },
  components: {
    Icon,
    RaceCountdown,
    // RaceNotification,
    DiabloRunUser,
    CharacterUser,
    CharacterRaceStatus,
    // ScatterChart,
    RacePoints,
    RaceCharactersTable
  },
  data() {
    return {
      loading: true,
      // pointsLogIndex: 0,
      pointsChartData: {
        datasets: []
      }
    };
  },
  methods: {
    openPopup() {
      window.open(`/race/${this.race.id}`, 'popup', 'width=500,height=900');
      return false;
    }
  },
  computed: {
    ...mapState({
      race: state => state.race.settings,
      rules: state => state.race.rules,
      lobby: state => state.race.lobby,
      characters: state => state.race.characters,
      notifications: state => state.race.notifications,
      streamOverlay: state => state.app.windowStyle === 'overlay',
      isPopup: state => state.app.windowStyle === 'popup'
      // lastUpdateTime: (state) => state.ws.lastUpdateTime
    }),
    entry_heroes() {
      if (!this.race) {
        return [];
      }

      const heroes = [];

      if (this.race.entry_ama) heroes.push('ama');
      if (this.race.entry_sor) heroes.push('sor');
      if (this.race.entry_nec) heroes.push('nec');
      if (this.race.entry_pal) heroes.push('pal');
      if (this.race.entry_bar) heroes.push('bar');
      if (this.race.entry_dru) heroes.push('dru');
      if (this.race.entry_asn) heroes.push('asn');

      return heroes;
    },
    positivePoints() {
      return this.rules.filter(
        rule => rule.context === 'points' && rule.amount > 0
      );
    },
    negativePoints() {
      return this.rules.filter(
        rule => rule.context === 'points' && rule.amount < 0
      );
    },
    finish_conditions() {
      return this.rules.filter(rule => rule.context === 'finish_conditions');
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler({ params: { slug } }) {
        await this.$store.dispatch('race/subscribe', slug);
      }
    }
  },
  destroyed() {
    this.$store.dispatch('race/unsubscribe');
  }
};
</script>
