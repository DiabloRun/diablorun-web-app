<template>
  <v-app>
    <v-app-bar app dense clipped-left>
      <v-row no-gutters>
        <!-- Toggle navigation -->
        <v-col cols="auto" class="my-auto">
          <v-btn @click="drawer = !drawer" icon width="42" height="42">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-col>
        <!-- Logo -->
        <v-col class="my-auto ml-3">
          <h1 class="logo">diablo<v-icon>mdi-sword</v-icon>run</h1>
        </v-col>
        <!-- Menu -->
        <v-col cols="auto">
          <v-tabs hide-slider background-color="secondary">
            <v-tab v-if="!user" :href="twitchAuthenticationUrl">
              Login
              <v-icon>mdi-login</v-icon>
            </v-tab>
            <v-tab
              v-if="user"
              :to="{ name: 'User', params: { user_name: user.name } }"
              class="hidden-xs-only"
            >
              {{ user.name }}
            </v-tab>
            <v-tab v-if="user" @click="signOut()">
              Exit
              <v-icon>mdi-logout</v-icon>
            </v-tab>
          </v-tabs>
        </v-col>
        <!-- User avatar -->
        <v-col cols="auto ml-3" v-if="user && user.profile_image_url !== ''">
          <router-link :to="{ name: 'User', params: { user_name: user.name } }">
            <v-avatar tile>
              <img
                :src="user.profile_image_url"
                :to="{ name: 'User', params: { user_name: user.name } }"
              />
            </v-avatar>
          </router-link>
        </v-col>
      </v-row>
    </v-app-bar>
    <!-- Left navigation -->
    <v-navigation-drawer width="240" v-model="drawer" app clipped>
      <!-- Main links -->
      <v-list dense class="pt-0">
        <v-list-item
          v-for="mainItem in mainItems"
          :key="mainItem.title"
          :to="{ name: mainItem.title }"
          :exact="mainItem.exact"
          @click="resetFilters()"
          link
        >
          <v-icon left>{{ mainItem.icon }}</v-icon>
          <v-list-item-content>
            <v-list-item-title>{{ mainItem.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- Logged out links -->
      <v-list v-if="!user" dense>
        <v-list-item link exact :href="twitchAuthenticationUrl">
          <v-icon left>mdi-login</v-icon>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- Logged in links -->
      <v-list v-if="user" dense>
        <v-list-item
          link
          exact
          :to="{ name: 'User', params: { user_name: user.name } }"
        >
          <v-icon left>mdi-account</v-icon>
          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          exact
          :to="{
            name: 'Character',
            params: { user_name: user.name, character_slug: '@' }
          }"
        >
          <v-icon left>mdi-sword</v-icon>
          <v-list-item-content>
            <v-list-item-title>Latest Hero</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- 
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
        -->
        <v-list-item link exact :to="{ name: 'Interface Setup' }">
          <v-icon left>mdi-cogs</v-icon>
          <v-list-item-content>
            <v-list-item-title>Setup</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- Social links -->
      <template v-slot:append>
        <!-- Other links -->
        <v-list dense>
          <v-list-item
            link
            v-for="otherItem in otherItems"
            :key="otherItem.title"
            :to="{ name: otherItem.title }"
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>{{ otherItem.icon }}</v-icon>
                {{ otherItem.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list dense>
          <v-list-item
            link
            v-for="socialItem in socialItems"
            :key="socialItem.title"
            :href="socialItem.url"
            target="_blank"
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>{{ socialItem.icon }}</v-icon>
                {{ socialItem.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
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
