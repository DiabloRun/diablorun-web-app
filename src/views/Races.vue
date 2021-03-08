<template>
  <v-container class="pa-2">
    <v-card>
      <v-card-title> Races </v-card-title>
      <v-card-subtitle>Recent history of racing events</v-card-subtitle>
      <v-divider></v-divider>
      <v-row dense class="px-2 pt-2 pb-1">
        <v-col v-for="race of races" :key="race.id" cols="12" md="6">
          <v-card
            hover
            :to="{ name: 'Race', params: { slug: race.id } }"
            color="darkAccent"
            class="fill-height"
          >
            <v-card-title class="primary--text">
              {{ race.name }}
            </v-card-title>
            <v-card-subtitle>{{ race.description }}</v-card-subtitle>
            <v-card-text
              ><v-chip small outlined>{{
                race.start_time | FromNowFilter
              }}</v-chip></v-card-text
            >
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';
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
