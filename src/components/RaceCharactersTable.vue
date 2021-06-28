<template>
  <v-data-table
    class="text-no-wrap"
    :headers="headers"
    :items="characters"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :hide-default-footer="true"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td><CharacterUser :character="item" /></td>
        <td>
          <v-tooltip bottom v-if="item.hc">
            <template v-slot:activator="{ on, attrs }">
              <v-avatar v-bind="attrs" v-on="on" size="30px" class="mr-1 hc">
                <Icon :name="item.hero" />
              </v-avatar>
            </template>
            <span>
              Hardcore {{ item.hero | HeroNameFilter }} {{ item.name }}</span
            >
          </v-tooltip>
          <v-tooltip bottom v-if="!item.hc">
            <template v-slot:activator="{ on, attrs }">
              <v-avatar v-bind="attrs" v-on="on" size="30px" class="mr-1">
                <Icon :name="item.hero" />
              </v-avatar>
            </template>
            <span>
              Softcore {{ item.hero | HeroNameFilter }} {{ item.name }}</span
            >
          </v-tooltip>
          {{ item.level }}
        </td>
        <td>
          {{ item.deaths }}
        </td>
        <td>
          {{ item.total_kills }}
        </td>
        <td>
          {{ item.gold_total }}
        </td>
        <td>
          {{ item.area | AreaNameFilter }}
        </td>
        <td>
          {{ item.difficulty | DifficultyFilter }} Players {{ item.players }}
        </td>
        <td class="monospace text-right">
          {{ item.seconds_played | DurationFilter }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import {
  AreaNameFilter,
  DifficultyFilter,
  HeroNameFilter,
  DurationFilter
} from '@/filters';
import CharacterUser from '@/components/CharacterUser.vue';
// import CharacterRaceStatus from '@/components/CharacterRaceStatus.vue';
import Icon from '@/components/Icon.vue';

export default {
  name: 'RaceCharactersTable',
  props: {
    characters: Array
  },
  filters: {
    AreaNameFilter,
    DifficultyFilter,
    HeroNameFilter,
    DurationFilter
  },
  components: {
    CharacterUser,
    // CharacterRaceStatus,
    Icon
  },
  data() {
    return {
      headers: [
        // { text: '#', value: 'rank', sortable: true },
        // { text: 'Points', value: 'points', sortable: true },
        { text: 'Runner', value: 'user_name', sortable: true },
        { text: 'Level', value: 'level', sortable: true },
        { text: 'Deaths', value: 'deaths', sortable: true },
        { text: 'Kills', value: 'total_kills', sortable: true },
        { text: 'Gold', value: 'gold_total', sortable: true },
        { text: 'Area', value: 'area', sortable: false },
        { text: 'Difficulty', value: 'players', sortable: false },
        { text: 'Playtime', value: 'time', align: 'end', sortable: false }
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
      ],
      sortBy: 'level',
      sortDesc: true
    };
  }
};
</script>
