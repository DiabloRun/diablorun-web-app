<template>
  <div>
    <!-- Hero account -->
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column is-narrow">
              <router-link
                :to="{
                  name: 'Character',
                  params: {
                    user_name: character.user_name,
                    character_slug: character.name + character.id,
                  },
                }"
              >
                <Icon imgClass="has-glow" :name="`big-${character.hero}`" />
              </router-link>
            </div>
            <div class="column">
              <h1 class="title is-2">
                <router-link
                  :to="{
                    name: 'Character',
                    params: {
                      user_name: character.user_name,
                      character_slug: character.name + character.id,
                    },
                  }"
                >
                {{ character.name }}</router-link>
              </h1>
            </div>
            <div class="column is-narrow">
               <h1 class="title is-5">
                 <span class="has-text-fade">Added by </span>
                <router-link
                  :to="{
                    name: 'User',
                    params: { user_name: character.user_name },
                  }"
                >{{ character.user_name }}</router-link>
               </h1>
            </div>
            <div v-if="character.user_profile_image_url" class="column is-narrow">
              <router-link
                :to="{
                  name: 'User',
                  params: { user_name: character.user_name },
                }"
              >
                <figure class="image is-64x64">
                  <img
                    :src="character.user_profile_image_url"
                    class="is-rounded"
                  />
                </figure>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Infobar -->
    <section class="hero is-dark has-margin-bottom">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-mobile has-text-centered">
            <div class="column">
              <p class="heading">Level</p>
              <p class="title is-4">{{ character.level }}</p>
            </div>
            <div class="column">
              <p class="heading">Gold</p>
              <p class="title is-4">{{ character.gold_total }}</p>
            </div>
            <div class="column">
              <p class="heading">MF</p>
              <p class="title is-4">{{ character.mf }}</p>
            </div>
            <div class="column">
              <p class="heading">Deaths</p>
              <p v-if="!character.hc" class="title is-4">
                {{ character.deaths }}
              </p>
              <p v-if="character.hc" class="title is-4 has-text-warning">
                Hardcore
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Charts -->
    <section class="section">
      <div class="container is-fluid">
        <ScatterChart
          ref="experienceChart"
          :chartData="experienceChartData"
          :styles="{ height: '300px', position: 'relative' }"
        />

        <ScatterChart
          ref="goldTotalChart"
          :chartData="goldTotalChartData"
          :styles="{ height: '300px', position: 'relative' }"
        />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";
</style>

<script>
import { mapState } from "vuex";
import Icon from "@/components/Icon.vue";
import ScatterChart from "@/components/ScatterChart.vue";

export default {
  name: "CharacterStatistics",
  data() {
    return {
      experienceChartData: {
        datasets: []
      },
      goldTotalChartData: {
        datasets: []
      }
    };
  },
  filters: {
  },
  components: {
    Icon,
    ScatterChart,
  },
  computed: {
    ...mapState({
      character: (state) => state.ws.character,
      characterId: state => state.ws.character.id
    }),
  },
  watch: {
    $route: {
      immediate: true,
      async handler({ params: { user_name, character_slug } }) {
        const id = character_slug
          ? character_slug.replace(/^[^0-9]+/i, "")
          : "";
        const name = user_name.toLowerCase();

        await this.$store.dispatch("ws/subscribeToCharacter", { name, id });
      }
    },

    async characterId(id) {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/characters/${id}/statistics`);
      const { experience, gold_total } = await res.json();

      this.experienceChartData.datasets = [{
        label: 'Experience',
        data: experience.map(row => ({
          x: row.in_game_time,
          y: row.value
        })),
        borderColor: 'white',
        fill: false,
        showLine: true
      }];

      this.$refs.experienceChart.update();

      this.goldTotalChartData.datasets = [{
        label: 'Gold',
        data: gold_total.map(row => ({
          x: row.in_game_time,
          y: row.value
        })),
        borderColor: 'orange',
        fill: false,
        showLine: true
      }];

      this.$refs.goldTotalChart.update();
    }
  },
};
</script>
