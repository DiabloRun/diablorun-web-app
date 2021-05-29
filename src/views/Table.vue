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
        const table = [];

        for (const id in state.ws.characters) {
          const character = state.ws.characters[id];

          if (this.usernames.includes(character.user_name.toLowerCase())) {
            table.push(character);
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
        this.usernames = to.params.pathMatch.split('/').map(username => username.toLowerCase());

        for (const name of this.usernames) {
          await this.$store.dispatch('ws/subscribeToCharacter', {
            name,
            id: ''
          });
        }
      }
    }
  },
  async destroyed() {
    for (const name of this.usernames) {
      await this.$store.dispatch('ws/unsubscribeFromCharacter', name);
    }
  }
};
</script>
