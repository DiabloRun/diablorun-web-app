<template>
  <div class="profile">
    <v-container fill-height fluid class="pa-6">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="8" lg="6">
          <v-card>
            <v-card-title>
              <v-icon left>mdi-patreon</v-icon>
              Diablo.run Patreon
            </v-card-title>
            <v-divider></v-divider>
            <v-row justify="center" class="text-center pa-9">
              <v-col>
                <v-card-title class="justify-center">
                  Thank you, {{ user.name }}!
                </v-card-title>
                <v-card-subtitle class="pb-0">
                  You've pledged
                  <v-chip color="primary" class="ma-1">
                    {{ user.patreon_amount_cents / 100 }}€
                  </v-chip>
                  to Diablo.run
                </v-card-subtitle>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                color="primary"
                text
                href="https://www.patreon.com/diablorun"
                target="_blank"
              >
                Diablo.run Patreon page
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Hero  -->
    <section class="hero is-dark is-medium is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column">
              <h1 class="title">
                Visit
                <a href="https://www.patreon.com/diablorun">
                  Diablo.run Patreon
                </a>
                page
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Content -->
    <section class="section" v-if="user">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6">
            <div class="box">
              <p v-if="user.patreon_id">
                Your diablo.run user is linked to Patreon user
                <a target="_blank" :href="patreonUserLink">{{
                  user.patreon_id
                }}</a
                >.
              </p>
              <p v-if="user.patreon_amount_cents">
                You have pledged {{ user.patreon_amount_cents / 100 }}€ to
                diablo.run.
              </p>
              <p v-if="!user.patreon_amount_cents">
                You have not made a pledge to diablo.run.
              </p>
              <a
                v-if="!user.patreon_id"
                class="button is-primary"
                :href="patreonAuthenticationUrl"
                :class="{ 'is-loading': loading }"
              >
                Link your Patreon account
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Sign in required -->
    <section class="section" v-if="!user">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6">
            <div class="box has-text-centered">
              <h1 class="subtitle">
                Please sign in to link your Patreon account.
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Profile',
  data() {
    const redirect_uri = `${process.env.VUE_APP_WEB_URL}/profile/patreon`;

    return {
      loading: false,
      invalid: false,
      redirect_uri,
      patreonAuthenticationUrl: `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.VUE_APP_PATREON_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=identity`
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      patreonUserLink: state => {
        if (state.auth.user && state.auth.user.patreon_id) {
          return `https://www.patreon.com/api/user/${state.auth.user.patreon_id}`;
        }
      }
    })
  },
  async mounted() {
    const match = window.location.search.match(/code=(\w+)/);

    if (match) {
      this.invalid = false;
      this.loading = true;

      try {
        const res = await fetch(
          `${process.env.VUE_APP_API_URL}/users/${this.user.id}/patreon`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.user.api_key}`
            },
            body: JSON.stringify({
              code: match[1],
              redirect_uri: this.redirect_uri
            })
          }
        );

        if (res.status !== 200) {
          throw new Error(await res.text());
        }

        await this.$store.dispatch('app/confirm', {
          title: 'Patreon linked',
          message: 'Your Patreon user was linked to your diablo.run user.',
          verify: 'OK',
          verifyClass: '',
          cancelable: false
        });
      } catch ({ message }) {
        await this.$store.dispatch('app/confirm', {
          title: 'Failed to link Patreon',
          message,
          verify: 'OK',
          verifyClass: '',
          cancelable: false
        });

        this.invalid = true;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
