<template>
  <div>
    <v-container v-if="character.name">
      <v-row dense>
        <!-- Title -->
        <v-col cols="12">
          <v-row no-gutters class="mb-2">
            <!-- Hero name -->
            <v-col cols="12" lg="4">
              <h2>
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
              </h2>
              <h2 class="subtitle">
                <span v-if="character.hc"> Hardcore </span>
                {{ character.hero | HeroNameFilter }}
              </h2>
            </v-col>
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
            <v-col cols="12" lg="4" class="text-right">
              <h2>
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
                {{ character.update_time | FromNowFilter }}
              </h2>
            </v-col>
          </v-row>
        </v-col>
        <!-- Tabs -->
        <v-col cols="12">
          <v-tabs
            v-model="tab"
            color="grey"
            active-class="white--text"
            slider-size="1"
            background-color="transparent"
            centered
          >
            <v-tab>Items</v-tab>
            <v-tab>Inventory</v-tab>
            <v-tab>Stash</v-tab>
            <v-tab>Merc</v-tab>
          </v-tabs>
        </v-col>
        <!-- Left -->
        <v-col cols="12" md="3" lg="2" class="text-right">
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
                <v-list-item>
                  <v-list-item-content>
                    <h3>{{ character.seed }}</h3>
                    <h3 class="subtitle">Seed</h3>
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
                  <v-list-item-content>
                    <h3>{{ character[attribute.stat] }}</h3>
                    <h3 class="subtitle">{{ attribute.title }}</h3>
                  </v-list-item-content>
                  <v-icon right> {{ attribute.icon }} </v-icon>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
        <!-- Middle -->
        <v-col cols="12" md="6" lg="8">
          <v-row no-gutters v-if="showTwitchEmbed">
            <v-col cols="12">
              <TwitchEmbed :username="character.user_name" />
            </v-col>
          </v-row>
          <!-- Items tab -->
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-row dense>
                <!-- Character items -->
                <v-col
                  cols="12"
                  md="6"
                  lg="4"
                  v-for="{ slot, item } in characterItems"
                  :key="slot"
                >
                  <CharacterItem v-if="item" :item="item" />

                  <!-- Empty slot -->
                  <v-card
                    flat
                    v-if="!item"
                    class="fill-height d-flex align-center pa-2"
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
            <!-- Inventory tab -->
            <v-tab-item>
              <v-row dense>
                <v-col
                  cols="12"
                  md="6"
                  lg="4"
                  v-for="item in inventoryItems"
                  :key="item.item_hash"
                >
                  <CharacterItem :item="item" />
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- Stash tab -->
            <v-tab-item>
              <v-row dense>
                <v-col
                  cols="12"
                  md="6"
                  lg="4"
                  v-for="item in stashItems"
                  :key="item.item_hash"
                >
                  <CharacterItem :item="item" />
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
                  v-for="{ slot, item } in hirelingItems"
                  :key="slot"
                >
                  <CharacterItem v-if="item" :item="item" />

                  <!-- Empty hireling item -->
                  <v-card
                    v-if="!item"
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
                  v-for="{ slot, item } in hirelingExtraItems"
                  :key="slot"
                >
                  <CharacterItem v-if="item" :item="item" />

                  <!-- Empty hireling item -->
                  <v-card
                    v-if="!item"
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
      ]
    };
  },
  computed: {
    ...mapState({
      character(state) {
        return state.ws.character;
      },
      characterItems(state) {
        const slots = [
          'primary_left',
          'head',
          'primary_right',
          'secondary_left',
          'body_armor',
          'secondary_right',
          'gloves',
          'belt',
          'boots',
          'ring_left',
          'amulet',
          'ring_right'
        ];

        return slots.map((slot) => ({
          slot,
          item: state.ws.items.find(
            (item) => item.container === 'character' && item.slot === slot
          )
        }));
      },
      hirelingItems(state) {
        const slots = ['primary_left', 'head', 'body_armor', 'primary_right'];

        return slots.map((slot) => ({
          slot,
          item: state.ws.items.find(
            (item) => item.container === 'hireling' && item.slot === slot
          )
        }));
      },
      hirelingExtraItems(state) {
        const slots = ['gloves', 'belt', 'boots'];

        return slots.map((slot) => ({
          slot,
          item: state.ws.items.find(
            (item) => item.container === 'hireling' && item.slot === slot
          )
        }));
      },
      inventoryItems(state) {
        return state.ws.items.filter((item) => item.container === 'inventory');
      },
      stashItems(state) {
        return state.ws.items.filter((item) => item.container === 'stash');
      },
      streamOverlay: (state) => state.app.windowStyle === 'overlay'
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
