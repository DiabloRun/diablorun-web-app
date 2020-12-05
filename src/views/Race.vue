<template>
  <div v-if="race.id">
    <div v-if="!streamOverlay && !isPopup">
      <!-- Hero  -->
      <section class="hero is-primary">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-vcentered is-multiline is-mobile">
              <div class="column">
                <h1 class="title is-1">{{ race.name }}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Toolbar -->
      <section class="hero is-dark has-margin-bottom">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-vcentered">
              <div class="column">
                <RaceCountdown
                  :start="race.start_time"
                  :finish="race.finish_time"
                />
              </div>
              <div
                class="column is-narrow has-text-right has-text-left-mobile"
                v-if="!race.start_time && race.estimated_start_time"
              >
                <h1 class="subtitle is-5">
                  Estimated start:
                  {{ race.estimated_start_time | LocalTimeFilter }} ({{
                    race.estimated_start_time | FromNowFilter
                  }})
                </h1>
              </div>
              <div class="column is-narrow is-hidden-mobile">
                <button
                  :onclick="
                    `window.open('/race/${race.id}','popup','width=550,height=900'); return false;`
                  "
                  target="popup"
                  :href="`/race/${race.id}`"
                  class="button is-primary"
                >
                  Popout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Leaderboard -->
      <section class="section">
        <div class="container">
          <!-- Race is empty -->
          <div
            class="notification is-dark has-text-centered"
            v-if="!characters.length > 0"
          >
            <p>Noone has entered the race.</p>
          </div>
          <!-- Participants -->
          <table
            class="table is-striped is-hoverable"
            v-if="characters.length > 0"
          >
            <thead>
              <tr>
                <th class="has-text-centered has-text-fade">#</th>
                <th>Runner</th>
                <th class="has-text-centered is-hidden-touch">Points</th>
                <th class="has-text-centered is-hidden-touch">Level</th>
                <th class="has-text-centered is-hidden-desktop">pts</th>
                <th class="has-text-centered is-hidden-desktop">lvl</th>
                <th class="has-text-centered" v-if="entry_heroes.length > 1">
                  Hero
                </th>
                <th class="has-text-centered">Area</th>
                <th class="has-text-right is-hidden-mobile">Status</th>
              </tr>
            </thead>
            <tbody class="has-no-overflow">
              <tr v-for="character of characters" :key="character.id">
                <td class="is-narrow has-text-centered">
                  <p
                    :class="
                      `subtitle is-6 has-text-fade rank-${character.rank}`
                    "
                  >
                    {{ character.rank }}
                  </p>
                </td>
                <td class="is-narrow-desktop has-no-overflow">
                  <p class="subtitle is-5">
                    <CharacterUser :character="character" />
                  </p>
                </td>

                <td class="has-text-centered is-right-mobile">
                  <p class="subtitle is-5">
                    {{ character.points }}
                  </p>
                </td>
                <td class="has-text-centered">
                  <p class="subtitle is-5">
                    {{ character.level }}
                  </p>
                </td>
                <td class="has-text-centered" v-if="entry_heroes.length > 1">
                  <span
                    :class="
                      `is-hidden-touch has-hero ${character.hero} subtitle is-5`
                    "
                    >{{ character.hero | HeroNameFilter }}</span
                  >
                  <span
                    :class="
                      `is-hidden-desktop has-hero ${character.hero} subtitle is-5`
                    "
                    >{{ character.hero }}</span
                  >
                </td>
                <td class="has-text-centered has-no-overflow">
                  <p class="subtitle is-5">
                    {{ character.area | AreaNameFilter }}
                  </p>
                </td>
                <td class="has-text-right is-narrow is-hidden-mobile">
                  <p class="subtitle is-6">
                    <CharacterRaceStatus
                      :character="character"
                      :start="race.start_time"
                      :finish="race.finish_time"
                    />
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="tile is-ancestor">
            <div class="tile is-vertical is-parent">
              <div class="tile is-child box" v-if="positivePoints.length">
                <p class="subtitle is-4">Points</p>
                <RacePoints :points="positivePoints" />
              </div>
              <div class="tile is-child box" v-if="negativePoints.length">
                <p class="subtitle is-4">Penalties</p>
                <RacePoints :points="negativePoints" />
              </div>
              <div class="tile is-child box" v-if="notifications.length">
                <RaceNotification
                  v-for="(notification, index) of notifications"
                  :key="notification.id"
                  :index="index"
                  :rules="rules"
                  :characters="characters"
                  :notification="notification"
                />
              </div>
            </div>
            <div class="tile is-6 is-vertical is-parent">
              <div
                class="tile is-child box"
                v-if="pointsChartData.datasets.length"
              >
                <p class="subtitle is-4">Points over time</p>
                <ScatterChart
                  ref="pointsChart"
                  :style="{ height: '250px', position: 'relative' }"
                  :chartData="pointsChartData"
                />
              </div>
              <div class="tile is-child box" v-if="race.description.length">
                <p class="subtitle is-4">Description</p>
                <div
                  :inner-html.prop="race.description | ParagraphsFilter"
                ></div>
              </div>
              <div class="tile is-child box">
                <p class="subtitle is-4">Rules</p>
                <!-- Type -->
                <p v-if="race.finish_conditions_global">
                  <span class="subtitle is-5 has-text-danger">Type:</span> race
                  ends for everybody when any runner fulfils a finish condition.
                </p>
                <p v-if="!race.finish_conditions_global">
                  <span class="subtitle is-5 has-text-danger">Type:</span> race
                  ends for each runner separately when they fulfil a finish
                  condition.
                </p>
                <!-- Conditions -->
                <div v-for="condition of finish_conditions" :key="condition.id">
                  <p
                    v-if="
                      condition.type === 'time' &&
                        condition.time_type === 'race'
                    "
                  >
                    <span class="subtitle is-5 has-text-danger">Finish:</span>
                    race ends {{ condition.time }} after the start of the race.
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
                <div class="columns is-mobile has-small-margin-top">
                  <div class="column is-narrow">
                    <Icon :name="race.entry_hc ? 'hc' : 'sc'" />
                  </div>
                  <div class="column is-narrow">
                    <Icon :name="race.entry_players" />
                  </div>
                  <div class="column">
                    <Icon
                      v-for="hero of entry_heroes"
                      :key="hero"
                      :name="hero"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
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
      <section class="section">
        <div class="container has-text-centered">
          <RaceCountdown :start="race.start_time" :finish="race.finish_time" />
        </div>
      </section>
      <!-- Race is empty -->
      <div
        class="notification is-dark has-text-centered"
        v-if="!characters.length > 0"
      >
        <p>Noone has entered the race.</p>
      </div>
      <!-- Participants -->
      <table
        class="table is-fullwidth is-striped is-hoverable"
        v-if="characters.length > 0"
      >
        <thead>
          <tr>
            <th class="has-text-centered has-text-fade">#</th>
            <th>Runner</th>
            <th class="has-text-centered is-hidden-touch">Points</th>
            <th class="has-text-centered is-hidden-touch">Level</th>
            <th class="has-text-centered is-hidden-desktop">pts</th>
            <th class="has-text-centered is-hidden-desktop">lvl</th>
            <th class="has-text-centered" v-if="entry_heroes.length > 1">
              Hero
            </th>
            <th class="has-text-centered">Area</th>
          </tr>
        </thead>
        <tbody class="has-no-overflow">
          <tr v-for="character of characters" :key="character.id">
            <td class="is-narrow has-text-centered">
              <p :class="`subtitle is-6 has-text-fade rank-${character.rank}`">
                {{ character.rank }}
              </p>
            </td>
            <td class="is-narrow-desktop has-no-overflow">
              <p class="subtitle is-5">
                <CharacterUser :character="character" />
              </p>
            </td>

            <td class="has-text-centered is-right-mobile">
              <p class="subtitle is-5">
                {{ character.points }}
              </p>
            </td>
            <td class="has-text-centered">
              <p class="subtitle is-5">
                {{ character.level }}
              </p>
            </td>
            <td class="has-text-centered" v-if="entry_heroes.length > 1">
              <span
                :class="
                  `is-hidden-touch has-hero ${character.hero} subtitle is-5`
                "
                >{{ character.hero | HeroNameFilter }}</span
              >
              <span
                :class="
                  `is-hidden-desktop has-hero ${character.hero} subtitle is-5`
                "
                >{{ character.hero }}</span
              >
            </td>
            <td class="has-text-centered has-no-overflow">
              <p class="subtitle is-5">
                {{ character.area | AreaNameFilter }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <section v-if="positivePoints.length" class="section has-no-padding-top">
        <div class="box">
          <RacePoints :points="positivePoints" />
        </div>
      </section>
      <section v-if="negativePoints.length" class="section has-no-padding-top">
        <div class="box">
          <RacePoints :points="negativePoints" />
        </div>
      </section>
      <section class="section has-no-padding-top">
        <div class="box">
          <!-- Conditions -->
          <div v-for="condition of finish_conditions" :key="condition.id">
            <p
              v-if="condition.type === 'time' && condition.time_type === 'race'"
            >
              <span class="subtitle is-5 has-text-danger">Finish:</span> ends
              {{ condition.time }} after the start of the race.
            </p>
            <p
              v-if="
                condition.type === 'time' && condition.time_type === 'character'
              "
            >
              <span class="subtitle is-5 has-text-danger">Finish:</span> race
              ends {{ condition.time }} after character creation.
            </p>
            <p v-if="condition.type === 'quest'">
              <!--<QuestIcon :id="condition.quest_id" />-->
              <span class="subtitle is-5 has-text-danger">Finish:</span>
              complete
              {{ condition.quest_id | QuestShortNameFilter }}
              in {{ condition.difficulty | DifficultyFilter }}.
            </p>
            <p v-if="condition.type === 'stat'">
              <span class="subtitle is-5 has-text-danger">Finish:</span> reach
              {{ condition.counter }} {{ condition.stat | StatNameFilter }}.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';
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
      race: state => state.ws.race,
      rules: state => state.ws.rules,
      positivePoints: state =>
        state.ws.rules.filter(
          rule => rule.context === 'points' && rule.amount > 0
        ),
      negativePoints: state =>
        state.ws.rules.filter(
          rule => rule.context === 'points' && rule.amount < 0
        ),
      finish_conditions: state =>
        state.ws.rules.filter(rule => rule.context === 'finish_conditions'),
      characters: state => state.ws.characters,
      notifications: state => state.ws.notifications,
      entry_heroes: state =>
        state.ws.race ? state.ws.race.entry_hero.split(',') : [],
      streamOverlay: state => state.app.windowStyle === 'overlay',
      isPopup: state => state.app.windowStyle === 'popup',
      lastUpdateTime: state => state.ws.lastUpdateTime
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
          character => character.user_id === user_id
        );

        if (!character) {
          continue;
        }

        let dataset = this.pointsChartData.datasets.find(
          d => d.label === character.user_name
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
