<template>
  <v-container>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="text-center">
        <h1>Bounties</h1>
        <h1 class="subtitle">
          Create and complete bounties
        </h1>
        <v-btn :to="{ name: 'Interface Setup' }">
          <v-icon small left>mdi-target-account</v-icon>
          Create a bounty
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense class="mt-5">
      <v-col>
        <v-simple-table dense class="text-no-wrap">
          <thead>
            <tr>
              <th>Bounty</th>
              <th>Description</th>
              <th>Reward</th>
              <th>Claimed by</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bounty of bounties" :key="bounty.id">
              <td>
                {{ bounty.name }}
              </td>
              <td>
                {{ bounty.description }}
              </td>
              <td>
                <span class="gold--text">{{ bounty.reward }}</span> by
                <router-link
                  :to="{
                    name: 'User',
                    params: { user_name: bounty.author_user.name }
                  }"
                  :style="`color: ${bounty.author_user.name.color};`"
                >
                  {{ bounty.author_user.name }}
                </router-link>
              </td>
              <td>
                <CountryIcon
                  :code="bounty.claimed_character.user_country_code"
                />
                <router-link
                  :to="{
                    name: 'User',
                    params: { user_name: bounty.claimed_character.user_name }
                  }"
                  :style="`color: ${bounty.claimed_character.user_color};`"
                >
                  {{ bounty.claimed_character.user_name }}
                </router-link>
                with
                <router-link
                  :to="{
                    name: 'Character',
                    params: {
                      user_name: bounty.claimed_character.user_name,
                      character_slug:
                        bounty.claimed_character.name +
                        bounty.claimed_character.id
                    }
                  }"
                >
                  {{ bounty.claimed_character.hero | HeroNameFilter }}
                  {{ bounty.claimed_character.name }}
                </router-link>
              </td>
              <td>
                <template v-if="!bounty.claimed_character"
                  >Expires {{ bounty.expiration | FromNowFilter }}</template
                >
                <template v-if="bounty.claimed_character"
                  ><v-icon color="success" size="small"
                    >mdi-check-bold</v-icon
                  ></template
                >
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { HeroNameFilter } from '@/filters';
import { FromNowFilter } from '@/filters';
import { DurationFilter } from '@/filters';
import CountryIcon from '@/components/CountryIcon.vue';

export default {
  filters: {
    HeroNameFilter,
    FromNowFilter,
    DurationFilter
  },
  components: {
    CountryIcon
    // Bounties
  },
  name: 'Home',
  data() {
    return {
      bounties: []
    };
  },
  async mounted() {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/bounties`);
    const data = await res.json();
    console.log(data);
    this.bounties = data;
  }
};
</script>
