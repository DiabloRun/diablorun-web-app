<template>
  <v-app>
    <v-container class="my-5">
      <v-row no-gutters>
        <v-col class="my-auto dr-nav">
          <v-row no-gutters>
            <v-col
              cols="auto"
              class="mr-3"
              v-for="mainItem in mainItems"
              :key="mainItem.title"
              :exact="mainItem.exact"
              link
            >
              <v-btn :to="{ name: mainItem.title }" text>
                <v-icon left>{{ mainItem.icon }}</v-icon>
                {{ mainItem.title }}</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
        <v-col class="my-auto" cols="auto">
          <h1 class="logo">diablo<v-icon>mdi-sword</v-icon>run</h1>
        </v-col>
        <v-col v-if="!user" class="my-auto">
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-col
              cols="auto"
              class="ml-3"
              v-for="mainItem in mainItems"
              :key="mainItem.title"
              :exact="mainItem.exact"
              link
            >
              <v-btn :to="{ name: mainItem.title }" text>
                <v-icon left>{{ mainItem.icon }}</v-icon>
                {{ mainItem.title }}</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
        <!-- Logged in -->
        <v-col v-if="user" class="my-auto">
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-col
              cols="auto"
              class="ml-3"
              v-for="userItem in userItems"
              :key="userItem.title"
              :exact="userItem.exact"
              link
            >
              <v-btn :to="{ name: userItem.title }" text>
                <v-icon left>{{ userItem.icon }}</v-icon>
                {{ userItem.title }}</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import '@/assets/styles/global.scss';
</style>

<script>
import { mapState } from 'vuex';
// import ConfirmModal from '@/components/ConfirmModal.vue';

export default {
  name: 'App',
  components: {
    // ConfirmModal
  },
  data() {
    const redirect_uri = `${process.env.VUE_APP_WEB_URL}/profile`;

    return {
      drawer: null,
      mainItems: [
        { title: 'Home', icon: 'mdi-home', exact: true },
        { title: 'Leaderboard', icon: 'mdi-trophy', exact: false },
        // { title: 'Wiki', icon: 'mdi-book-open-variant', exact: true },
        // { title: 'Races', icon: 'mdi-flag-checkered', exact: false },
        { title: 'Users', icon: 'mdi-account-group', exact: true }
      ],
      userItems: [
        { title: 'Profile', icon: 'mdi-account', exact: true },
        { title: 'Setup', icon: 'mdi-cog', exact: true },
        { title: 'Logout', icon: 'mdi-logout', exact: false }
      ],
      otherItems: [
        { title: 'Patreon', icon: 'mdi-patreon' },
        { title: 'Team', icon: 'mdi-human-greeting' }
      ],
      socialItems: [
        {
          title: 'Discord',
          icon: 'mdi-discord',
          url: 'https://discord.gg/QMMDR2a'
        },
        {
          title: 'Open source',
          icon: 'mdi-github',
          url: 'https://github.com/diablorun'
        }
      ],
      loading: false,
      right: null,
      showMenu: false,
      showUserMenu: false,
      twitchAuthenticationUrl: `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.VUE_APP_TWITCH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=`
    };
  },

  computed: {
    ...mapState({
      user: state => state.auth.user,
      // confirmModal: (state) => state.app.confirmModal,
      showHeaderAndFooter: state => state.app.windowStyle === 'window'
    })
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },

    signOut() {
      this.showUserMenu = false;
      this.$store.dispatch('auth/signOut');
    },

    async resetFilters() {
      await this.$store.dispatch('leaderboard/resetFilters');
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler({ hash }) {
        if (hash === '#overlay') {
          this.$store.commit('app/setWindowStyle', 'overlay');
        } else if (window.opener && window.opener !== window) {
          this.$store.commit('app/setWindowStyle', 'popup');
        }
      }
    }
  }
};
</script>
