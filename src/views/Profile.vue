<template>
  <v-container fill-height fluid>
    <v-row v-if="!user" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5" xl="3">
        <h1>Login</h1>
        <v-card :loading="loading">
          <div class="pa-10 text-center">
            <v-btn :href="twitchAuthenticationUrl">
              <v-icon left>mdi-twitch</v-icon>Login with Twitch
            </v-btn>
          </div>
          <v-divider></v-divider>
          <v-card-subtitle class="text-center">
            Twitch account is required.
            <a href="https://www.twitch.tv/signup" target="_blank">
              Create one here<v-icon small color="grey"
                >mdi-open-in-new</v-icon
              > </a
            >.
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="user" align="center" justify="center">
      <v-col cols="12" lg="8" xl="5">
        <h1>
          <v-icon left>mdi-cogs</v-icon> Connect Interface with Diablo.run
        </h1>
        <v-card>
          <v-card-text>
            <v-text-field
              outlined
              v-model="updateUrl"
              label="URL"
              readonly
              class="mb-0 pb-0"
            ></v-text-field>
            <v-text-field
              outlined
              :value="'API_KEY=' + user.api_key"
              label="Headers"
              readonly
            ></v-text-field>
            <ol>
              <li>Download and open Diablo Interface</li>
              <li>
                Right click and go to
                <v-icon class="px-1" small>mdi-wrench</v-icon
                ><strong>Config</strong>
              </li>
              <li>Select <strong>HttpClient</strong> tab from the top menu</li>
              <li>
                Copy and paste your <strong>URL</strong> and
                <strong>Headers</strong>
              </li>
              <li>Click Enable</li>
              <li>Save</li>
            </ol>
            <p class="mt-5">
              After saving you can enter a character in Diablo II and see if it
              is synced in your profile page. Restart the game and Interface if
              it didn't work. Feel free to ask help from our
              <a target="_blank" href="https://discord.gg/QMMDR2a">Discord</a>
              channel!
            </p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              href="https://github.com/DiabloRun/DiabloInterface/releases/tag/v0.6.9"
              target="_blank"
            >
              <v-icon left>mdi-download</v-icon>Diablo Interface 0.6.9
            </v-btn>
            <v-btn
              text
              :to="{ name: 'User', params: { user_name: user.name } }"
            >
              <v-icon left>mdi-sword</v-icon>diablo.run/{{ user.name }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
      updateUrl: 'https://api.diablo.run/sync',
      twitchAuthenticationUrl: `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.VUE_APP_TWITCH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=`
    };
  },
  methods: {
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
    }
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
