<template>
  <div>
    <v-container fluid v-if="!streamOverlay && !isPopup" class="pa-2">
      <v-row dense>
        <v-col cols="12" md="4">
          <v-row dense>
            <v-col cols="12">
              <v-card>
                <!--
                <RaceCountdown
                  :start="race.start_time"
                  :finish="race.finish_time"
                />
                <v-divider></v-divider>
                -->
                <v-card-text class="white--text">
                  <!-- Finish condition type
                  <span v-if="race.finish_conditions_global">
                    Type: race ends for everybody when any runner fulfils a
                    finish condition.
                  </span>
                  <span v-if="!race.finish_conditions_global">
                    Type: race ends for each runner separately when they fulfil
                    a finish condition.
                  </span>
                  -->
                  <!-- Conditions -->
                  <div
                    v-for="condition of finish_conditions"
                    :key="condition.id"
                  >
                    <p
                      v-if="
                        condition.type === 'time' &&
                        condition.time_type === 'race'
                      "
                    >
                      <span class="subtitle is-5 has-text-danger">Finish:</span>
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
                  </div>
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
                <v-divider v-if="race.description.length"></v-divider>
                <v-card-text
                  v-if="race.description.length"
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
                    <h5 class="py-2 pl-4">{{ race.type === 'speedrun' ? 'Splits' : 'Points' }}</h5>
                    <v-divider></v-divider>
                    <RacePoints :points="positivePoints" />
                  </v-card>
                </v-col>
                <v-col v-if="negativePoints.length">
                  <v-card class="fill-height">
                    <h5 class="py-2 pl-4">Penalties</h5>
                    <v-divider></v-divider>
                    <v-card-tex></v-card-tex>
                    <RacePoints :points="negativePoints" />
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-text-field
                outlined
                dense
                :value="race.name"
                label="Race"
                readonly
                hide-details
                class="mt-3"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
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
        </v-col>
        <v-col cols="12" md="8">
          <v-row dense>
            <v-col cols="12" lg="6" v-if="notifications.length">
              <v-card class="fill-height">
                <v-card-text class="white--text">
                  <RaceNotification
                    v-for="(notification, index) of notifications"
                    :key="notification.id"
                    :index="index"
                    :rules="rules"
                    :characters="characters"
                    :notification="notification"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col v-if="pointsChartData.datasets.length" cols="12" lg="6">
              <v-card>
                <ScatterChart
                  ref="pointsChart"
                  :style="{ height: '250px', position: 'relative' }"
                  :chartData="pointsChartData"
                />
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card>
                <v-row no-gutters>
                  <v-col>
                    <v-card-title> {{ race.name }} Leaderboard </v-card-title>
                  </v-col>
                  <v-col cols="auto" class="my-auto mr-4">
                    <v-btn
                      fab
                      small
                      :onclick="`window.open('/race/${race.id}','popup','width=550,height=900'); return false;`"
                      target="popup"
                      :href="`/race/${race.id}`"
                    >
                      <v-icon>mdi-open-in-new</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-card-text v-if="!characters.length > 0">
                  <v-icon left color="primary">mdi-emoticon-sad-outline</v-icon>
                  No one has joined the race yet.
                </v-card-text>
                <v-simple-table
                  dense
                  v-if="characters.length > 0"
                  class="text-no-wrap"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Points</th>
                      <th>Runner</th>
                      <th>Area</th>
                      <th>Level</th>
                      <th>
                        <v-icon small color="error">
                          mdi-skull-crossbones
                        </v-icon>
                      </th>
                      <th>
                        <v-icon small color="warning"> mdi-gold </v-icon>
                      </th>
                      <th>Difficulty</th>
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
                        <v-icon
                          v-if="character.rank == 1"
                          small
                          color="yellow accent-4"
                        >
                          mdi-trophy-outline
                        </v-icon>
                        <v-icon
                          v-if="character.rank == 2"
                          small
                          color="grey lighten-1"
                        >
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
                      <td>{{ character.area | AreaNameFilter }}</td>
                      <td>{{ character.level }}</td>
                      <td>{{ character.deaths }}</td>
                      <td>{{ character.gold_total }}</td>
                      <td>
                        {{ character.difficulty | DifficultyFilter }}
                        <span class="grey--text">p{{ character.players }}</span>
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
                      <td>
                        <CharacterRaceStatus
                          :character="character"
                          :start="race.start_time"
                          :finish="race.finish_time"
                        />
                      </td>
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
              <CharacterRaceStatus
                :character="character"
                :start="race.start_time"
                :finish="race.finish_time"
              />
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
import RaceNotification from '@/components/RaceNotification.vue';
import CharacterUser from '@/components/CharacterUser.vue';
import CharacterRaceStatus from '@/components/CharacterRaceStatus.vue';
import ScatterChart from '@/components/ScatterChart.vue';
import RacePoints from '@/components/RacePoints.vue';

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
    RaceNotification,
    CharacterUser,
    CharacterRaceStatus,
    ScatterChart,
    RacePoints
  },
  data() {
    return {
      loading: true,
      pointsLogIndex: 0,
      pointsChartData: {
        datasets: []
      }
    };
  },
  methods: {
    openPopup() {
      window.open(`/race/${this.race.id}`, 'popup', 'width=500,height=900');
      console.log('hey');
      return false;
    }
  },
  computed: {
    ...mapState({
      race: (state) => state.ws.race,
      rules: (state) => state.ws.rules,
      positivePoints: (state) =>
        state.ws.rules.filter(
          (rule) => rule.context === 'points' && rule.amount > 0
        ),
      negativePoints: (state) =>
        state.ws.rules.filter(
          (rule) => rule.context === 'points' && rule.amount < 0
        ),
      finish_conditions: (state) =>
        state.ws.rules.filter((rule) => rule.context === 'finish_conditions'),
      characters: (state) => state.ws.characters,
      notifications: (state) => state.ws.notifications,
      entry_heroes(state) {
        if (!state.ws.race) {
          return [];
        }

        const heroes = [];

        if (state.ws.race.entry_ama) heroes.push('ama');
        if (state.ws.race.entry_sor) heroes.push('sor');
        if (state.ws.race.entry_nec) heroes.push('nec');
        if (state.ws.race.entry_pal) heroes.push('pal');
        if (state.ws.race.entry_bar) heroes.push('bar');
        if (state.ws.race.entry_dru) heroes.push('dru');
        if (state.ws.race.entry_asn) heroes.push('asn');

        return heroes;
      },
      streamOverlay: (state) => state.app.windowStyle === 'overlay',
      isPopup: (state) => state.app.windowStyle === 'popup',
      lastUpdateTime: (state) => state.ws.lastUpdateTime
    })
  },
  watch: {
    $route: {
      immediate: true,
      async handler({ params: { slug } }) {
        await this.$store.dispatch('ws/subscribeToRace', slug);
      }
    },
    lastUpdateTime() {
      let updateChart = false;

      while (this.pointsLogIndex < this.$store.state.ws.pointsLog.length) {
        const { user_id, update_time, value } = this.$store.state.ws.pointsLog[
          this.pointsLogIndex
        ];
        const character = this.characters.find(
          (character) => character.user_id === user_id
        );

        if (!character) {
          continue;
        }

        let dataset = this.pointsChartData.datasets.find(
          (d) => d.label === character.user_name
        );

        if (!dataset) {
          dataset = {
            label: character.user_name,
            data: [],
            borderColor: character.user_color,
            fill: false,
            showLine: true
          };

          this.pointsChartData.datasets.push(dataset);
        }

        dataset.data.push({
          x: update_time - (this.race.start_time || 0),
          y: value
        });

        ++this.pointsLogIndex;
        updateChart = true;
      }

      if (updateChart && this.$refs.pointsChart) {
        try {
          this.$refs.pointsChart.update();
        } catch (err) {
          // TODO: find out what these errors are about
          console.warn(err);
        }
      }
    }
  }
};
</script>
