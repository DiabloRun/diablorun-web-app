<template>
  <v-app id="inspire">
    <v-app-bar flat dense clipped-left app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-icon class="mdi-flip-h" color="orange accent-4">mdi-sword</v-icon>
      <h3 class="pl-1">diablo<span class="grey--text">.</span>run</h3>
      <v-spacer></v-spacer>
      hey

      <div class="navbar-end">
        <a class="navbar-item" v-if="!user" :href="twitchAuthenticationUrl">
          Sign in with Twitch
        </a>
        <div
          v-if="user"
          class="navbar-item has-dropdown"
          :class="{ 'is-active': showUserMenu }"
        >
          <a class="navbar-link" @click="toggleUserMenu()">
            {{ user.name }}
          </a>

          <div class="navbar-dropdown is-right">
            <router-link
              active-class="is-active"
              class="navbar-item"
              :to="{ name: 'User', params: { user_name: user.name } }"
              @click.native="showUserMenu = false"
            >
              Profile
            </router-link>
            <router-link
              active-class="is-active"
              class="navbar-item"
              :to="{ name: 'Setup' }"
              @click.native="showUserMenu = false"
            >
              Setup
            </router-link>
            <router-link
              active-class="is-active"
              class="navbar-item"
              :to="{ name: 'RaceEditor', params: { editor_token: 'new' } }"
              @click.native="showUserMenu = false"
            >
              Race editor
            </router-link>
            <router-link
              active-class="is-active"
              class="navbar-item"
              :to="{ name: 'Patreon' }"
              @click.native="showUserMenu = false"
            >
              Patreon
            </router-link>
            <a class="navbar-item" @click="signOut()"> Log out </a>
          </div>
        </div>
      </div>
    </v-app-bar>
    <v-navigation-drawer width="200" clipped v-model="drawer" app>
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
        <v-list-item link exact :to="user.name + '/@'">
          <v-icon left>mdi-sword</v-icon>
          <v-list-item-content>
            <v-list-item-title>Latest Hero</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link exact :to="user.name">
          <v-icon left>mdi-format-list-text</v-icon>
          <v-list-item-content>
            <v-list-item-title>Character History</v-list-item-title>
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
      <router-view />
    </v-main>
  </v-app>
</template>

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
        { title: 'Races', icon: 'mdi-run-fast' },
        { title: 'Users', icon: 'mdi-account-group' }
      ],
      secondaryItems: [
        { title: 'Interface Setup', icon: 'mdi-cogs' },
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
