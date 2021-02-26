<template>
  <v-row no-gutters v-if="!streamOverlay && character.name" class="fill-height">
    <v-btn fixed right bottom fab small @click="toggleTwitchEmbed()">
      <v-icon v-if="!showTwitchEmbed"> mdi-twitch </v-icon>
      <v-icon v-if="showTwitchEmbed"> mdi-close </v-icon>
    </v-btn>
    <v-col>
      <v-row no-gutters>
        <v-col cols="12" class="mt-3 text-center">
          <v-icon v-if="character.hc" color="error"> mdi-skull-outline </v-icon>
          <h1>{{ character.name }}</h1>
          <h2 class="subtitle">
            <span v-if="character.hc"> Hardcore </span>
            {{ character.hero | HeroNameFilter }}
          </h2>
        </v-col>
        <v-col cols="12" class="my-4">
          <!-- Globes -->
          <v-row no-gutters class="text-center">
            <!-- Life -->
            <v-col cols="12" md="4">
              <v-progress-circular
                v-if="!character.dead"
                :rotate="90"
                :size="64"
                :value="(character.life / character.life_max) * 100"
                color="error"
                width="3"
              >
                {{ character.life }}
              </v-progress-circular>
              <v-progress-circular
                v-if="character.dead"
                :rotate="90"
                :size="64"
                :value="0"
                color="error"
                width="3"
              >
                <v-icon color="error"> mdi-skull-crossbones </v-icon>
              </v-progress-circular>
            </v-col>
            <!-- Character avatar -->
            <v-col cols="12" md="4">
              <router-link
                :to="{
                  name: 'Character',
                  params: {
                    user_name: character.user_name,
                    character_slug: character.name + character.id
                  }
                }"
              >
                <v-avatar size="64">
                  <Icon :name="`big-${character.hero}`" />
                </v-avatar>
              </router-link>
            </v-col>
            <!-- Mana -->
            <v-col cols="12" md="4">
              <v-progress-circular
                :rotate="90"
                :size="64"
                :value="(character.mana / character.mana_max) * 100"
                color="info"
                width="3"
              >
                {{ character.mana }}
              </v-progress-circular>
            </v-col>
          </v-row>
        </v-col>
        <!-- Experience progress bar -->
        <v-col cols="12">
          <v-progress-linear
            :value="(character.life / character.life_max) * 100"
            height="2"
            color="grey"
            tile
          ></v-progress-linear>
        </v-col>
        <!-- Level, deaths, players/difficulty -->
        <v-col cols="6">
          <v-list dense color="transparent">
            <v-list-item>
              <v-list-item-content>
                <h2>{{ character.level }}</h2>
                <h2 class="subtitle">Level</h2>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <h2>{{ character.deaths }}</h2>
                <h2 class="subtitle">Deaths</h2>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <h2>{{ character.difficulty | DifficultyFilter }}</h2>
                <h2 class="subtitle">Players {{ character.players }}</h2>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <!-- Experience, gold, town visits -->
        <v-col cols="6">
          <v-list dense color="transparent">
            <v-list-item>
              <v-list-item-content>
                <h2>12.92%</h2>
                <h2 class="subtitle">Experience</h2>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <h2>{{ character.gold }}</h2>
                <h2 class="subtitle">Gold</h2>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <h2>{{ character.town_visits }}</h2>
                <h2 class="subtitle">Town visits</h2>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <!-- Attributes -->
        <v-col cols="6">
          <v-list dense color="transparent">
            <v-list-item v-for="attribute in attributes" :key="attribute.title">
              <v-icon left> {{ attribute.icon }} </v-icon>
              <v-list-item-content>
                <h2>{{ character[attribute.stat] }}</h2>
                <h2 class="subtitle">{{ attribute.title }}</h2>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <!-- Resistances -->
        <v-col cols="6">
          <v-list dense color="transparent">
            <v-list-item
              v-for="resistance in resistances"
              :key="resistance.title"
            >
              <v-icon left :color="resistance.color">
                {{ resistance.icon }}
              </v-icon>
              <v-list-item-content>
                <h2
                  v-if="
                    character[resistance.stat] >= 0 &&
                      character[resistance.stat] < 75
                  "
                >
                  {{ character[resistance.stat] }}
                </h2>
                <h2 v-if="character[resistance.stat] < 0" class="error--text">
                  {{ character[resistance.stat] }}
                </h2>
                <h2
                  v-if="character[resistance.stat] >= 75"
                  class="orange--text text-lighten-2"
                >
                  {{ character[resistance.stat] }}
                </h2>
                <h2 class="subtitle">{{ resistance.title }}</h2>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-col>
    <v-divider vertical class="hidden-sm-and-down" />
    <!-- Middle tabs -->
    <v-col cols="12" md="6">
      <!-- Right side columns -->
      <v-tabs
        v-model="tab"
        color="grey"
        active-class="white--text"
        slider-size="1"
        background-color="transparent"
      >
        <v-tab>Items</v-tab>
        <v-tab v-if="character.hireling_name">Merc</v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <v-row no-gutters v-if="showTwitchEmbed">
        <v-col cols="12">
          <TwitchEmbed :username="character.user_name" />
        </v-col>
      </v-row>
      <!-- Items tab -->
      <v-tabs-items v-model="tab">
        <v-tab-item class="pa-2 darker">
          <v-row dense>
            <!-- Character items -->
            <v-col
              cols="12"
              md="6"
              lg="4"
              v-for="item in items"
              :key="item.type"
            >
              <CharacterItem
                v-if="character[item.type]"
                :item="character[item.type]"
              />
              <!-- Empty item -->
              <v-card
                v-if="!character[item.type]"
                elevation="1"
                class="fill-height d-flex align-center pa-2 fade"
              >
                <v-flex>
                  <p class="text-center grey--text body-2 font-italic">empty</p>
                </v-flex>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <!-- Mercenary/Hireling tab -->
        <v-tab-item class="pa-2 darker">
          <v-row dense>
            <!-- Hireling items -->
            <v-col
              cols="12"
              md="6"
              lg="3"
              v-for="hirelingItem in hirelingItems"
              :key="hirelingItem.type"
            >
              <CharacterItem
                v-if="character[hirelingItem.type]"
                :item="character[hirelingItem.type]"
              />
              <!-- Empty hireling item -->
              <v-card
                v-if="!character[hirelingItem.type]"
                elevation="1"
                class="fill-height d-flex align-center pa-2 fade"
              >
                <v-flex>
                  <p class="text-center grey--text body-2 font-italic">empty</p>
                </v-flex>
              </v-card>
            </v-col>
            <!-- Hireling extra items for mods like Project D2 -->
            <v-col
              cols="12"
              md="6"
              lg="4"
              v-for="hirelingExtraItem in hirelingExtraItems"
              :key="hirelingExtraItem.type"
            >
              <CharacterItem
                v-if="character[hirelingExtraItem.type]"
                :item="character[hirelingExtraItem.type]"
              />
              <!-- Empty hireling item -->
              <v-card
                v-if="!character[hirelingExtraItem.type]"
                elevation="1"
                class="fill-height d-flex align-center pa-2 fade"
              >
                <v-flex>
                  <p class="text-center grey--text body-2 font-italic">empty</p>
                </v-flex>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
      <v-divider />
    </v-col>
    <v-divider vertical class="hidden-sm-and-down" />
    <!-- Right columns -->
    <v-col>
      <v-row no-gutters>
        <!-- User info -->
        <v-col class="pa-4 text-center">
          <router-link
            :to="{
              name: 'User',
              params: { user_name: character.user_name }
            }"
          >
            <v-avatar
              v-if="character.user_profile_image_url"
              size="72"
              class="mb-1"
            >
              <v-img :src="character.user_profile_image_url"></v-img>
            </v-avatar>
          </router-link>
          <h1>
            <router-link
              :to="{
                name: 'User',
                params: { user_name: character.user_name }
              }"
            >
              {{ character.user_name }}
            </router-link>
          </h1>
          <h2 class="subtitle">
            Added {{ character.start_time | FromNowFilter }}
          </h2>
        </v-col>
        <!-- Stats -->
        <v-col cols="12">
          <v-divider></v-divider>
          <v-list dense color="transparent">
            <v-list-item v-for="stat in stats" :key="stat.title">
              <v-icon left> {{ stat.icon }} </v-icon>
              <v-list-item-content>
                <h2>{{ character[stat.value] }}</h2>
                <h2 class="subtitle">{{ stat.title }}</h2>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <!-- Mercenary -->
        <v-col cols="12" v-if="character.hireling_name">
          <v-divider />
          <v-card flat>
            <v-row no-gutters>
              <v-col>
                <v-list dense class="py-0 darker">
                  <v-list-item>
                    <v-avatar size="24" class="mr-2">
                      <Icon :name="`${character.hireling_class}`" />
                    </v-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.hireling_name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left> mdi-sword </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Level {{ character.hireling_level }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-for="hirelingAttribute in hirelingAttributes"
                    :key="hirelingAttribute.title"
                    class="px-3"
                  >
                    <v-icon left>
                      {{ hirelingAttribute.icon }}
                    </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character[hirelingAttribute.stat] }}
                        {{ hirelingAttribute.short }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col>
                <v-list dense class="py-0 darker">
                  <v-list-item
                    v-for="hirelingResistance in hirelingResistances"
                    :key="hirelingResistance.title"
                    class="px-3"
                  >
                    <v-icon left :color="hirelingResistance.color">
                      {{ hirelingResistance.icon }}
                    </v-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        v-if="
                          character[hirelingResistance.stat] >= 0 &&
                            character[hirelingResistance.stat] < 75
                        "
                      >
                        {{ character[hirelingResistance.stat] }}
                      </v-list-item-title>
                      <v-list-item-title
                        v-if="character[hirelingResistance.stat] < 0"
                      >
                        <span class="error--text">
                          {{ character[hirelingResistance.stat] }}
                        </span>
                      </v-list-item-title>
                      <v-list-item-title
                        v-if="character[hirelingResistance.stat] >= 75"
                      >
                        <span class="orange--text text--lighten-2">
                          {{ character[hirelingResistance.stat] }}
                        </span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <!-- Share, seed -->
        <v-col cols="12">
          <v-divider></v-divider>
          <!-- Share and seed fields -->
          <v-text-field
            outlined
            dense
            prepend-inner-icon="mdi-share"
            :value="
              'https://diablo.run/' + character.user_name + '/' + character.id
            "
            :label="'Share ' + character.name"
            readonly
            hide-details
            class="mt-3 px-4"
          ></v-text-field>
          <v-text-field
            v-if="isEditor"
            dense
            outlined
            :value="character.seed"
            :label="character.name + ' map seed'"
            readonly
            hide-details
            class="mt-3 px-4"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
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
      showTwitchEmbed: false,
      tab: 0,
      user: null,
      username: '',

      attributes: [
        { stat: 'strength', title: 'Strength', icon: 'mdi-arm-flex' },
        { stat: 'dexterity', title: 'Dexterity', icon: 'mdi-bullseye-arrow' },
        { stat: 'vitality', title: 'Vitality', icon: 'mdi-heart' },
        { stat: 'energy', title: 'Energy', icon: 'mdi-bottle-tonic' }
      ],
      resistances: [
        { stat: 'fire_res', title: 'Fire', icon: 'mdi-fire', color: 'error' },
        {
          stat: 'cold_res',
          title: 'Cold',
          icon: 'mdi-snowflake',
          color: 'info'
        },
        {
          stat: 'light_res',
          title: 'Light',
          icon: 'mdi-lightning-bolt',
          color: 'warning'
        },
        {
          stat: 'poison_res',
          title: 'Poison',
          icon: 'mdi-bottle-tonic-skull',
          color: 'success'
        }
      ],
      stats: [
        { value: 'fcr', title: 'Faster cast rate', icon: 'mdi-auto-fix' },
        {
          value: 'fhr',
          title: 'faster hit recovery',
          icon: 'mdi-human-handsdown'
        },
        { value: 'frw', title: 'Faster run/walk', icon: 'mdi-shoe-print' },
        {
          value: 'ias',
          title: 'Increased attack speed',
          icon: 'mdi-sword-cross'
        },
        {
          value: 'mf',
          title: 'Magic find',
          icon: 'mdi-horseshoe'
        }
      ],
      hirelingAttributes: [
        { stat: 'hireling_strength', short: 'Str', icon: 'mdi-arm-flex' },
        { stat: 'hireling_dexterity', short: 'Dex', icon: 'mdi-bullseye-arrow' }
      ],
      hirelingResistances: [
        {
          stat: 'hireling_fire_res',
          title: 'Fire',
          icon: 'mdi-fire',
          color: 'error'
        },
        {
          stat: 'hireling_cold_res',
          title: 'Cold',
          icon: 'mdi-snowflake',
          color: 'info'
        },
        {
          stat: 'hireling_light_res',
          title: 'Light',
          icon: 'mdi-lightning-bolt',
          color: 'warning'
        },
        {
          stat: 'hireling_poison_res',
          title: 'Poison',
          icon: 'mdi-bottle-tonic-skull',
          color: 'success'
        }
      ],
      items: [
        { type: 'primary_left' },
        { type: 'head' },
        { type: 'primary_right' },
        { type: 'secondary_left' },
        { type: 'body_armor' },
        { type: 'secondary_right' },
        { type: 'gloves' },
        { type: 'belt' },
        { type: 'boots' },
        { type: 'ring_left' },
        { type: 'amulet' },
        { type: 'ring_right' }
      ],
      hirelingItems: [
        { type: 'hireling_primary_left' },
        { type: 'hireling_head' },
        { type: 'hireling_body_armor' },
        { type: 'hireling_secondary_left' }
      ],
      hirelingExtraItems: [
        { type: 'hireling_gloves' },
        { type: 'hireling_belt' },
        { type: 'hireling_boots' }
      ]
    };
  },
  computed: {
    ...mapState({
      character: state => state.ws.character,
      streamOverlay: state => state.app.windowStyle === 'overlay'
    }),
    isEditor() {
      if (!this.$store.state.auth.user) {
        return false;
      }

      return this.$store.state.auth.user.login === this.username.toLowerCase();
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler({ params: { user_name, character_slug } }) {
        this.username = user_name.toLowerCase();

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
