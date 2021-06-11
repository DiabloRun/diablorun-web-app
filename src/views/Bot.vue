<template>
  <v-container>
    <v-row>
      <!-- Bot commands -->
      <v-col cols="12">
        <h1>Twitch bot commands</h1>
        <h2 class="subtitle">
          Adding
          <a target="_blank" href="https://www.twitch.tv/diablorun">
            DiabloRun</a
          >
          Twitch bot account as moderator is recommended
        </h2>
      </v-col>
      <v-col cols="12">
        <v-simple-table dense class="text-no-wrap">
          <thead>
            <tr>
              <th>Commands</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                !gear
              </td>
              <td>
                Links to active character diablo.run gear page
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="12">
        <h1>Socketing</h1>
        <h2 class="subtitle">
          Recipes to socket bases with the cube. Can't socket superior bases.
          It's fine if the item is ethereal.
        </h2>
      </v-col>
      <v-col cols="12">
        <v-simple-table dense class="text-no-wrap">
          <thead>
            <tr>
              <th>Commands</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                !socket weapon
              </td>
              <td>
                Ral + Amn + Perfect Amethyst
              </td>
            </tr>
            <tr>
              <td>
                !socket armor
              </td>
              <td>
                Tal + Thul + Perfect Topaz
              </td>
            </tr>
            <tr>
              <td>
                !socket helm
              </td>
              <td>
                Tal + Thul + Perfect Topaz
              </td>
            </tr>
            <tr>
              <td>
                !socket shield
              </td>
              <td>
                Tal + Amn + Perfect Ruby
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="12">
        <h1>Cube recipes</h1>
        <h2 class="subtitle">
          Possible crafting bases are weapon, shield, helm, armor, gloves, belt,
          boots, ring and amulet. For example
          <strong>!caster amulet</strong> outputs "Caster Amulet: Magic Amulet +
          Amn + Amethyst + Jewel".
        </h2>
      </v-col>
      <v-col cols="12">
        <v-simple-table dense class="text-no-wrap">
          <thead>
            <tr>
              <th>Commands</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                !blood "base"
              </td>
              <td>Blood recipes</td>
            </tr>
            <tr>
              <td>
                !caster "base"
              </td>
              <td>
                Caster recipes
              </td>
            </tr>
            <tr>
              <td>
                !hit "base"
              </td>
              <td>
                Hit power recipes
              </td>
            </tr>
            <tr>
              <td>
                !safety "base"
              </td>
              <td>
                Safety recipes
              </td>
            </tr>
            <tr>
              <td>
                !"rune"
              </td>
              <td>
                Recipe to build the rune. For example
                <strong>!ral</strong> outputs "Ral: 3 Tal".
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
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
      twitchAuthenticationUrl: `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.VUE_APP_TWITCH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=`,
      patreonAuthenticationUrl: `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.VUE_APP_PATREON_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=identity`
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      patreonUserLink: (state) => {
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
