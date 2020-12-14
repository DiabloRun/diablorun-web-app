<template>
  <div class="profile">
    <!-- Hero  -->
    <section class="hero has-bg-1 is-medium">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column is-full-mobile">
              <h1 class="title is-1 has-hero-link">
                Diablo.run is an
                <a href="https://github.com/diablorun" target="_blank"
                  >open source</a
                >
                project for Diablo enthusiasts
              </h1>
            </div>
            <div class="column is-narrow py-0">
              <router-link :to="{ name: 'Setup' }">
                <button
                  class="button is-outlined is-primary is-inverted has-glow-dark"
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
        <h1 class="title is-2">Speedruns</h1>
        <div class="columns is-multiline is-vcentered">
          <div class="column is-full is-6-fullhd">
            <h1 class="blog subtitle">Recently submitted runs</h1>
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
                      class="subtitle is-6 white-space-nowrap font-size-1-rem-mobile"
                    >
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </p>
                  </td>
                  <td class="px-0 has-text-centered">
                    <p
                      class="subtitle is-6 font-size-1-rem-mobile white-space-nowrap has-hero"
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
          <div class="column is-full is-6-fullhd">
            <h1 class="blog subtitle">Fresh world records</h1>
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
                        `subtitle is-5 has-text-fade rank-${run.category_rank}`
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
                      class="subtitle is-6 white-space-nowrap font-size-1-rem-mobile"
                    >
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </p>
                  </td>
                  <td class="px-0 has-text-centered">
                    <p
                      class="subtitle is-6 font-size-1-rem-mobile white-space-nowrap has-hero"
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
          <div class="column">
            <router-link :to="{ name: 'Leaderboard' }">
              <button class="button is-light">View the full leaderboard</button>
            </router-link>
          </div>
          <div class="column is-narrow">
            <p class="has-text-grey is-size-7">
              Runs are pulled from
              <a href="https://www.speedrun.com/d2lod" target="_blank"
                >speedrun.com</a
              >
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Latest Blog Post -->
    <section class="section">
      <div class="container">
        <h1 class="title is-2">Latest blog post</h1>
        <div class="columns">
          <div class="column is-6">
            <BlogPostBox :post="latestPost"></BlogPostBox>
            <router-link :to="{ name: 'Blog' }">
              <button class="button is-light">More blog posts</button>
            </router-link>
          </div>
          <div class="column"></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container is-fluid">
        <div class="columns is-mobile is-vcentered is-centered">
          <div
            class="column is-3-mobile is-2-tablet is-1-fullhd"
            data-tooltip="Diablo.run repositories on GitHub"
          >
            <a href="https://github.com/diablorun" target="_blank">
              <img src="@/assets/img/GitHub_Logo_White.png" />
            </a>
          </div>
          <div
            class="column is-3-mobile is-2-tablet is-1-fullhd"
            data-tooltip="Become a Diablo.run Patreon"
          >
            <a href="https://www.patreon.com/diablorun" target="_blank">
              <img src="@/assets/img/patreon.png" />
            </a>
          </div>
          <div
            class="column is-3-mobile is-2-tablet is-1-fullhd"
            data-tooltip="Join Diablo.run Discord channel"
          >
            <a href="https://discord.gg/QMMDR2a" target="_blank">
              <img src="@/assets/img/Discord-Logo.png" />
            </a>
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
import BlogPostBox from '@/components/BlogPostBox.vue';
import blog from '@/router/blog.js';

export default {
  filters: {
    HeroNameFilter,
    FromNowFilter,
    DurationFilter
  },
  components: {
    CountryIcon,
    BlogPostBox
  },
  name: 'Home',
  data() {
    return {
      latestSpeedruns: [],
      latestRecords: [],
      latestPost: blog[0]
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
