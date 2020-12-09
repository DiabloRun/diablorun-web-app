<template>
  <div>
    <!-- Hero -->
    <section v-if="!streamOverlay" class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <!-- Character class icon -->
            <div
              class="column is-narrow has-tooltip-right"
              :data-tooltip="character.hero | HeroNameFilter"
            >
              <router-link
                :to="{
                  name: 'Character',
                  params: {
                    user_name: character.user_name,
                    character_slug: character.name + character.id
                  }
                }"
              >
                <Icon
                  imgClass="has-glow is-rounded"
                  :name="`big-${character.hero}`"
                />
              </router-link>
            </div>
            <!-- Character name -->
            <div class="column">
              <h1 class="title is-5">
                <router-link
                  :to="{
                    name: 'Character',
                    params: {
                      user_name: character.user_name,
                      character_slug: character.name + character.id
                    }
                  }"
                >
                  {{ character.name }}
                </router-link>
              </h1>
            </div>
            <!-- Username -->
            <div class="column is-narrow">
              <h1 class="title is-5">
                <span class="has-light-text-fade"
                  ><span class="is-hidden-mobile">Added</span> by
                </span>
                <router-link
                  :to="{
                    name: 'User',
                    params: { user_name: character.user_name }
                  }"
                >
                  {{ character.user_name }}
                </router-link>
              </h1>
            </div>
            <!-- User Avatar -->
            <div
              v-if="character.user_profile_image_url"
              class="column is-narrow is-hidden-mobile"
            >
              <router-link
                :to="{
                  name: 'User',
                  params: { user_name: character.user_name }
                }"
              >
                <figure class="image is-48x48">
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
    <section v-if="!streamOverlay" class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-mobile is-multiline is-vcentered is-centered">
            <div class="column">
              <p v-if="!(character.hc && character.dead)" class="subtitle is-5">
                <span class="is-unique">{{
                  character.area | AreaNameFilter
                }}</span>
                <span class="has-light-text-fade">
                  in {{ character.difficulty | DifficultyFilter }}</span
                >
              </p>
              <p v-if="character.hc && character.dead" class="subtitle is-5">
                <span class="has-text-warning">Died</span> in
                {{ character.difficulty | DifficultyFilter }}
                <span class="is-unique">{{
                  character.area | AreaNameFilter
                }}</span>
              </p>
            </div>
            <div class="column is-narrow is-hidden-mobile has-text-right">
              <p class="subtitle is-5">
                {{ character.town_visits }} Town Visits
              </p>
            </div>
            <div class="column is-narrow has-text-right">
              <p class="subtitle is-5">
                Players <span class="is-hidden-mobile">set to </span
                >{{ character.players }}
              </p>
            </div>
            <div
              class="column is-narrow has-tooltip-left"
              :data-tooltip="'Toggle ' + character.user_name + ' Twitch stream'"
            >
              <figure class="image is-24x24">
                <a @click="toggleTwitchEmbed()">
                  <img src="@/assets/img/icons/TwitchGlitchWhite.svg" />
                </a>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="!showTwitchEmbed" class="section pb-0">
      <div class="container">
        <TwitchEmbed :username="character.user_name" />
      </div>
    </section>
    <section class="section pb-0" v-if="!streamOverlay">
      <div class="container">
        <div class="columns has-text-centered-mobile is-mobile is-multiline">
          <!-- Globes for mobile -->
          <div class="column is-full is-hidden-tablet">
            <div class="columns is-mobile is-centered">
              <div
                class="column is-narrow"
                v-if="character.life !== null"
                data-tooltip="Life"
              >
                <h1 class="heading has-text-centered">
                  {{ character.life }} / {{ character.life_max }}
                </h1>
                <progress
                  class="progress is-warning is-small"
                  :value="character.life"
                  :max="character.life_max"
                >
                  {{ (character.life / character.life_max) * 100 }}%
                </progress>
              </div>
              <div
                class="column is-narrow"
                v-if="character.life !== null"
                data-tooltip="Mana"
              >
                <h1 class="heading has-text-centered">
                  {{ character.mana }} / {{ character.mana_max }}
                </h1>
                <progress
                  class="progress is-link is-small"
                  :value="character.mana"
                  :max="character.mana_max"
                >
                  {{ (character.mana / character.mana_max) * 100 }}%
                </progress>
              </div>
            </div>
          </div>
          <!-- Level -->
          <div class="column">
            <div class="columns is-mobile">
              <div
                class="column is-narrow-tablet has-tooltip-right"
                :data-tooltip="character.experience + ' Experience'"
              >
                <p class="heading">Level</p>
                <p class="subtitle is-5">
                  {{ character.level }}
                </p>
              </div>
              <div v-if="!character.hc" class="column is-narrow-tablet">
                <p class="heading">Deaths</p>
                <p class="subtitle is-5">
                  {{ character.deaths }}
                </p>
              </div>
              <div v-if="character.hc" class="column is-narrow-tablet">
                <p class="heading">Deaths</p>
                <p class="subtitle is-5">Hardcore</p>
              </div>
            </div>
          </div>
          <!-- Globes -->
          <div class="column is-narrow is-hidden-mobile">
            <div class="columns is-mobile">
              <div
                class="column is-narrow-desktop"
                v-if="character.life !== null"
                data-tooltip="Life"
              >
                <h1 class="heading has-text-centered">
                  {{ character.life }} / {{ character.life_max }}
                </h1>
                <progress
                  class="progress is-warning is-small"
                  :value="character.life"
                  :max="character.life_max"
                >
                  {{ (character.life / character.life_max) * 100 }}%
                </progress>
              </div>
              <div
                class="column is-narrow-desktop"
                v-if="character.life !== null"
                data-tooltip="Mana"
              >
                <h1 class="heading has-text-centered">
                  {{ character.mana }} / {{ character.mana_max }}
                </h1>
                <progress
                  class="progress is-link is-small"
                  :value="character.mana"
                  :max="character.mana_max"
                >
                  {{ (character.mana / character.mana_max) * 100 }}%
                </progress>
              </div>
            </div>
          </div>
          <!-- Gold -->
          <div class="column">
            <div class="columns is-mobile">
              <div class="column has-text-right-tablet">
                <p class="heading">Gold</p>
                <p class="subtitle is-5 has-text-danger">
                  {{ character.gold_total }}
                </p>
              </div>
              <div
                class="column is-narrow-tablet has-text-right-tablet has-tooltip-left"
                data-tooltip="Magic Find"
              >
                <p class="heading">MF</p>
                <p class="subtitle is-5 has-text-danger">
                  {{ character.mf }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="columns has-text-centered-mobile">
          <!-- Speed -->
          <div class="column">
            <div class="columns is-mobile">
              <div class="column is-narrow-tablet">
                <p class="heading">FCR</p>
                <p class="subtitle is-5">
                  {{ character.fcr }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">FHR</p>
                <p class="subtitle is-5">
                  {{ character.fhr }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">FRW</p>
                <p class="subtitle is-5">
                  {{ character.frw }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">IAS</p>
                <p class="subtitle is-5">
                  {{ character.frw }}
                </p>
              </div>
            </div>
          </div>
          <!-- Resistances -->
          <div class="column is-narrow has-text-centered">
            <div class="columns is-mobile" data-tooltip="Resistances">
              <div class="column is-narrow-tablet">
                <p class="heading">Fire</p>
                <p class="subtitle is-5 has-text-warning">
                  {{ character.fire_res }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">Cold</p>
                <p class="subtitle is-5 has-text-link">
                  {{ character.cold_res }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">Light</p>
                <p class="subtitle is-5 has-text-danger">
                  {{ character.light_res }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">Psn</p>
                <p class="subtitle is-5 has-text-success">
                  {{ character.poison_res }}
                </p>
              </div>
            </div>
          </div>
          <!-- Attributes -->
          <div class="column has-text-right-tablet">
            <div class="columns is-mobile">
              <div class="column">
                <p class="heading">STR</p>
                <p class="subtitle is-5">
                  {{ character.strength }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">DEX</p>
                <p class="subtitle is-5">
                  {{ character.dexterity }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">VIT</p>
                <p class="subtitle is-5">
                  {{ character.vitality }}
                </p>
              </div>
              <div class="column is-narrow-tablet">
                <p class="heading">ENE</p>
                <p class="subtitle is-5">
                  {{ character.energy }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Items -->
    <section v-if="!streamOverlay" class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="columns is-multiline is-gapless">
              <div class="column">
                <CharacterItem
                  v-if="character.primary_left"
                  :item="character.primary_left"
                />
                <div
                  v-if="!character.primary_left"
                  class="card has-round-corners"
                >
                  <div class="card-content equipment">
                    <p class="has-text-fade">Primary left</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem v-if="character.head" :item="character.head" />
                <div v-if="!character.head" class="card has-round-corners">
                  <div class="card-content equipment">
                    <p class="has-text-fade">Helm</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.primary_right"
                  :item="character.primary_right"
                />
                <div
                  v-if="!character.primary_right"
                  class="card has-round-corners"
                >
                  <div class="card-content equipment">
                    <p class="has-text-fade">Primary right</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.secondary_left"
                  :item="character.secondary_left"
                />
                <div
                  v-if="!character.secondary_left"
                  class="card has-round-corners"
                >
                  <div class="card-content equipment">
                    <p class="has-text-fade">Secondary left</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.body_armor"
                  :item="character.body_armor"
                />
                <div
                  v-if="!character.body_armor"
                  class="card has-round-corners"
                >
                  <div class="card-content equipment">
                    <p class="has-text-fade">Armor</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.secondary_right"
                  :item="character.secondary_right"
                />
                <div
                  v-if="!character.secondary_right"
                  class="card has-round-corners"
                >
                  <div class="card-content equipment">
                    <p class="has-text-fade">Secondary right</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.gloves"
                  :item="character.gloves"
                />
                <div v-if="!character.gloves" class="card has-round-corners">
                  <div class="card-content equipment">
                    <p class="has-text-fade">Gloves</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem v-if="character.belt" :item="character.belt" />
                <div v-if="!character.belt" class="card has-round-corners">
                  <div class="card-content equipment">
                    <p class="has-text-fade">Belt</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem v-if="character.boots" :item="character.boots" />
                <div v-if="!character.boots" class="card has-round-corners">
                  <div class="card-content equipment">
                    <p class="has-text-fade">Boots</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.ring_left"
                  :item="character.ring_left"
                />
                <div v-if="!character.ring_left" class="card has-round-corners">
                  <div class="card-content equipment">
                    <p class="has-text-fade">Left ring</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.amulet"
                  :item="character.amulet"
                />
                <div v-if="!character.amulet" class="card has-round-corners">
                  <div class="card-content equipment">
                    <p class="has-text-fade">Amulet</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.ring_right"
                  :item="character.ring_right"
                />
                <div
                  v-if="!character.ring_right"
                  class="card has-round-corners"
                >
                  <div class="card-content equipment">
                    <p class="has-text-fade">Right ring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Mercenary -->
    <section
      class="hero is-dark"
      v-if="character.hireling_name && !streamOverlay"
    >
      <div class="hero-body">
        <div class="container">
          <div class="columns has-text-centered is-mobile is-vcentered">
            <div class="column is-narrow">
              <Icon :name="`${character.hireling_class}`" />
            </div>
            <div class="column has-text-left">
              <p class="subtitle is-5">
                Level {{ character.hireling_level }}
                {{ character.hireling_name }}
              </p>
            </div>
            <div class="column is-narrow">
              <p class="subtitle is-5">
                {{ character.hireling_strength }} Strength
              </p>
            </div>
            <div class="column is-narrow">
              <p class="subtitle is-5">
                {{ character.hireling_dexterity }} Dexterity
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Mercenary Equipment -->
    <section class="section" v-if="character.hireling_name && !streamOverlay">
      <div class="container">
        <div class="columns is-multiline is-gapless">
          <div class="column is-4-widescreen is-6-tablet">
            <CharacterItem
              v-if="character.hireling_primary_left"
              :item="character.hireling_primary_left"
            />
            <div
              v-if="!character.hireling_primary_left"
              class="card has-round-corners"
            >
              <div class="card-content equipment">
                <p class="has-text-fade">Primary left</p>
              </div>
            </div>
          </div>
          <div class="column is-4-widescreen is-6-tablet">
            <CharacterItem
              v-if="character.hireling_head"
              :item="character.hireling_head"
            />
            <div v-if="!character.hireling_head" class="card has-round-corners">
              <div class="card-content equipment">
                <p class="has-text-fade">Head</p>
              </div>
            </div>
          </div>
          <div class="column is-4-widescreen is-6-tablet">
            <CharacterItem
              v-if="character.hireling_body_armor"
              :item="character.hireling_body_armor"
            />
            <div
              v-if="!character.hireling_body_armor"
              class="card has-round-corners"
            >
              <div class="card-content equipment">
                <p class="has-text-fade">Armor</p>
              </div>
            </div>
          </div>
          <div
            class="column is-4-widescreen is-6-tablet"
            v-if="character.hireling_primary_right"
          >
            <CharacterItem
              v-if="character.hireling_primary_right"
              :item="character.hireling_primary_right"
            />
          </div>
          <div
            class="column is-4-widescreen is-6-tablet"
            v-if="character.hireling_gloves"
          >
            <CharacterItem
              v-if="character.hireling_gloves"
              :item="character.hireling_gloves"
            />
          </div>
          <div
            class="column is-4-widescreen is-6-tablet"
            v-if="character.hireling_belt"
          >
            <CharacterItem
              v-if="character.hireling_belt"
              :item="character.hireling_belt"
            />
          </div>
          <div
            class="column is-4-widescreen is-6-tablet"
            v-if="character.hireling_boots"
          >
            <CharacterItem
              v-if="character.hireling_boots"
              :item="character.hireling_boots"
            />
          </div>
        </div>
      </div>
    </section>
    <!-- #overlay for streaming -->
    <section class="section" v-if="streamOverlay">
      <div class="columns is-mobile is-gapless is-multiline streamoverlay">
        <!-- Level -->
        <div class="column is-full">
          <div class="columns is-mobile is-vcentered">
            <div class="column">
              <p :class="`${character.hero} title`">{{ character.name }}</p>
            </div>
            <div class="column is-narrow">
              <p class="title">
                <span class="has-light-text-fade">Level</span>
                {{ character.level }}
              </p>
            </div>
            <div class="column is-narrow">
              <p class="title">
                <span class="has-light-text-fade">Players</span>
                {{ character.players }}
              </p>
            </div>
          </div>
        </div>
        <div class="column">
          <!-- Resistances -->
          <div class="columns is-mobile has-tiny-margin-top">
            <div class="column is-narrow has-light-text-fade">
              <p class="title">FIRE</p>
              <p class="title">COLD</p>
              <p class="title">LIGH</p>
              <p class="title">POIS</p>
            </div>
            <div class="column">
              <p class="title has-text-warning">{{ character.fire_res }}</p>
              <p class="title has-text-link">{{ character.cold_res }}</p>
              <p class="title has-text-danger">{{ character.light_res }}</p>
              <p class="title has-text-success">{{ character.poison_res }}</p>
            </div>
          </div>
        </div>
        <div class="column">
          <!-- Attributes -->
          <div class="columns is-mobile has-tiny-margin-top">
            <div class="column is-narrow has-light-text-fade">
              <p class="title">STR</p>
              <p class="title">DEX</p>
              <p class="title">VIT</p>
              <p class="title">ENE</p>
            </div>
            <div class="column">
              <p class="title">{{ character.strength }}</p>
              <p class="title">{{ character.dexterity }}</p>
              <p class="title">{{ character.vitality }}</p>
              <p class="title">{{ character.energy }}</p>
            </div>
          </div>
        </div>
        <div class="column is-narrow">
          <!-- Speed -->
          <div class="columns is-mobile has-tiny-margin-top">
            <div class="column is-narrow has-light-text-fade">
              <p class="title">FCR</p>
              <p class="title">FHR</p>
              <p class="title">FRW</p>
              <p class="title">IAS</p>
            </div>
            <div class="column">
              <p class="title">{{ character.fcr }}</p>
              <p class="title">{{ character.fhr }}</p>
              <p class="title">{{ character.frw }}</p>
              <p class="title">{{ character.ias }}</p>
            </div>
          </div>
        </div>
        <!-- Gold -->
        <div class="column is-full">
          <div class="columns is-mobile has-tiny-margin-top">
            <div class="column">
              <p v-if="character.hc" class="title has-text-warning">Hardcore</p>
              <p v-if="!character.hc" class="title">
                {{ character.deaths }}
                <span class="has-light-text-fade">Deaths</span>
              </p>
            </div>
            <div class="column is-narrow">
              <p class="title">
                <span class="has-text-danger">{{ character.mf }}</span>
                <span class="has-light-text-fade"> MF</span>
              </p>
            </div>
            <div class="column is-narrow">
              <p class="title">
                <span class="has-text-danger">{{ character.gold_total }}</span>
                <span class="has-light-text-fade"> Gold</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  DurationFilter,
  FromNowFilter,
  DifficultyFilter,
  AreaNameFilter,
  HeroNameFilter
} from '@/filters';
import Icon from '@/components/Icon.vue';
import CharacterItem from '@/components/CharacterItem.vue';
import TwitchEmbed from '@/components/TwitchEmbed.vue';

export default {
  name: 'Character',
  filters: {
    FromNowFilter,
    DurationFilter,
    DifficultyFilter,
    AreaNameFilter,
    HeroNameFilter
  },
  components: {
    Icon,
    CharacterItem,
    TwitchEmbed
  },
  data() {
    return {
      showTwitchEmbed: false
    };
  },
  computed: {
    ...mapState({
      character: state => state.ws.character,
      streamOverlay: state => state.app.windowStyle === 'overlay'
    })
  },
  watch: {
    $route: {
      immediate: true,
      async handler({ params: { user_name, character_slug } }) {
        const id = character_slug
          ? character_slug.replace(/^[^0-9]+/i, '')
          : '';
        const name = user_name.toLowerCase();

        await this.$store.dispatch('ws/subscribeToCharacter', { name, id });
      }
    }
  },
  methods: {
    toggleTwitchEmbed() {
      this.showTwitchEmbed = !this.showTwitchEmbed;
    }
  }
};
</script>
