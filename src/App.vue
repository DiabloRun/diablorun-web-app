<template>
  <v-app>
    <!-- Top app bar -->
    <v-app-bar app dense color="app">
      <v-row no-gutters>
        <v-col>
          <v-tabs active-class="grey--text" hide-slider background-color="app">
            <v-tab @click="drawer = !drawer">
              <v-icon>mdi-menu</v-icon>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="auto">
          <v-tabs active-class="grey--text" hide-slider background-color="app">
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
        <v-col cols="auto" v-if="user && user.profile_image_url !== ''">
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
    <v-navigation-drawer color="app" width="200" v-model="drawer" app>
      <v-row no-gutters class="text-center mt-1">
        <!-- Logo -->
        <v-col>
          <h1 class="logo">
            diablo<v-icon dense color="primary">mdi-sword</v-icon>run
          </h1>
        </v-col>
      </v-row>
      <!-- Main links -->
      <v-list dense>
        <v-list-item
          v-for="mainItem in mainItems"
          :key="mainItem.title"
          :to="{ name: mainItem.title }"
          :exact="mainItem.exact"
          @click="resetFilters()"
          link
          color="primary"
        >
          <v-icon left>{{ mainItem.icon }}</v-icon>
          <v-list-item-content>
            <v-list-item-title>{{ mainItem.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="!user" dense>
        <v-list-item link exact :href="twitchAuthenticationUrl">
          <v-icon left>mdi-login</v-icon>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="user" dense>
        <v-list-item
          link
          exact
          :to="{ name: 'User', params: { user_name: user.name } }"
          color="primary"
        >
          <v-avatar v-if="user.profile_image_url !== ''" class="mr-2" size="24">
            <img :src="user.profile_image_url" :alt="user.name" />
          </v-avatar>
          <v-icon v-if="user.profile_image_url == ''" left>mdi-account</v-icon>
          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          exact
          color="primary"
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
        <v-list-item
          link
          exact
          color="primary"
          :to="{ name: 'Race Editor', params: { editor_token: 'new' } }"
        >
          <v-icon left>mdi-flag-plus</v-icon>
          <v-list-item-content>
            <v-list-item-title>Race Editor</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          exact
          :to="{ name: 'Interface Setup' }"
          color="primary"
        >
          <v-icon left>mdi-cogs</v-icon>
          <v-list-item-content>
            <v-list-item-title>Interface Setup</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item
          link
          v-for="otherItem in otherItems"
          :key="otherItem.title"
          :to="{ name: otherItem.title }"
          color="primary"
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>{{ otherItem.icon }}</v-icon>
              {{ otherItem.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-divider></v-divider>
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
      <!--
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
            Logout
          </v-btn>
        </div>
      </template>
      -->
    </v-navigation-drawer>
    <v-main>
      <router-view class="fade-in" />
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
        { title: 'Wiki', icon: 'mdi-book-open-variant', exact: true },
        { title: 'Races', icon: 'mdi-flag-checkered', exact: false },
        { title: 'Users', icon: 'mdi-account-group', exact: true }
      ],
      otherItems: [
        { title: 'Patreon', icon: 'mdi-patreon' },
        { title: 'Team', icon: 'mdi-human-greeting' }
      ],
      socialItems: [
        {
          title: 'Join our community',
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
