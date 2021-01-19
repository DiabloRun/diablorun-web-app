<template>
  <v-app id="inspire">
    <v-app-bar flat dense clipped-left app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-icon color="primary">mdi-sword</v-icon>
      <h2 class="logo mb-1">diablo<span class="grey--text">.</span>run</h2>
      <v-spacer></v-spacer>
      <v-tabs v-if="!user" right>
        <v-tab :href="twitchAuthenticationUrl">
          Login with Twitch
        </v-tab>
      </v-tabs>
      <v-tabs v-if="user" right>
        <v-tab :to="{ name: 'User', params: { user_name: user.name } }">
          <v-avatar size="32">
            <img
              v-if="user.profile_image_url !== ''"
              :src="user.profile_image_url"
            />
            <v-icon
              v-if="user.profile_image_url == ''"
              size="32"
              color="primary"
            >
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </v-tab>
        <v-tab @click="signOut()">Exit</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-navigation-drawer
      color="darker"
      width="200"
      clipped
      v-model="drawer"
      app
    >
      <v-list dense nav>
        <v-list-item
          link
          exact
          v-for="mainItem in mainItems"
          :key="mainItem.title"
          :to="{ name: mainItem.title }"
        >
          <v-icon left>{{ mainItem.icon }}</v-icon>
          <v-list-item-content>
            <v-list-item-title>{{ mainItem.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="user" dense nav>
        <v-list-item
          link
          exact
          :to="{ name: 'User', params: { user_name: user.name } }"
        >
          <v-avatar v-if="user.profile_image_url !== ''" class="mr-2" size="24">
            <img :src="user.profile_image_url" :alt="user.name" />
          </v-avatar>
          <v-icon v-if="user.profile_image_url == ''" left>mdi-account</v-icon>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          exact
          :to="{ name: 'User', params: { user_name: user.name + '/@' } }"
        >
          <v-icon left>mdi-sword</v-icon>
          <v-list-item-content>
            <v-list-item-title>Latest Hero</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          exact
          :to="{ name: 'Race Editor', params: { editor_token: 'new' } }"
        >
          <v-icon left>mdi-flag-plus</v-icon>
          <v-list-item-content>
            <v-list-item-title>Race Editor</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link exact :to="{ name: 'Interface Setup' }">
          <v-icon left>mdi-cogs</v-icon>
          <v-list-item-content>
            <v-list-item-title>Interface Setup</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider v-if="user"></v-divider>
      <v-list dense nav>
        <v-list-item
          link
          exact
          v-for="secondaryItem in secondaryItems"
          :key="secondaryItem.title"
          :to="{ name: secondaryItem.title }"
        >
          <v-icon left>{{ secondaryItem.icon }}</v-icon>
          <v-list-item-content>
            <v-list-item-title>{{ secondaryItem.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          link
          v-for="socialItem in socialItems"
          :key="socialItem.title"
          :href="socialItem.url"
          target="_blank"
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>{{ socialItem.icon }}</v-icon
              >{{ socialItem.title
              }}<v-icon small right color="grey"
                >mdi-open-in-new</v-icon
              ></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <transition name="block">
        <router-view />
      </transition>
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
        { title: 'Home', icon: 'mdi-home' },
        { title: 'Leaderboard', icon: 'mdi-trophy' },
        { title: 'Wiki', icon: 'mdi-book-open-variant' },
        { title: 'Races', icon: 'mdi-flag-checkered' },
        { title: 'Users', icon: 'mdi-account-group' }
      ],
      secondaryItems: [
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
          title: 'GitHub',
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
