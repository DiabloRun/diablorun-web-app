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
        <div class="columns">
          <div class="column">
            <h1 class="title is-4">Speedruns</h1>
          </div>
          <div class="column is-narrow">
            <p class="subtitle is-5">
              <router-link :to="{ name: 'Leaderboard' }">
                Speedrunning leaderboard
              </router-link>
            </p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-6">
            <h1 class="subtitle is-4">Latest Runs</h1>
            <table class="table is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th class="px-2 has-text-fade has-text-centered">#</th>
                  <th class="px-0">Runner</th>
                  <th class="px-0">Time</th>
                  <th class="px-0">Category</th>
                  <th class="px-2 has-text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="run of latestSpeedruns" :key="run.id" class="">
                  <td class="px-2 is-narrow">
                    <p
                      :class="`subtitle is-6 has-text-fade rank-${run.category_rank}`"
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
                        :style="`color: ${
                          run.user_color || run.speedrun_user_dark_color_from
                        };`"
                      >
                        {{ run.user_name }}
                      </router-link>
                    </p>
                  </td>
                  <td class="px-0">
                    <p class="subtitle is-5">
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </p>
                  </td>
                  <td class="px-0 is-narrow">
                    <router-link
                      :to="{
                        name: 'Leaderboard',
                        hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                          run.hero
                        }/${run.players_category}`
                      }"
                    >
                      {{ run.category_name }}
                      <span class="has-hero">{{ run.hero }}</span>
                      {{ run.hc ? 'HC' : 'SC' }}
                      <span class="is-hidden-touch">
                        {{ run.players_category | PlayersCategoryNameFilter }}
                      </span>
                      <span class="is-hidden-desktop">
                        {{ run.players_category }}
                      </span>
                    </router-link>
                  </td>
                  <td class="px-2 is-narrow has-text-right">
                    {{ run.submit_time | FromNowFilter }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
<div class="column is-6">
            <h1 class="subtitle is-4">Fresh World Records</h1>
            <table class="table is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th class="px-2 has-text-fade has-text-centered">#</th>
                  <th class="px-0">Runner</th>
                  <th class="px-0">Time</th>
                  <th class="px-0">Category</th>
                  <th class="px-2 has-text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="run of latestRecords" :key="run.id" class="">
                  <td class="px-2 is-narrow">
                    <p
                      :class="`subtitle is-6 has-text-fade rank-${run.category_rank}`"
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
                        :style="`color: ${
                          run.user_color || run.speedrun_user_dark_color_from
                        };`"
                      >
                        {{ run.user_name }}
                      </router-link>
                    </p>
                  </td>
                  <td class="px-0">
                    <p class="subtitle is-5">
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </p>
                  </td>
                  <td class="px-0 is-narrow">
                    <router-link
                      :to="{
                        name: 'Leaderboard',
                        hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                          run.hero
                        }/${run.players_category}`
                      }"
                    >
                      {{ run.category_name }}
                      <span class="has-hero">{{ run.hero }}</span>
                      {{ run.hc ? 'HC' : 'SC' }}
                      <span class="is-hidden-touch">
                        {{ run.players_category | PlayersCategoryNameFilter }}
                      </span>
                      <span class="is-hidden-desktop">
                        {{ run.players_category }}
                      </span>
                    </router-link>
                  </td>
                  <td class="px-2 is-narrow has-text-right">
                    {{ run.submit_time | FromNowFilter }}
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
