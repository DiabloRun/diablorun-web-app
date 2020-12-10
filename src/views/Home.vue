<template>
  <div class="profile">
    <!-- Hero  -->
    <section class="hero has-bg-1 is-medium">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column is-full-mobile">
              <h1 class="title is-2 pb-3">Welcome!</h1>
              <h1 class="subtitle is-5">
                Diablo.run is an
                <a href="https://github.com/diablorun">open source</a> project
                for Diablo enthusiasts. Join our
                <a href="https://discord.gg/QMMDR2a">Discord</a> and support us
                by
                <a href="https://www.patreon.com/diablorun"
                  >becoming a Patreon</a
                >!
              </h1>
            </div>
            <div class="column is-narrow-tablet">
              <router-link :to="{ name: 'Setup' }">
                <button
                  class="button is-medium is-outlined is-primary is-inverted has-glow"
                >
                  Diablo.run Setup
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Content -->
    <section class="section mt-5">
      <div class="container">
        <h1 class="title is-4">Speedruns</h1>
        <div class="columns is-multiline">
          <div class="column is-full is-6-desktop">
            <h1 class="subtitle is-4">Latest Runs</h1>
            <table class="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th class="has-text-centered has-text-fade px-2">#</th>
                  <th class="px-0">Runner</th>
                  <th class="px-0 has-text-centered">Time</th>
                  <th class="px-0 has-text-centered">Category</th>
                  <th class="pl-0 pr-2 has-text-right is-hidden-mobile">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="run of latestSpeedruns" :key="run.id">
                  <td class="is-narrow has-text-centered px-2">
                    <p
                      :class="
                        `subtitle is-6 has-text-fade rank-${run.category_rank}`
                      "
                    >
                      {{ run.category_rank }}
                    </p>
                  </td>
                  <td class="px-0 white-space-normal-mobile width-auto-mobile">
                    <CountryIcon
                      imgClass="flag"
                      :code="run.speedrun_user_country_code"
                    />
                    <p class="subtitle is-5 font-size-1-rem-mobile">
                      <a
                        v-if="!run.user_id"
                        :style="`color: ${run.speedrun_user_dark_color_from};`"
                        :href="run.speedrun_user_weblink"
                        target="_blank"
                      >
                        {{ run.speedrun_user_name }}
                      </a>
                      <router-link
                        v-if="run.user_id"
                        :to="{
                          name: 'User',
                          params: { user_name: run.user_name }
                        }"
                        :style="
                          `color: ${run.user_color ||
                            run.speedrun_user_dark_color_from};`
                        "
                      >
                        {{ run.user_name }}
                      </router-link>
                      <span v-if="run.character_id">
                        <span class="has-text-fade">as</span>
                        <router-link
                          :to="{
                            name: 'Character',
                            params: {
                              user_name: run.user_name,
                              character_slug:
                                run.character_name + run.character_id
                            }
                          }"
                        >
                          {{ run.character_name }}
                        </router-link>
                      </span>
                    </p>
                  </td>
                  <td class="px-0 has-text-centered">
                    <p
                      class="subtitle is-5 white-space-nowrap font-size-1-rem-mobile"
                    >
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </p>
                  </td>
                  <td class="px-0 has-text-centered">
                    <p
                      class="subtitle is-5 font-size-1-rem-mobile white-space-nowrap has-hero"
                    >
                      <router-link
                        :to="{
                          name: 'Leaderboard',
                          hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                            run.hero
                          }/${run.players_category}`
                        }"
                      >
                        {{ run.category_name }}
                        {{ run.hero }}
                        <span v-if="!run.hc"> SC</span>
                        <span v-if="run.hc">HC</span>
                        {{ run.players_category }}
                      </router-link>
                    </p>
                  </td>
                  <td
                    class="pl-0 pr-2 is-narrow is-hidden-mobile has-text-right"
                  >
                    <p class="subtitle is-6">
                      {{ run.submit_time | FromNowFilter }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="column is-6-desktop">
            <h1 class="subtitle is-4">Fresh World Records</h1>
            <table class="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th class="has-text-centered has-text-fade px-2">#</th>
                  <th class="px-0">Runner</th>
                  <th class="px-0 has-text-centered">Time</th>
                  <th class="px-0 has-text-centered">Category</th>
                  <th class="pl-0 pr-2 has-text-right is-hidden-mobile">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="run of latestRecords" :key="run.id">
                  <td class="is-narrow has-text-centered px-2">
                    <p
                      :class="
                        `subtitle is-6 has-text-fade rank-${run.category_rank}`
                      "
                    >
                      {{ run.category_rank }}
                    </p>
                  </td>
                  <td class="px-0 white-space-normal-mobile width-auto-mobile">
                    <CountryIcon
                      imgClass="flag"
                      :code="run.speedrun_user_country_code"
                    />
                    <p class="subtitle is-5 font-size-1-rem-mobile">
                      <a
                        v-if="!run.user_id"
                        :style="`color: ${run.speedrun_user_dark_color_from};`"
                        :href="run.speedrun_user_weblink"
                        target="_blank"
                      >
                        {{ run.speedrun_user_name }}
                      </a>
                      <router-link
                        v-if="run.user_id"
                        :to="{
                          name: 'User',
                          params: { user_name: run.user_name }
                        }"
                        :style="
                          `color: ${run.user_color ||
                            run.speedrun_user_dark_color_from};`
                        "
                      >
                        {{ run.user_name }}
                      </router-link>
                      <span v-if="run.character_id">
                        <span class="has-text-fade">as</span>
                        <router-link
                          :to="{
                            name: 'Character',
                            params: {
                              user_name: run.user_name,
                              character_slug:
                                run.character_name + run.character_id
                            }
                          }"
                        >
                          {{ run.character_name }}
                        </router-link>
                      </span>
                    </p>
                  </td>
                  <td class="px-0 has-text-centered">
                    <p
                      class="subtitle is-5 white-space-nowrap font-size-1-rem-mobile"
                    >
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </p>
                  </td>
                  <td class="px-0 has-text-centered">
                    <p
                      class="subtitle is-5 font-size-1-rem-mobile white-space-nowrap has-hero"
                    >
                      <router-link
                        :to="{
                          name: 'Leaderboard',
                          hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                            run.hero
                          }/${run.players_category}`
                        }"
                      >
                        {{ run.category_name }}
                        {{ run.hero }}
                        <span v-if="!run.hc"> SC</span>
                        <span v-if="run.hc">HC</span>
                        {{ run.players_category }}
                      </router-link>
                    </p>
                  </td>
                  <td
                    class="pl-0 pr-2 is-narrow is-hidden-mobile has-text-right"
                  >
                    <p class="subtitle is-6">
                      {{ run.submit_time | FromNowFilter }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
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
  },
  name: 'Home',
  data() {
    return {
      latestSpeedruns: [],
      latestRecords: []
    };
  },
  async mounted() {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/home`);
    const data = await res.json();
    console.log(data);
    this.latestSpeedruns = data.latestSpeedruns;
    this.latestRecords = data.latestRecords;
  }
};
</script>
