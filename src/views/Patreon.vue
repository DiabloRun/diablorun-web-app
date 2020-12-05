<template>
  <div class="profile">
    <!-- Hero  -->
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column">
              <h1 class="title is-1">Patreon</h1>
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
                <a href="https://www.patreon.com/diablorun"
                  >diablo.run Patreon</a
                >
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Cards -->
    <section class="section" v-if="user">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6">
            <div class="card">
              <header class="card-header">
                <h1 class="card-header-title">Status</h1>
              </header>
              <div class="card-content has-text-centered">
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
      </div>
    </section>
    <!-- Cards -->
    <section class="section" v-if="!user">
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
                <p>Please sign in to link your Patreon account.</p>
              </div>
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
