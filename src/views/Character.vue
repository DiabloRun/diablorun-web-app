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
        <v-col cols="12" md="4">
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
                <h5 v-if="character.hc" class="pa-3">
                  <v-icon left color="error"> mdi-skull-outline </v-icon>
                  Hardcore
                </h5>
                <h5 v-if="!character.hc" class="pa-3">
                  {{ character.deaths }} Deaths
                </h5>
                <v-divider></v-divider>
                <v-list dense class="py-0">
                  <v-list-item
                    v-for="attribute in attributes"
                    :key="attribute.title"
                    class="px-3"
                  >
                    <v-icon left> {{ attribute.icon }} </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character[attribute.stat] }} {{ attribute.short }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <!-- Gold, resistances -->
            <v-col>
              <v-card>
                <h5 class="pa-3">{{ character.gold_total }} Gold</h5>
                <v-divider></v-divider>
                <v-list dense class="py-0">
                  <v-list-item
                    v-for="resistance in resistances"
                    :key="resistance.title"
                    class="px-3"
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
                        {{ character[resistance.stat] }}% {{ resistance.title }}
                      </v-list-item-title>
                      <v-list-item-title v-if="character[resistance.stat] < 0">
                        <span class="error--text">
                          {{ character[resistance.stat] }}%
                        </span>
                        {{ resistance.title }}
                      </v-list-item-title>
                      <v-list-item-title
                        v-if="character[resistance.stat] >= 75"
                      >
                        <span class="orange--text text--lighten-2">
                          {{ character[resistance.stat] }}%
                        </span>
                        {{ resistance.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <!-- Magic find, speed stats -->
            <v-col>
              <v-card>
                <h5 class="pa-3">{{ character.mf }}% Magic find</h5>
                <v-divider></v-divider>
                <v-list dense class="py-0">
                  <v-list-item
                    v-for="speedStat in speedStats"
                    :key="speedStat.title"
                    class="px-3"
                  >
                    <v-icon left>
                      {{ speedStat.icon }}
                    </v-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ character[speedStat.stat] }}% {{ speedStat.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <!-- Hireling, mercenary -->
            <v-col cols="12" v-if="character.hireling_name">
              <v-card>
                <v-row no-gutters>
                  <v-col cols="4">
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
                        <v-icon left> {{ hirelingAttribute.icon }} </v-icon>
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
                            {{ hirelingResistance.title }}
                          </v-list-item-title>
                          <v-list-item-title
                            v-if="character[hirelingResistance.stat] < 0"
                          >
                            <span class="error--text">
                              {{ character[hirelingResistance.stat] }}%
                            </span>
                            {{ hirelingResistance.title }}
                          </v-list-item-title>
                          <v-list-item-title
                            v-if="character[hirelingResistance.stat] >= 75"
                          >
                            <span class="orange--text text--lighten-2">
                              {{ character[hirelingResistance.stat] }}%
                            </span>
                            {{ hirelingResistance.title }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
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
        <v-col cols="12" md="8">
          <v-card>
            <v-row no-gutters>
              <v-col>
                <v-tabs
                  v-model="tab"
                  background-color="transparent"
                  color="grey lighten-2"
                >
                  <v-tab>Items</v-tab>
                  <v-tab v-if="character.hireling_name">Merc</v-tab>
                </v-tabs>
              </v-col>
              <v-col cols="auto" class="my-auto mr-3 grey--text">
                <h5>{{ character.town_visits }} Town visits</h5>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-tabs-items v-model="tab">
              <v-tab-item class="pt-2 px-1">
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
                            empty right ring
                          </h5>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item class="pt-2 px-1">
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
                    class="pb-2 px-1"
                  >
                    <v-card class="fill-height d-flex align-center">
                      <v-row no-gutters>
                        <v-col>
                          <h5
                            class="grey--text text-center py-3 body-2 font-italic"
                          >
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
      speedStats: [
        { stat: 'fcr', title: 'Cast speed', icon: 'mdi-auto-fix' },
        { stat: 'fhr', title: 'Hit recovery', icon: 'mdi-human-handsdown' },
        { stat: 'frw', title: 'Run speed', icon: 'mdi-shoe-print' },
        { stat: 'ias', title: 'Attack speed', icon: 'mdi-sword-cross' }
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
