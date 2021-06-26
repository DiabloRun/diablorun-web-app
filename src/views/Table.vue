<template>
  <v-container>
    <v-btn
      small
      :href="'https://kadgar.net/live/' + usernames.join('/')"
      target="_blank"
      class="mb-3"
    >
      <v-icon small left>
        mdi-play-box-multiple
      </v-icon>
      Kadgar.net Multitwitch
    </v-btn>
    <RaceCharactersTable v-if="characters.length" :characters="characters" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import RaceCharactersTable from '@/components/RaceCharactersTable.vue';

export default {
  filters: {},
  components: {
    RaceCharactersTable
  },
  name: 'Table',
  data() {
    return {
      usernames: []
    };
  },
  computed: {
    ...mapState({
      characters(state) {
        const table = [];

        for (const name of this.usernames) {
          const id = state.characters.latestIds[name];
          const snapshot = state.characters.snapshots[id];

          if (snapshot) {
            table.push(snapshot.character);
          }
        }

        return table;
      }
    })
  },
  watch: {
    $route: {
      immediate: true,
      async handler(to) {
        this.usernames = to.params.pathMatch
          .split('/')
          .map(username => username.toLowerCase());

        for (const name of this.usernames) {
          await this.$store.dispatch('characters/fetchLatestCharacter', name);
          this.$store.dispatch('characters/subscribeToUser', name);
        }
      }
    }
  },
  destroyed() {
    for (const name of this.usernames) {
      this.$store.dispatch('characters/unsubscribeFromUser', name);
    }
  }
};
</script>
