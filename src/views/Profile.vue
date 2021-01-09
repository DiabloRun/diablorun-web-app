<template>
  <v-container fill-height fluid>
    <v-row v-if="!user" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card :loading="loading">
          <v-card-title> Login </v-card-title>
          <v-divider></v-divider>
          <div class="pa-10 text-center">
            <v-btn
              @click="login"
              :href="twitchAuthenticationUrl"
              color="primary"
            >
              <v-icon left>mdi-twitch</v-icon>Login with Twitch
            </v-btn>
          </div>
          <v-divider></v-divider>
          <v-card-subtitle>
            Twitch account is required. Don't have a Twitch account?
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
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-cogs</v-icon>
            Connect Interface with Diablo.run
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="white--text">
            <v-text-field
              v-model="updateUrl"
              label="URL"
              readonly
            ></v-text-field>
            <v-text-field
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
              it didn't work.
            </p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              href="https://github.com/DiabloRun/DiabloInterface/releases/tag/v0.6.8"
              target="_blank"
            >
              <v-icon left>mdi-download</v-icon>Diablo Interface 0.6.8
            </v-btn>
            <v-btn
              color="primary"
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
      updateUrl:
        'https://g48bwtx3c2.execute-api.eu-central-1.amazonaws.com/default/d2id-update',
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
