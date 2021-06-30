<template>
  <v-container v-if="character" class="mt-5">
    <v-row dense>
      <!-- Hero icon -->
      <v-col cols="auto" class="mr-3">
        <router-link
          :to="{
            name: 'Character',
            params: {
              user_name: character.user_name,
              character_slug: character.name + character.id
            }
          }"
        >
          <v-avatar size="64" :class="{ hc: character.hc }">
            <Icon :name="`big-${character.hero}`" />
          </v-avatar>
        </router-link>
      </v-col>
      <!-- Title -->
      <v-col class="my-auto">
        <h2>
          <router-link
            :class="{ 'hc--text': character.hc }"
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
          <span v-if="!character.lod">Classic</span>
          <span v-if="character.hc"> Hardcore </span>
          {{ character.hero | HeroNameFilter }}
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
      </v-col>
      <!-- Twitch toggle -->
      <v-col cols="auto" class="my-auto">
        <v-btn icon @click="toggleTwitchEmbed()">
          <v-tooltip left v-if="!showTwitchEmbed">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-icon> mdi-twitch </v-icon>
              </div>
            </template>
            <span>Open Twitch stream</span>
          </v-tooltip>
          <v-icon v-if="showTwitchEmbed"> mdi-close </v-icon>
        </v-btn>
      </v-col>
      <!-- Twitch iframe -->
      <v-col cols="12" class="mt-5" v-if="showTwitchEmbed">
        <TwitchEmbed :username="character.user_name" />
      </v-col>
      <v-col cols="12" class="mt-3">
        <!-- Tabs -->
        <v-tabs
          v-model="tab"
          color="primary lighten-1"
          slider-size="1"
          background-color="transparent"
          centered
        >
          <v-tab>Items</v-tab>
          <v-tab>Inventory</v-tab>
          <v-tab>Stash</v-tab>
          <v-tab>Cube</v-tab>
          <v-tab>Merc</v-tab>
        </v-tabs>
        <v-card>
          <v-row no-gutters>
            <v-col cols="12" sm="4" lg="3" xl="2">
              <v-row class="pt-3 px-4">
                <v-col cols="6" class="d-flex justify-end text-center">
                  <!-- Life -->
                  <v-tooltip top v-if="character.dead">
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <h5>
                          <v-icon small color="error"
                            >mdi-skull-crossbones</v-icon
                          >
                        </h5>
                        <VerticalProgress
                          current="0"
                          :total="character.life_max"
                          color="error"
                        />
                      </div>
                    </template>
                    <span v-if="character.hc">
                      Your deeds of valor will be remembered
                    </span>
                    <span v-if="!character.hc">
                      Life: 0 / {{ character.life_max }}
                    </span>
                  </v-tooltip>
                  <!-- Life -->
                  <v-tooltip top v-if="!character.dead">
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <h5>{{ character.life }}</h5>
                        <VerticalProgress
                          :current="character.life"
                          :total="character.life_max"
                          color="error"
                        />
                      </div>
                    </template>
                    <span>
                      Life: {{ character.life }} / {{ character.life_max }}
                    </span>
                  </v-tooltip>
                </v-col>
                <v-col cols="6" class="d-flex justify-start text-center">
                  <!-- Mana -->
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <h5>{{ character.mana }}</h5>
                        <VerticalProgress
                          :current="character.mana"
                          :total="character.mana_max"
                          color="primary"
                        />
                      </div>
                    </template>
                    <span>
                      Mana: {{ character.mana }} / {{ character.mana_max }}
                    </span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <!-- Experience -->
              <v-progress-linear
                v-if="character.level < 99"
                color="link darken-1"
                height="3"
                :value="experiencePercentage"
                class="mt-4"
              ></v-progress-linear>
              <v-list dense color="transparent">
                <v-list-item>
                  <v-list-item-content>
                    <h3>
                      <strong>Level {{ character.level }}</strong> ({{
                        experiencePercentage
                      }}%)
                    </h3>
                    <h3 v-if="character.level < 99" class="subtitle">
                      {{ character.experience | BigNumberFilter }} experience
                    </h3>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <h3>{{ character.area | AreaNameFilter }}</h3>
                    <h3 class="subtitle">
                      {{ character.difficulty | DifficultyFilter }} Players
                      {{ character.players }}
                    </h3>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="!character.hc">
                  <v-list-item-content>
                    <h3>{{ character.deaths }}</h3>
                    <h3 class="subtitle">Deaths</h3>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <h3>{{ character.total_kills }}</h3>
                    <h3 class="subtitle">Enemies killed</h3>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <h3>{{ character.mf }}%</h3>
                    <h3 class="subtitle">Magic find</h3>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-row dense class="text-center my-3">
                <v-col
                  v-for="resistance in resistances"
                  :key="resistance.title"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <v-icon :color="resistance.color">
                          {{ resistance.icon }}
                        </v-icon>
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
                          class="link--text text--lighten-1"
                        >
                          <strong>{{ character[resistance.stat] }}</strong>
                        </h3>
                      </div>
                    </template>
                    <span>{{ resistance.title }} Resistance</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <!--Attributes-->
              <v-row dense class="text-center my-3">
                <v-col v-for="attribute in attributes" :key="attribute.title">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <v-icon>
                          {{ attribute.icon }}
                        </v-icon>
                        <h3>{{ character[attribute.stat] }}</h3>
                      </div>
                    </template>
                    <span>{{ attribute.title }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <!--Stats-->
              <v-row dense class="text-center my-3">
                <v-col v-for="stat in stats" :key="stat.title">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <v-icon>
                          {{ stat.icon }}
                        </v-icon>
                        <h3>{{ character[stat.value] }}</h3>
                      </div>
                    </template>
                    <span>{{ stat.title }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-divider class="hidden-sm-and-up"></v-divider>
            </v-col>
            <v-divider vertical class="hidden-xs-only"></v-divider>
            <!-- Right -->
            <v-col>
              <!-- Items tab -->
              <v-tabs-items v-model="tab">
                <v-tab-item class="pa-2">
                  <v-row dense class="py-3 text-center">
                    <v-col>
                      <v-icon left>mdi-gold</v-icon
                      >{{ character.gold_total }} gold in total
                    </v-col>
                  </v-row>
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
                        elevation="1"
                        v-if="!item"
                        class="fill-height d-flex align-center pa-2"
                      >
                        <v-flex>
                          <p
                            class="text-center grey--text body-2 font-italic mb-0"
                          >
                            empty
                          </p>
                        </v-flex>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <!-- Inventory tab -->
                <v-tab-item class="pa-2">
                  <v-row dense class="py-3 text-center">
                    <v-col>
                      <v-icon left>mdi-gold</v-icon
                      >{{ character.gold_total - character.gold_stash }} gold in
                      inventory
                    </v-col>
                  </v-row>
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
                <v-tab-item class="pa-2">
                  <v-row dense class="py-3 text-center">
                    <v-col>
                      <v-icon left>mdi-gold</v-icon
                      >{{ character.gold_stash }} gold in stash
                    </v-col>
                  </v-row>
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
                <!-- Cube tab -->
                <v-tab-item class="pa-2">
                  <v-alert
                    v-if="!cubeItems.length"
                    text
                    color="primary"
                    class="ma-0 font-weight-medium text-center"
                  >
                    Cube is empty
                  </v-alert>
                  <v-row dense>
                    <v-col
                      cols="12"
                      md="6"
                      lg="4"
                      v-for="item in cubeItems"
                      :key="item.item_hash"
                    >
                      <CharacterItem :item="item" />
                    </v-col>
                  </v-row>
                </v-tab-item>
                <!-- Mercenary/Hireling tab -->
                <v-tab-item class="pa-2">
                  <v-row dense>
                    <!-- Hireling items -->
                    <v-col
                      cols="12"
                      md="6"
                      lg="4"
                      v-for="{ slot, item } in hirelingItems"
                      :key="slot"
                    >
                      <CharacterItem v-if="item" :item="item" />
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
                    </v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
            <v-col cols="12">
              <v-divider />
              <v-row dense class="pa-3">
                <v-col cols="auto mr-1">
                  <router-link
                    :to="{
                      name: 'User',
                      params: { user_name: character.user_name }
                    }"
                  >
                    <v-avatar size="32">
                      <img
                        v-if="character.user_profile_image_url !== ''"
                        :src="character.user_profile_image_url"
                      />
                      <v-icon
                        v-if="character.user_profile_image_url == ''"
                        size="32"
                        color="primary"
                      >
                        mdi-account-circle
                      </v-icon>
                    </v-avatar>
                  </router-link>
                </v-col>
                <v-col class="my-auto">
                  <h4>
                    Created
                    {{ character.start_time | FromNowFilter }}
                    <template v-if="character.d2_version">
                      with version {{ character.d2_version }}
                      <span class="secondary--text text--lighten-3">{{
                        character.d2_args
                      }}</span>
                    </template>
                  </h4>
                </v-col>
                <v-col v-if="character.in_game_time" cols="auto my-auto">
                  <h4>
                    Playtime:
                    <span class="monospace">{{
                      character.in_game_time | DurationFilter
                    }}</span>
                  </h4>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import {
  DurationFilter,
  FromNowFilter,
  DifficultyFilter,
  AreaNameFilter,
  HeroNameFilter,
  BigNumberFilter
} from '@/filters';
import Icon from '@/components/Icon.vue';
import CharacterItem from '@/components/CharacterItem.vue';
import TwitchEmbed from '@/components/TwitchEmbed.vue';
import VerticalProgress from '@/components/VerticalProgress.vue';
import { levelExperience } from '@diablorun/diablorun-data';

export default {
  name: 'Character',
  filters: {
    FromNowFilter,
    DurationFilter,
    DifficultyFilter,
    AreaNameFilter,
    HeroNameFilter,
    BigNumberFilter
  },
  components: {
    Icon,
    CharacterItem,
    TwitchEmbed,
    VerticalProgress
  },
  data() {
    return {
      showTwitchEmbed: false,
      tab: 0,
      user: null,
      username: '',
      characterId: '',

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
        { value: 'fcr', title: 'Faster Cast Speed', icon: 'mdi-auto-fix' },
        {
          value: 'fhr',
          title: 'Faster Hit recovery',
          icon: 'mdi-human-handsdown'
        },
        {
          value: 'frw',
          title: 'Faster Run/Walk speed',
          icon: 'mdi-shoe-print'
        },
        {
          value: 'ias',
          title: 'Faster Attack Speed',
          icon: 'mdi-sword-cross'
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
      snapshot(state) {
        const id =
          this.characterId || state.characters.latestIds[this.username];
        return state.characters.snapshots[id];
      },
      streamOverlay: state => state.app.windowStyle === 'overlay'
    }),
    character() {
      return this.snapshot?.character;
    },
    characterItems() {
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

      return slots.map(slot => ({
        slot,
        item: this.snapshot.items.find(
          item => item.container === 'character' && item.slot === slot
        )
      }));
    },
    hirelingItems() {
      const slots = ['primary_left', 'head', 'body_armor', 'primary_right'];

      return slots.map(slot => ({
        slot,
        item: this.snapshot.items.find(
          item => item.container === 'hireling' && item.slot === slot
        )
      }));
    },
    hirelingExtraItems() {
      const slots = ['gloves', 'belt', 'boots'];

      return slots.map(slot => ({
        slot,
        item: this.snapshot.items.find(
          item => item.container === 'hireling' && item.slot === slot
        )
      }));
    },
    inventoryItems() {
      return this.snapshot.items.filter(item => item.container === 'inventory');
    },
    stashItems() {
      return this.snapshot.items.filter(item => item.container === 'stash');
    },
    cubeItems() {
      return this.snapshot.items.filter(item => item.container === 'cube');
    },
    maxExperience: () => levelExperience[this.character.level],
    experiencePercentage() {
      const prev = levelExperience[this.character.level - 1];
      const next = levelExperience[this.character.level];

      const p = ((this.character.experience - prev) / (next - prev)) * 100;
      return Math.round(p * 100) / 100;
    },
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
        this.characterId = character_slug
          ? character_slug.replace(/^[^0-9]+/i, '')
          : '';

        if (this.characterId) {
          await this.$store.dispatch(
            'characters/fetchCharacter',
            this.characterId
          );
        } else {
          await this.$store.dispatch(
            'characters/fetchLatestCharacter',
            this.username
          );
        }

        this.$store.dispatch('characters/subscribeToUser', this.username);
      }
    }
  },
  methods: {
    toggleTwitchEmbed() {
      this.showTwitchEmbed = !this.showTwitchEmbed;
    }
  },
  destroyed() {
    this.$store.dispatch('characters/unsubscribeFromUser', this.username);
  }
};
</script>
