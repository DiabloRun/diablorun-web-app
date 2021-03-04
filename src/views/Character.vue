<template>
  <div>
    <v-container v-if="character.name" class="mt-5">
      <v-row>
        <v-col cols="12">
          <v-row no-gutters>
            <!-- Life -->
            <v-col class="text-right">
              <v-progress-circular
                v-if="!character.dead"
                :rotate="90"
                :size="64"
                :value="(character.life / character.life_max) * 100"
                color="error lighten-1"
                width="3"
              >
                {{ character.life }}
              </v-progress-circular>
              <v-progress-circular
                v-if="character.dead"
                :rotate="90"
                :size="64"
                :value="0"
                color="error lighten-1"
                width="3"
              >
                <v-icon color="error lighten-1"> mdi-skull-crossbones </v-icon>
              </v-progress-circular>
            </v-col>
            <!-- Hero icon -->
            <v-col cols="auto" class="text-center px-5">
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
            <v-col>
              <v-progress-circular
                :rotate="90"
                :size="64"
                :value="(character.mana / character.mana_max) * 100"
                color="primary lighten-1"
                width="3"
              >
                {{ character.mana }}
              </v-progress-circular>
            </v-col>
            <!-- Hero name -->
            <v-col cols="12" class="text-center mt-5">
              <h2>
                <router-link
                  :to="{
                    name: 'User',
                    params: { user_name: character.user_name }
                  }"
                >
                  {{ character.name }}
                </router-link>
                by
                <router-link
                  :to="{
                    name: 'User',
                    params: { user_name: character.user_name }
                  }"
                >
                  {{ character.user_name }}
                </router-link>
              </h2>
              <h2 class="subtitle">
                <span v-if="character.hc"> Hardcore </span>
                {{ character.hero | HeroNameFilter }}
              </h2>
            </v-col>
          </v-row>
        </v-col>
        <!-- Left -->
        <v-col cols="12" md="3" lg="2">
          <v-row dense>
            <!-- Level, deaths, players/difficulty -->
            <v-col cols="12">
              <v-list dense color="transparent">
                <v-list-item>
                  <v-list-item-content>
                    <h3>{{ character.level }}</h3>
                    <h3 class="subtitle">Level</h3>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <h3>{{ character.deaths }}</h3>
                    <h3 class="subtitle">Deaths</h3>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <h3>{{ character.difficulty | DifficultyFilter }}</h3>
                    <h3 class="subtitle">Players {{ character.players }}</h3>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <!-- Attributes -->
            <v-col cols="12">
              <v-list dense color="transparent">
                <v-list-item
                  v-for="attribute in attributes"
                  :key="attribute.title"
                >
                  <v-icon left> {{ attribute.icon }} </v-icon>
                  <v-list-item-content>
                    <h3>{{ character[attribute.stat] }}</h3>
                    <h3 class="subtitle">{{ attribute.title }}</h3>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
        <!-- Middle -->
        <v-col cols="12" md="6" lg="8">
          <!-- Middle tabs -->

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
                      <p class="text-center grey--text body-2 font-italic">
                        empty
                      </p>
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
                      <p class="text-center grey--text body-2 font-italic">
                        empty
                      </p>
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
                      <p class="text-center grey--text body-2 font-italic">
                        empty
                      </p>
                    </v-flex>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <!-- Right -->
        <v-col cols="12" md="2" lg="2">
          <v-row dense>
            <!-- Resistances -->
            <v-col cols="12">
              <v-list dense color="transparent">
                <v-list-item
                  v-for="resistance in resistances"
                  :key="resistance.title"
                >
                  <v-icon left :color="resistance.color">
                    {{ resistance.icon }}
                  </v-icon>
                  <v-list-item-content>
                    <h3
                      v-if="
                        character[resistance.stat] >= 0 &&
                          character[resistance.stat] < 75
                      "
                    >
                      {{ character[resistance.stat] }}
                    </h3>
                    <h3
                      v-if="character[resistance.stat] < 0"
                      class="error--text text--lighten-2"
                    >
                      {{ character[resistance.stat] }}
                    </h3>
                    <h3
                      v-if="character[resistance.stat] >= 75"
                      class="link--text text--lighten-2"
                    >
                      {{ character[resistance.stat] }}
                    </h3>
                    <h3 class="subtitle">{{ resistance.title }}</h3>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <!-- Stats -->
            <v-col cols="12">
              <v-list dense color="transparent">
                <v-list-item v-for="stat in stats" :key="stat.title">
                  <v-icon left> {{ stat.icon }} </v-icon>
                  <v-list-item-content>
                    <h3>{{ character[stat.value] }}</h3>
                    <h3 class="subtitle">{{ stat.title }}</h3>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <!-- Share, seed -->
            <v-col cols="12">
              <v-text-field
                outlined
                dense
                prepend-inner-icon="mdi-share"
                :value="
                  'https://diablo.run/' +
                    character.user_name +
                    '/' +
                    character.id
                "
                :label="'Share ' + character.name"
                readonly
                hide-details
                class="mt-3"
              ></v-text-field>
              <v-text-field
                v-if="isEditor"
                dense
                outlined
                :value="character.seed"
                :label="character.name + ' map seed'"
                readonly
                hide-details
                class="mt-3"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
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
        { value: 'fcr', title: 'Cast speed', icon: 'mdi-auto-fix' },
        {
          value: 'fhr',
          title: 'Hit recovery',
          icon: 'mdi-human-handsdown'
        },
        { value: 'frw', title: 'Run speed', icon: 'mdi-shoe-print' },
        {
          value: 'ias',
          title: 'Attack speed',
          icon: 'mdi-sword-cross'
        },
        {
          value: 'mf',
          title: 'Magic find',
          icon: 'mdi-horseshoe'
        },
        {
          value: 'gold_total',
          title: 'Gold',
          icon: 'mdi-gold'
        },
        {
          value: 'town_visits',
          title: 'Town visits',
          icon: 'mdi-castle'
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
