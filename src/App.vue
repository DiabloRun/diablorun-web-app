<template>
  <div id="app">
    <nav
      v-if="showHeaderAndFooter"
      class="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <router-link class="navbar-item" :to="{ name: 'Home' }"
          ><img src="@/assets/img/logo.png" width="154" height="23"
        /></router-link>

        <a
          @click="toggleMenu()"
          :class="{ 'is-active': showMenu }"
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': showMenu }">
        <div class="navbar-start">
          <router-link
            @click.native="resetFilters()"
            exact
            active-class="is-active"
            class="navbar-item"
            :to="{ name: 'Leaderboard' }"
            >Leaderboard</router-link
          >
          <router-link
            active-class="is-active"
            class="navbar-item"
            :to="{ name: 'Races' }"
            >Races</router-link
          >
          <router-link
            active-class="is-active"
            class="navbar-item"
            :to="{ name: 'ActiveUsers' }"
            >Users</router-link
          >
        </div>
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
              <a class="navbar-item" @click="signOut()">
                Log out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <router-view />

    <!--footer-->
    <footer v-if="showHeaderAndFooter" class="footer">
      <div class="content has-text-centered">
        <p class="has-tiny-margin">
          Diablo.run built by
          <router-link :to="{ name: 'Team' }">OverseerShenk</router-link> and
          <router-link :to="{ name: 'Team' }">Indrek</router-link>. Join our
          <a href="https://discord.gg/QMMDR2a">Discord</a>. Powered by
          <a href="https://github.com/DiabloRun/DiabloInterface"
            >Diablo Interface</a
          >.
        </p>
        <p>
          Support the development and server costs by
          <a href="https://www.patreon.com/diablorun">becoming a Patreon</a>.
          Contribute code on <a href="https://github.com/diablorun">GitHub.</a>
        </p>
      </div>
    </footer>

    <!-- Modals -->
    <ConfirmModal
      v-if="confirmModal"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :verify="confirmModal.verify"
      :verifyClass="confirmModal.verifyClass"
      :cancelable="confirmModal.cancelable"
      @resolve="confirmModal.resolve()"
      @reject="confirmModal.reject()"
    />
  </div>
</template>
<style lang="scss">
@import '@/assets/styles/global.scss';
</style>

<script>
import { mapState } from 'vuex';
import ConfirmModal from '@/components/ConfirmModal.vue';

export default {
  name: 'App',
  components: {
    ConfirmModal
  },
  data() {
    const redirect_uri = `${process.env.VUE_APP_WEB_URL}/profile`;

    return {
      showMenu: false,
      showUserMenu: false,
      twitchAuthenticationUrl: `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.VUE_APP_TWITCH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=`
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      confirmModal: state => state.app.confirmModal,
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
