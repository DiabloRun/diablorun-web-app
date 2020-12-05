<template>
  <div>
    <!-- Hero -->
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2">Races</h1>
        </div>
      </div>
    </section>
    <!-- Toolbar -->
    <section class="hero is-dark has-margin-bottom">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-multiline is-mobile">
            <div class="column">
              <h1 class="subtitle is-4">
                Race history
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <table class="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th>Race</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="race of races" :key="race.id">
                  <td>
                    <p class="subtitle is-5">
                      <router-link
                        :to="{ name: 'Race', params: { slug: race.id } }"
                      >
                        {{ race.name }}
                      </router-link>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';
</style>

<script>
import { mapState } from 'vuex';
import {
  FromNowFilter,
  AreaNameFilter,
  DifficultyFilter,
  QuestNameFilter,
  QuestShortNameFilter,
  StatNameFilter
} from '@/filters';

export default {
  name: 'Races',
  filters: {
    FromNowFilter,
    AreaNameFilter,
    DifficultyFilter,
    QuestNameFilter,
    QuestShortNameFilter,
    StatNameFilter
  },
  data() {
    return {
      loading: true,
      races: []
    };
  },
  async mounted() {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/races`);
    this.races = await res.json();
    this.loading = false;
  },
  computed: {
    ...mapState({
      race: state => state.ws.race,
      points: state => state.ws.rules.filter(rule => rule.context === 'points'),
      finish_conditions: state =>
        state.ws.rules.filter(rule => rule.context === 'finish_conditions'),
      characters: state => state.ws.characters,
      notifications: state => state.ws.notifications
    })
  }
};
</script>
