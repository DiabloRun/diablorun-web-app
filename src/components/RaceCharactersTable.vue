<template>
  <div>
    <v-data-table :headers="headers" :items="characters"> </v-data-table>

    <v-simple-table dense class="text-no-wrap">
      <thead>
        <tr>
          <th>#</th>
          <th>Points</th>
          <th>Runner</th>
          <th>Area</th>
          <th>Level</th>
          <th>
            <v-icon small color="error"> mdi-skull-crossbones </v-icon>
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
          <td>{{ character.area | AreaNameFilter }}</td>
          <td>{{ character.level }}</td>
          <td>{{ character.deaths }}</td>
          <td>{{ character.gold_total }}</td>
          <td>
            {{ character.difficulty | DifficultyFilter }}
            <span class="grey--text">p{{ character.players }}</span>
          </td>

          <td>
            <v-icon v-if="!character.hc" small :class="`${character.hero}`">
              mdi-sword
            </v-icon>
            <v-icon v-if="character.hc" small :class="`${character.hero}`">
              mdi-skull-outline
            </v-icon>
            {{ character.hero | HeroNameFilter }}
          </td>
          <td>
            <CharacterRaceStatus :character="character" />
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import { AreaNameFilter, DifficultyFilter, HeroNameFilter } from '@/filters';
import CharacterUser from '@/components/CharacterUser.vue';
import CharacterRaceStatus from '@/components/CharacterRaceStatus.vue';

export default {
  name: 'RaceCharactersTable',
  props: {
    characters: Array
  },
  filters: {
    AreaNameFilter,
    DifficultyFilter,
    HeroNameFilter
  },
  components: {
    CharacterUser,
    CharacterRaceStatus
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'rank', sortable: true },
        { text: 'Points', value: 'points', sortable: true },
        { text: 'Runner', value: 'user_name', sortable: true },
        { text: 'Area', value: 'area', sortable: true },
        { text: 'Level', value: 'level', sortable: true },
        { text: 'Deaths', value: 'deaths', sortable: true },
        { text: 'Gold', value: 'gold_total', sortable: true },
        { text: 'Difficulty', value: 'players', sortable: true },
        { text: 'Hero', value: 'hero', sortable: true },
        { text: 'Status', value: 'time', sortable: true }
        /*
          text: string,
          value: string,
          align?: 'start' | 'center' | 'end',
          sortable?: boolean,
          filterable?: boolean,
          groupable?: boolean,
          divider?: boolean,
          class?: string | string[],
          cellClass?: string | string[],
          width?: string | number,
          filter?: (value: any, search: string, item: any) => boolean,
          sort?: (a: any, b: any) => number
        */
      ]
    }
  }
};
</script>
