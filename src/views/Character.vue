<template>
  <div>
    <v-btn fixed right bottom fab small @click="toggleTwitchEmbed()">
      <v-icon v-if="!showTwitchEmbed"> mdi-twitch </v-icon>
      <v-icon v-if="showTwitchEmbed"> mdi-close </v-icon>
    </v-btn>
    <v-container v-if="!streamOverlay && character.name" fluid class="pa-2">
      <v-row v-if="showTwitchEmbed">
        <v-col>
          <TwitchEmbed :username="character.user_name" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="4" lg="3">
          <v-row dense>
            <v-col cols="12">
              <!-- Character and user name -->
              <v-card>
                <v-card-title>
                  {{ character.hero | HeroNameFilter }}
                  {{ character.name }}
                </v-card-title>
                <v-card-subtitle>
                  Added {{ character.start_time | FromNowFilter }} by
                  <router-link
                    :to="{
                      name: 'User',
                      params: { user_name: character.user_name }
                    }"
                  >
                    {{ character.user_name }}
                  </router-link>
                </v-card-subtitle>
                <v-divider></v-divider>
                <v-row no-gutters class="px-2 pt-2">
                  <v-col class="pr-4 grey--text">
                    <h5 class="text-right">
                      {{ character.difficulty | DifficultyFilter }}
                    </h5>
                  </v-col>
                  <v-col cols="auto">
                    <h5>{{ character.area | AreaNameFilter }}</h5>
                  </v-col>
                  <v-col class="pl-4 grey--text">
                    <h5>Players {{ character.players }}</h5>
                  </v-col>
                </v-row>
                <!-- Globes -->
                <v-row no-gutters class="py-2">
                  <!-- Life -->
                  <v-col align="right">
                    <v-progress-circular
                      v-if="!character.dead"
                      :rotate="90"
                      :size="64"
                      :value="(character.life / character.life_max) * 100"
                      color="error"
                    >
                      <span class="white--text">{{ character.life }}</span>
                    </v-progress-circular>
                    <v-progress-circular
                      v-if="character.dead"
                      :rotate="90"
                      :size="64"
                      :value="0"
                      color="error"
                    >
                      <v-icon color="error"> mdi-skull-crossbones </v-icon>
                    </v-progress-circular>
                  </v-col>
                  <!-- Character avatar -->
                  <v-col cols="auto" align="center" class="mx-4">
                    <router-link
                      :to="{
                        name: 'Character',
                        params: {
                          user_name: character.user_name,
                          character_slug: character.name + character.id
                        }
                      }"
                    >
                      <v-avatar size="64" rounded>
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
                      color="info"
                    >
                      <span class="white--text">{{ character.mana }}</span>
                    </v-progress-circular>
                  </v-col>
                </v-row>
                <!-- Level -->
                <v-row no-gutters class="px-2 pb-2">
                  <v-col class="text-right pr-2">
                    <h5>Level {{ character.level }}</h5>
                  </v-col>
                  <v-col class="pl-2">
                    <h5 class="grey--text">12.23%</h5>
                  </v-col>
                </v-row>
                <!-- Experience bar -->
                <v-progress-linear
                  :value="(character.life / character.life_max) * 100"
                  absolute
                  bottom
                  height="3"
                  color="grey lighten-1"
                ></v-progress-linear>
              </v-card>
            </v-col>
            <!-- Attributes, deaths or hardcore -->
            <v-col>
              <v-card>
                <h5 v-if="character.hc" class="py-2 text-center">
                  <v-icon left color="error"> mdi-skull-outline </v-icon>
                  Hardcore
                </h5>
                <h5 v-if="!character.hc" class="py-2 text-center">
                  {{ character.deaths }} Deaths
                </h5>
                <v-divider></v-divider>
                <v-list dense class="py-0">
                  <v-list-item
                    v-for="attribute in attributes"
                    :key="attribute.title"
                    class="px-2"
                  >
                    <v-icon left> {{ attribute.icon }} </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character[attribute.stat] }}
                        <span class="grey--text">{{ attribute.short }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <!-- Gold, resistances -->
            <v-col>
              <v-card>
                <h5 class="text-center py-2">
                  {{ character.gold_total }} Gold
                </h5>
                <v-divider></v-divider>
                <v-list dense class="py-0">
                  <v-list-item
                    v-for="resistance in resistances"
                    :key="resistance.title"
                    class="px-2"
                  >
                    <v-icon left :color="resistance.color">
                      {{ resistance.icon }}
                    </v-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        v-if="
                          character[resistance.stat] >= 0 &&
                            character[resistance.stat] < 75
                        "
                      >
                        {{ character[resistance.stat] }}%
                      </v-list-item-title>
                      <v-list-item-title
                        v-if="character[resistance.stat] < 0"
                        class="error--text"
                      >
                        {{ character[resistance.stat] }}%
                      </v-list-item-title>
                      <v-list-item-title
                        v-if="character[resistance.stat] >= 75"
                        class="orange--text text--lighten-2"
                      >
                        {{ character[resistance.stat] }}%
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <!-- Magic find, speed stats -->
            <v-col>
              <v-card>
                <h5 class="text-center py-2">{{ character.mf }}% Magic find</h5>
                <v-divider></v-divider>
                <v-list dense class="py-0">
                  <v-list-item
                    v-for="stat in stats"
                    :key="stat.title"
                    class="px-2"
                  >
                    <v-icon left>
                      {{ stat.icon }}
                    </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character[stat.value] }}%
                        <span class="grey--text">{{ stat.title }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <!-- Hireling -->
            <v-col v-if="character.hireling_name">
              <v-card>
                <v-row no-gutters>
                  <v-col>
                    <v-list dense class="py-0">
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
                    <v-list dense class="py-0">
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
                            {{ character[hirelingResistance.stat] }}%
                          </v-list-item-title>
                          <v-list-item-title
                            v-if="character[hirelingResistance.stat] < 0"
                          >
                            <span class="error--text">
                              {{ character[hirelingResistance.stat] }}%
                            </span>
                          </v-list-item-title>
                          <v-list-item-title
                            v-if="character[hirelingResistance.stat] >= 75"
                          >
                            <span class="orange--text text--lighten-2">
                              {{ character[hirelingResistance.stat] }}%
                            </span>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
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
        <!-- Right side columns -->
        <v-col cols="12" md="8" lg="9">
          <v-card>
            <v-row no-gutters>
              <!-- Tabs -->
              <v-col>
                <v-tabs v-model="tab" color="grey lighten-1">
                  <v-tab>Items</v-tab>
                  <v-tab v-if="character.hireling_name">Merc</v-tab>
                </v-tabs>
              </v-col>
              <!-- Extra info -->
              <v-col cols="auto" class="my-auto mr-3 grey--text">
                <h5>{{ character.town_visits }} Town visits</h5>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Items tab -->
            <v-tabs-items v-model="tab">
              <v-tab-item class="pa-2">
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
                      class="fill-height d-flex align-center pa-2"
                    >
                      <v-flex>
                        <p
                          class="text-center grey--text text--darken-2 body-2 font-italic"
                        >
                          empty
                        </p>
                      </v-flex>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <!-- Merc/Hireling tab -->
              <v-tab-item class="pa-2">
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
                      class="fill-height d-flex align-center pa-2"
                    >
                      <v-flex>
                        <p
                          class="text-center grey--text text--darken-2 body-2 font-italic"
                        >
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
                      class="fill-height d-flex align-center pa-2"
                    >
                      <v-flex>
                        <p
                          class="text-center grey--text text--darken-2 body-2 font-italic"
                        >
                          empty
                        </p>
                      </v-flex>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
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
        { stat: 'strength', short: 'Str', icon: 'mdi-arm-flex' },
        { stat: 'dexterity', short: 'Dex', icon: 'mdi-bullseye-arrow' },
        { stat: 'vitality', short: 'Vit', icon: 'mdi-heart' },
        { stat: 'energy', short: 'Ene', icon: 'mdi-bottle-tonic' }
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
        { value: 'fcr', title: 'FCR', icon: 'mdi-auto-fix' },
        { value: 'fhr', title: 'FHR', icon: 'mdi-human-handsdown' },
        { value: 'frw', title: 'FRW', icon: 'mdi-shoe-print' },
        { value: 'ias', title: 'IAS', icon: 'mdi-sword-cross' }
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
