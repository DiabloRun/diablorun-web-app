<template>
  <v-container>
    <RaceCharactersTable v-if="characters.length" :characters="characters" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import RaceCharactersTable from '@/components/RaceCharactersTable.vue';

export default {
  filters: {
  },
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
        return this.usernames.map(username => state.ws.characters[username]).filter(character => !!character);
      }
    })
  },
  watch: {
    $route: {
      immediate: true,
      async handler(to) {
        this.usernames = to.params.pathMatch.split('/').map(username => username.toLowerCase());

        for (const name of this.usernames) {
          await this.$store.dispatch('ws/subscribeToCharacter', {
            name,
            id: ''
          });
        }
      }
    }
  }
};
</script>
