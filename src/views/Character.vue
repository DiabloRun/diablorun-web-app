<template>
  <div>
    <v-btn class="mt-3" fixed right fab small @click="toggleTwitchEmbed()">
      <v-icon v-if="!showTwitchEmbed"> mdi-twitch </v-icon>
      <v-icon v-if="showTwitchEmbed"> mdi-close </v-icon>
    </v-btn>
    <v-container v-if="!streamOverlay && character.name" fluid class="pa-6">
      <v-row v-if="showTwitchEmbed">
        <v-col>
          <TwitchEmbed :username="character.user_name" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="py-2">
              <router-link
                :to="{
                  name: 'User',
                  params: { user_name: character.user_name }
                }"
              >
                <v-avatar size="48">
                  <v-img :src="character.user_profile_image_url">
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          size="18"
                          width="2"
                          color="primary"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-avatar>
              </router-link>
              <h6 class="pl-3">
                <router-link
                  :to="{
                    name: 'Character',
                    params: {
                      user_name: character.user_name,
                      character_slug: character.name + character.id
                    }
                  }"
                >
                  {{ character.hero | HeroNameFilter }}
                  {{ character.name }}</router-link
                >
                added by
                <router-link
                  :to="{
                    name: 'User',
                    params: { user_name: character.user_name }
                  }"
                  >{{ character.user_name }}</router-link
                >
              </h6>
            </v-card-title>
            <v-divider></v-divider>
            <v-row no-gutters class="my-3">
              <v-col>
                <h5 class="text-center">
                  {{ character.difficulty | DifficultyFilter }} Difficulty
                  <span class="grey--text">
                    Players set to {{ character.players }}
                  </span>
                </h5>
              </v-col>
            </v-row>
            <v-row no-gutters>
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
                  <v-badge
                    bottom
                    color="grey darken-3"
                    :content="character.level"
                    overlap
                  >
                    <v-avatar size="64" rounded>
                      <Icon :name="`big-${character.hero}`" />
                    </v-avatar>
                  </v-badge>
                </router-link>
              </v-col>
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
            <v-row no-gutters class="my-3">
              <v-col>
                <h5 class="text-center">
                  {{ character.area | AreaNameFilter }}
                </h5>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters class="pa-3">
              <v-col>
                <v-chip v-if="character.hc" color="error" label>
                  <v-icon v-if="!character.dead" small left> mdi-skull </v-icon>
                  <v-icon v-if="character.dead" small left>
                    mdi-skull-crossbones
                  </v-icon>
                  Hardcore
                </v-chip>
                <v-chip v-if="!character.hc" label>
                  <v-icon small left> mdi-skull-outline </v-icon>
                  {{ character.deaths }} Deaths
                </v-chip>
              </v-col>
              <v-col cols="auto">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip label v-on="on" v-bind="attrs">
                      <v-icon color="yellow darken-1" small left>
                        mdi-gold
                      </v-icon>
                      {{ character.gold_total }}
                    </v-chip>
                  </template>
                  <span>Total gold</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card>
          <v-row class="pt-6">
            <v-col>
              <v-card>
                <v-card-title class="pl-4 py-1">
                  <h6>Level {{ character.level }}</h6>
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item>
                    <v-icon left> mdi-arm-flex </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.strength }} Str
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left> mdi-bullseye-arrow </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.dexterity }} Dex
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left> mdi-heart </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.vitality }} Vit
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left> mdi-bottle-tonic </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.energy }} Ene
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-card-title class="pl-4 py-1">
                  <h6>Resistances</h6>
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item>
                    <v-icon left color="error"> mdi-fire </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.fire_res }} Fire
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left color="info"> mdi-snowflake </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.cold_res }} Cold
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left color="warning"> mdi-lightning-bolt </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.light_res }} Lightning
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left color="success">
                      mdi-bottle-tonic-skull
                    </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.poison_res }} Poison
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-card-title class="pl-4 py-1">
                  <h6>{{ character.mf }}% Magic find</h6>
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item>
                    <v-icon left> mdi-auto-fix </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.fcr }} Cast speed
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left> mdi-human-handsdown </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.fhr }} Hit recovery
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left> mdi-shoe-print </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.frw }} Run speed
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-icon left> mdi-sword-cross </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character.ias }} Attack speed
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="pt-3" v-if="character.hireling_name">
            <v-col>
              <v-card>
                <v-card-title>
                  <v-avatar size="32">
                    <Icon :name="`${character.hireling_class}`" />
                  </v-avatar>
                  <h6 class="ml-3">
                    {{ character.hireling_name }}
                    <span class="grey--text"
                      >Level {{ character.hireling_level }}</span
                    >
                  </h6>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="white--text">
                  <v-row no-gutters>
                    <v-col>
                      <v-icon left color="error"> mdi-fire </v-icon
                      >{{ character.hireling_fire_res }}
                    </v-col>
                    <v-col>
                      <v-icon left color="info"> mdi-snowflake </v-icon>
                      {{ character.hireling_cold_res }}
                    </v-col>
                    <v-col>
                      <v-icon left color="warning"> mdi-lightning-bolt </v-icon
                      >{{ character.hireling_light_res }}
                    </v-col>
                    <v-col>
                      <v-icon left color="success">
                        mdi-bottle-tonic-skull
                      </v-icon>
                      {{ character.hireling_poison_res }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-4">
                    <v-col cols="12" sm="3">
                      <v-icon left> mdi-arm-flex </v-icon
                      >{{ character.hireling_strength }} Str
                    </v-col>
                    <v-col>
                      <v-icon left> mdi-bullseye-arrow </v-icon>
                      {{ character.hireling_dexterity }} Dex
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-text-field
            outlined
            prepend-inner-icon="mdi-share"
            :value="
              'https://diablo.run/' +
                character.user_name +
                '/' +
                character.name +
                character.id
            "
            :label="'Share ' + character.name"
            readonly
            class="mt-6"
          ></v-text-field>
          <v-text-field
            v-if="isEditor"
            outlined
            prepend-inner-icon="mdi-account-lock"
            :value="character.seed"
            :label="character.name + ' map seed'"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="8">
          <v-card>
            <v-tabs
              v-model="tab"
              background-color="transparent"
              color="grey lighten-2"
              centered
            >
              <v-tab>Items</v-tab>
              <v-tab>Mercenary</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item class="pt-4 px-2">
                <v-row no-gutters>
                  <CharacterItem
                    v-if="character.primary_left"
                    :item="character.primary_left"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.primary_left"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty primary left
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem v-if="character.head" :item="character.head" />
                  <!--Empty-->
                  <v-col
                    v-if="!character.head"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty helm
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.primary_right"
                    :item="character.primary_right"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.primary_right"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty primary right
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.secondary_left"
                    :item="character.secondary_left"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.secondary_left"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty secondary left
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.body_armor"
                    :item="character.body_armor"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.body_armor"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty armor
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.secondary_right"
                    :item="character.secondary_right"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.secondary_right"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty secondary right
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.gloves"
                    :item="character.gloves"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.gloves"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty gloves
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem v-if="character.belt" :item="character.belt" />
                  <!--Empty-->
                  <v-col
                    v-if="!character.belt"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty belt
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.boots"
                    :item="character.boots"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.boots"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty boots
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.ring_left"
                    :item="character.ring_left"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.ring_left"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty left ring
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.amulet"
                    :item="character.amulet"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.amulet"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty amulet
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.ring_right"
                    :item="character.ring_right"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.ring_right"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty right ring
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item class="pt-4 px-2">
                <v-row no-gutters>
                  <CharacterItem
                    v-if="character.hireling_primary_left"
                    :item="character.hireling_primary_left"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.hireling_primary_left"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty hireling primary left
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.hireling_head"
                    :item="character.hireling_head"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.hireling_head"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty hireling helm
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.hireling_body_armor"
                    :item="character.hireling_body_armor"
                  />
                  <!--Empty-->
                  <v-col
                    v-if="!character.hireling_body_armor"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-4 px-2"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5 class="text--secondary text-center py-3">
                            empty hireling armor
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <CharacterItem
                    v-if="character.hireling_primary_right"
                    :item="character.hireling_primary_right"
                  />
                  <CharacterItem
                    v-if="character.hireling_gloves"
                    :item="character.hireling_gloves"
                  />
                  <CharacterItem
                    v-if="character.hireling_belt"
                    :item="character.hireling_belt"
                  />
                  <CharacterItem
                    v-if="character.hireling_boots"
                    :item="character.hireling_boots"
                  />
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- #overlay for streaming -->
    <section class="section is-paddingless is-overlay" v-if="streamOverlay">
      <!-- First row -->
      <div class="columns mb-3 is-gapless is-mobile is-multiline">
        <div class="column">
          <div class="field is-grouped is-grouped-multiline">
            <!-- Level -->
            <div class="control">
              <div class="tags are-large has-addons">
                <span class="tag is-dark">{{ character.name }}</span>
                <span class="tag is-light">Level {{ character.level }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="field is-grouped is-grouped-multiline">
            <!-- Core -->
            <div class="control">
              <div v-if="character.hc" class="tags are-large">
                <span class="tag is-danger">HC</span>
              </div>
              <div v-if="!character.hc" class="tags are-large">
                <span class="tag is-light">SC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Second row -->
      <div class="columns mb-3 is-gapless is-mobile is-multiline">
        <div class="column">
          <div class="field is-grouped is-grouped-multiline">
            <!-- MF -->
            <div class="control">
              <div class="tags are-large has-addons">
                <span class="tag is-dark">MF</span>
                <span class="tag is-light">{{ character.mf }}</span>
              </div>
            </div>
            <!-- Gold -->
            <div class="control">
              <div class="tags are-large has-addons">
                <span class="tag is-dark">Gold</span>
                <span class="tag is-light">{{ character.gold_total }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="field is-grouped is-grouped-multiline">
            <!-- Players -->
            <div class="control">
              <div class="tags are-large has-addons">
                <span class="tag is-dark">Players</span>
                <span class="tag is-light">{{ character.players }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Third row -->
      <div class="columns is-gapless is-mobile is-multiline">
        <div class="column">
          <div class="field is-grouped is-grouped-multiline">
            <!-- Resistances -->
            <div class="control">
              <div class="tags are-large has-addons">
                <span class="tag is-danger">{{ character.fire_res }}</span>
                <span class="tag is-primary">{{ character.cold_res }}</span>
                <span class="tag is-warning">{{ character.light_res }}</span>
                <span class="tag is-success">{{ character.poison_res }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="field is-grouped is-grouped-multiline">
            <!-- FCR -->
            <div class="control">
              <div class="tags are-large has-addons">
                <span class="tag is-light">{{ character.fcr }} FCR</span>
              </div>
            </div>
            <!-- FRW -->
            <div class="control">
              <div class="tags are-large has-addons">
                <span class="tag is-light">{{ character.frw }} FRW</span>
              </div>
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
      showTwitchEmbed: false,
      tab: 0,
      user: null,
      username: ''
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
