<template>
  <div>
    <!-- Hero  -->
    <section class="hero is-medium is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <a href="https://github.com/diablorun" target="_blank"
              >Open source</a
            >
            project for Diablo enthusiasts
          </h1>
        </div>
      </div>
    </section>
    <!-- Speedruns -->
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <!-- Recently submitted runs -->
          <div class="column is-full is-6-fullhd">
            <h1 class="subtitle">Recently submitted speedruns</h1>
            <table class="table is-striped is-hoverable is-narrow is-fullwidth">
              <thead>
                <tr>
                  <th class="has-text-centered is-narrow">#</th>
                  <th>Runner</th>
                  <th>Time</th>
                  <th>Category</th>
                  <th class="is-hidden-mobile">Submitted</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="run of latestSpeedruns" :key="run.id">
                  <td class="has-text-centered has-text-grey">
                    <span :class="`rank-${run.category_rank}`">
                      {{ run.category_rank }}
                    </span>
                  </td>
                  <td>
                    <span class="has-no-wrap">
                      <a
                        v-if="!run.user_id"
                        :style="`color: ${run.speedrun_user_dark_color_from};`"
                        :href="run.speedrun_user_weblink"
                        target="_blank"
                      >
                        <CountryIcon
                          imgClass="flag"
                          :code="run.speedrun_user_country_code"
                        />
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
                        <CountryIcon
                          imgClass="flag"
                          :code="run.speedrun_user_country_code"
                        />
                        {{ run.user_name }}
                      </router-link>
                    </span>
                    <span v-if="run.character_id">
                      <span class="has-text-grey">as</span>
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
                  </td>
                  <td>
                    <span class="is-family-monospace">
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </span>
                  </td>
                  <td class="has-text-capitalized">
                    <router-link
                      :to="{
                        name: 'Leaderboard',
                        hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                          run.hero
                        }/${run.players_category}`
                      }"
                    >
                      {{ run.category_name }}
                      <span :class="`is-hidden-touch has-hero ${run.hero}`">
                        {{ run.hero }}
                      </span>
                      <span v-if="!run.hc"> SC</span>
                      <span v-if="run.hc">HC</span>
                      {{ run.players_category }}
                    </router-link>
                  </td>
                  <td class="is-hidden-mobile has-text-grey is-narrow">
                    {{ run.submit_time | FromNowFilter }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Fresh world records -->
          <div class="column is-full is-6-fullhd">
            <h1 class="subtitle">Fresh world records</h1>
            <table class="table is-striped is-hoverable is-narrow is-fullwidth">
              <thead>
                <tr>
                  <th class="has-text-centered is-narrow">#</th>
                  <th class="">Runner</th>
                  <th class="">Time</th>
                  <th class="">Category</th>
                  <th class="is-hidden-mobile">Submitted</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="run of latestRecords" :key="run.id">
                  <td class="has-text-centered">
                    <span :class="`rank-${run.category_rank}`">
                      {{ run.category_rank }}
                    </span>
                  </td>
                  <td class="">
                    <span class="has-no-wrap">
                      <a
                        v-if="!run.user_id"
                        :style="`color: ${run.speedrun_user_dark_color_from};`"
                        :href="run.speedrun_user_weblink"
                        target="_blank"
                      >
                        <CountryIcon
                          imgClass="flag"
                          :code="run.speedrun_user_country_code"
                        />
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
                        <CountryIcon
                          imgClass="flag"
                          :code="run.speedrun_user_country_code"
                        />
                        {{ run.user_name }}
                      </router-link>
                    </span>
                    <span v-if="run.character_id">
                      <span class="has-text-grey">as</span>
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
                  </td>
                  <td>
                    <span class="is-family-monospace">
                      <a :href="run.speedrun_link" target="_blank">
                        {{ run.seconds_played | DurationFilter }}
                      </a>
                    </span>
                  </td>
                  <td class="has-text-capitalized">
                    <router-link
                      :to="{
                        name: 'Leaderboard',
                        hash: `#${run.category_id}/${run.hc ? 'hc' : 'sc'}/${
                          run.hero
                        }/${run.players_category}`
                      }"
                    >
                      {{ run.category_name }}
                      <span :class="`is-hidden-touch has-hero ${run.hero}`">
                        {{ run.hero }}
                      </span>
                      <span v-if="!run.hc"> SC</span>
                      <span v-if="run.hc"> HC</span>
                      {{ run.players_category }}
                    </router-link>
                  </td>
                  <td class="is-hidden-mobile has-text-grey is-narrow">
                    {{ run.submit_time | FromNowFilter }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="column">
            <router-link :to="{ name: 'Leaderboard' }">
              <button class="button is-small is-primary">
                View the full leaderboard
              </button>
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
    <!-- Latest Article -->
    <section class="section pt-0">
      <div class="container">
        <div class="columns">
          <div class="column is-6">
            <h1 class="subtitle">Latest article</h1>
            <BlogPostBox :post="latestPost"></BlogPostBox>
            <router-link :to="{ name: 'Blog' }">
              <button class="button is-small is-primary">
                Read more articles
              </button>
            </router-link>
          </div>
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
