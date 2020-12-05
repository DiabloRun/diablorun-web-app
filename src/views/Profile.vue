<template>
  <div class="profile">
    <div v-if="!user">
      <!-- Hero  -->
      <section class="hero is-primary">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-vcentered is-multiline is-mobile">
              <div class="column">
                <h1 class="title is-1">Sign in</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Toolbar -->
      <section class="hero is-dark has-margin-bottom">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-multiline is-mobile">
              <div class="column">
                <h1 class="subtitle is-4">
                  <a href="https://www.twitch.tv/login">Twitch account</a> is
                  required
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Cards -->
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-6">
              <div class="card">
                <header class="card-header">
                  <h1 class="card-header-title">
                    Already have a Twitch account?
                  </h1>
                </header>
                <div class="card-content has-text-centered">
                  <a
                    class="button is-primary"
                    :href="twitchAuthenticationUrl"
                    :class="{ 'is-loading': loading }"
                  >
                    Sign in using Twitch
                  </a>
                  <p v-if="invalid" class="has-margin-top">
                    Invalid Twitch access token!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-if="user">
      <!-- Hero account -->
      <section class="hero is-primary">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-vcentered is-multiline is-mobile">
              <div class="column">
                <h1 class="title is-1">Setup</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Toolbar -->
      <section class="hero is-dark has-margin-bottom">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-multiline is-mobile">
              <div class="column">
                <h1 class="subtitle is-4">
                  Connect
                  <a
                    href="https://github.com/Zutatensuppe/DiabloInterface/releases"
                    >Diablo Interface</a
                  >
                  with
                  <router-link
                    :to="{ name: 'User', params: { user_name: user.name } }"
                    >diablo.run/{{ user.name }}</router-link
                  >
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Cards -->
      <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-6">
              <div class="card">
                <header class="card-header">
                  <h1 class="card-header-title">
                    1. Download Diablo Interface
                  </h1>
                </header>
                <div class="card-content">
                  <a
                    target="_blank"
                    class="button is-primary has-margin-bottom"
                    href="https://github.com/Zutatensuppe/DiabloInterface/releases/"
                    >Download Diablo Interface</a
                  >
                  <p>
                    Diablo Interface reads Diablo II data from memory. That data
                    gets sent to our servers and displayed on your profile so
                    you can share your characters with other people.
                  </p>
                  <p>
                    It's important to keep Diablo Interface up to date. Older
                    versions cause bugs and incorrect data readings.
                  </p>
                  <p>
                    We also have a Twitch Extension by Borshter. Go to Twitch
                    Extensions page and search for Diablo.run Armory.
                  </p>
                </div>
              </div>
            </div>
            <div class="column is-6">
              <div class="card">
                <header class="card-header">
                  <h1 class="card-header-title">2. Config Diablo Interface</h1>
                </header>
                <div class="card-content">
                  <h1 class="heading has-text-white">URL</h1>
                  <input
                    readonly
                    class="input"
                    type="text"
                    placeholder="URL"
                    v-model="updateUrl"
                  />
                  <h1 class="heading has-text-white has-margin-top">Headers</h1>
                  <input
                    readonly
                    class="input"
                    type="text"
                    placeholder="Headers"
                    :value="'API_KEY=' + user.api_key"
                  />
                  <ol type="1">
                    <li>Open Diablo Interface</li>
                    <li>Right click and click Config (Ctrl+U)</li>
                    <li>Select HttpClient tab from the top menu</li>
                    <li>Copy &amp; paste your URL and Headers</li>
                    <li>Click on Enable</li>
                    <li>Save</li>
                  </ol>
                  <p>
                    After saving you can enter a character in Diablo II and see
                    if it is synced in your
                    <router-link
                      :to="{ name: 'User', params: { user_name: user.name } }"
                      >diablo.run/{{ user.name }}</router-link
                    >
                    page. Try restarting the game and Diablo Interface if it
                    didn't work.
                  </p>
                  <p>
                    Feel free to ask help from our
                    <a href="https://discord.gg/QMMDR2a">Discord</a> if you're
                    having any problems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Profile',
  data() {
    const redirect_uri = `${process.env.VUE_APP_WEB_URL}/profile`;

    return {
      loading: false,
      invalid: false,
      updateUrl:
        'https://g48bwtx3c2.execute-api.eu-central-1.amazonaws.com/default/d2id-update',
      twitchAuthenticationUrl: `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.VUE_APP_TWITCH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=`
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    })
  },
  async mounted() {
    const match = window.location.hash.match(/access_token=(\w+)/);
    window.location.hash = '';

    if (match) {
      this.invalid = false;
      this.loading = true;

      try {
        await this.$store.dispatch('auth/signIn', match[1]);
      } catch (err) {
        this.invalid = true;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
