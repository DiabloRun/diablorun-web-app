<template>
  <div>
    <section v-if="showTwitchEmbed" class="section is-paddingless">
      <div class="container is-fluid is-paddingless">
        <TwitchEmbed :username="character.user_name" />
      </div>
    </section>
    <v-card
      class="d-flex align-content-space-between flex-wrap"
      color="grey lighten-2"
      flat
      tile
      min-height="300"
    >
      <v-card-text>hey</v-card-text>
      <v-card-text>hey</v-card-text>
      <v-card-text>hey</v-card-text>
    </v-card>
    <v-container class="py-6">
      <v-row>
        <v-col cols="12" lg="4">
          <v-card height="300" class="d-flex align-content-space-between">
            <v-row class="d-flex align-content-space-between">
              <v-col cols="12">
                <v-card-text>hey</v-card-text>
              </v-col>
              <v-col cols="12">
                <v-card-text>
                  <v-row>
                    <v-col cols="auto">
                      <v-progress-circular
                        v-if="!character.dead"
                        :rotate="90"
                        :size="64"
                        :width="3"
                        :value="(character.life / character.life_max) * 100"
                        color="red darken-3"
                      >
                        <span class="white--text">{{ character.life }}</span>
                      </v-progress-circular>
                      <v-progress-circular
                        v-if="character.dead"
                        :rotate="90"
                        :size="64"
                        :width="3"
                        :value="0"
                        color="red darken-3"
                      >
                        <v-icon color="red"> mdi-skull-crossbones </v-icon>
                      </v-progress-circular>
                    </v-col>
                    <v-col cols="auto">
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
                          color="primary darken-2"
                          :content="character.level"
                          overlap
                        >
                          <v-avatar size="64">
                            <Icon :name="`big-${character.hero}`" />
                          </v-avatar>
                        </v-badge>
                      </router-link>
                    </v-col>
                    <v-col cols="auto">
                      <v-progress-circular
                        :rotate="90"
                        :size="64"
                        :width="3"
                        :value="(character.mana / character.mana_max) * 100"
                        color="blue darken-3"
                      >
                        <span class="white--text">{{ character.mana }}</span>
                      </v-progress-circular>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
              <v-col cols="12">
                <v-card-text>hey</v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-card class="pa-3">
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="auto">
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
                    color="primary darken-2"
                    :content="character.level"
                    overlap
                  >
                    <v-avatar size="64">
                      <Icon :name="`big-${character.hero}`" />
                    </v-avatar>
                  </v-badge>
                </router-link>
              </v-col>
              <v-col cols="auto">
                <v-progress-circular
                  v-if="!character.dead"
                  :rotate="90"
                  :size="64"
                  :width="3"
                  :value="(character.life / character.life_max) * 100"
                  color="red darken-3"
                >
                  <span class="white--text">{{ character.life }}</span>
                </v-progress-circular>
                <v-progress-circular
                  v-if="character.dead"
                  :rotate="90"
                  :size="64"
                  :width="3"
                  :value="0"
                  color="red darken-3"
                >
                  <v-icon color="red"> mdi-skull-crossbones </v-icon>
                </v-progress-circular>
              </v-col>
              <v-col cols="auto">
                <v-progress-circular
                  :rotate="90"
                  :size="64"
                  :width="3"
                  :value="(character.mana / character.mana_max) * 100"
                  color="blue darken-3"
                >
                  <span class="white--text">{{ character.mana }}</span>
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col>
                <v-chip class="mr-1" label>
                  <v-icon small left> mdi-arm-flex </v-icon>
                  {{ character.strength }}
                </v-chip>
                <v-chip class="mr-1" label>
                  <v-icon small left> mdi-bullseye-arrow </v-icon>
                  {{ character.dexterity }}
                </v-chip>
                <v-chip class="mr-1" label>
                  <v-icon small left> mdi-heart </v-icon>
                  {{ character.vitality }}
                </v-chip>
                <v-chip label>
                  <v-icon small left> mdi-bottle-tonic </v-icon>
                  {{ character.energy }}
                </v-chip>
              </v-col>
              <v-col cols="auto">
                <v-chip v-if="character.hc" color="red darken-3" label>
                  <v-icon v-if="!character.dead" small left> mdi-skull </v-icon>
                  <v-icon v-if="character.dead" small left>
                    mdi-skull-crossbones
                  </v-icon>
                  Hardcore
                </v-chip>
                <v-chip v-if="!character.hc" label>
                  <v-icon small left> mdi-skull-outline </v-icon>
                  {{ character.deaths }}
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-row>
              <v-col>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      color="red darken-3"
                      class="mr-1"
                      label
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon small left> mdi-fire </v-icon>
                      {{ character.fire_res }}
                    </v-chip>
                  </template>
                  <span>Fire resistance</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      color="blue  darken-3"
                      class="mr-1"
                      label
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon small left> mdi-snowflake </v-icon>
                      {{ character.cold_res }}
                    </v-chip>
                  </template>
                  <span>Cold resistance</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      color="yellow darken-3"
                      class="mr-1"
                      label
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon small left> mdi-lightning-bolt </v-icon>
                      {{ character.light_res }}
                    </v-chip>
                  </template>
                  <span>Lightning resistance</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      color="green darken-3"
                      label
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon small left> mdi-bottle-tonic-skull </v-icon>
                      {{ character.poison_res }}
                    </v-chip>
                  </template>
                  <span>Poison resistance</span>
                </v-tooltip>
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
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- General character stats -->
    <section class="section pb-0" v-if="!streamOverlay">
      <div class="container">
        <div class="columns is-multiline">
          <!-- Location -->
          <div class="column pb-1">
            <div class="field is-grouped is-grouped-multiline">
              <!-- Area -->
              <div class="control">
                <div class="tags has-addons">
                  <span v-if="character.lod == 'false'" class="tag is-dark">
                    Classic
                  </span>
                  <span class="tag is-dark">
                    {{ character.difficulty | DifficultyFilter }}
                  </span>
                  <span class="tag is-light">
                    {{ character.area | AreaNameFilter }}
                  </span>
                </div>
              </div>
              <!-- Players -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Players set to</span>
                    <span class="is-hidden-desktop">P</span>
                  </span>
                  <span class="tag is-light">{{ character.players }}</span>
                </div>
              </div>
              <!-- Town visits -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Town visits</span>
                    <span class="is-hidden-desktop">Towns</span>
                  </span>
                  <span class="tag is-light">{{ character.town_visits }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Gold -->
          <div class="column pb-1 is-narrow">
            <div class="field is-grouped is-grouped-multiline">
              <!-- Gold -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Gold</span>
                  <span class="tag is-light">{{ character.gold_total }}</span>
                </div>
              </div>
              <!-- Magic find -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Magic find</span>
                    <span class="is-hidden-desktop">MF</span>
                  </span>
                  <span class="tag is-light">{{ character.mf }}%</span>
                </div>
              </div>
              <!-- Playtime -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Playtime</span>
                  <span class="tag is-light">
                    {{ character.seconds_played | DurationFilter }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-multiline">
          <!-- Level -->
          <div class="column pb-1">
            <div class="field is-grouped is-grouped-multiline">
              <!-- Level -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Level</span>
                    <span class="is-hidden-desktop">LVL</span>
                  </span>
                  <span class="tag is-primary">{{ character.level }}</span>
                </div>
              </div>
              <!-- Experience -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Experience</span>
                    <span class="is-hidden-desktop">XP</span>
                  </span>
                  <span class="tag is-light">{{ character.experience }}</span>
                </div>
              </div>
              <!-- Deaths -->
              <div v-if="!character.hc" class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Deaths</span>
                  <span class="tag is-light">{{ character.deaths }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Resistances -->
          <div class="column pb-1 is-narrow">
            <div class="field is-grouped is-grouped-multiline">
              <!-- Fire -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Fire</span>
                  <span class="tag is-danger">{{ character.fire_res }}</span>
                </div>
              </div>
              <!-- Cold -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Cold</span>
                  <span class="tag is-info">{{ character.cold_res }}</span>
                </div>
              </div>
              <!-- Light -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Lightning</span>
                    <span class="is-hidden-desktop">Light</span>
                  </span>
                  <span class="tag is-warning">{{ character.light_res }}</span>
                </div>
              </div>
              <!-- Poison -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Poison</span>
                    <span class="is-hidden-desktop">Psn</span>
                  </span>
                  <span class="tag is-success">{{ character.poison_res }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <!-- Speed -->
          <div class="column pb-1">
            <div class="field is-grouped is-grouped-multiline">
              <!-- FCR -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Cast speed</span>
                    <span class="is-hidden-desktop">FCR</span>
                  </span>
                  <span class="tag is-light">{{ character.fcr }}</span>
                </div>
              </div>
              <!-- FHR -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Hit recovery</span>
                    <span class="is-hidden-desktop">FHR</span>
                  </span>
                  <span class="tag is-light">{{ character.fhr }}</span>
                </div>
              </div>
              <!-- FRW -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Run speed</span>
                    <span class="is-hidden-desktop">FRW</span>
                  </span>
                  <span class="tag is-light">{{ character.frw }}</span>
                </div>
              </div>
              <!-- IAS -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Attack speed</span>
                    <span class="is-hidden-desktop">IAS</span>
                  </span>
                  <span class="tag is-light">{{ character.ias }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Attributes -->
          <div class="column is-narrow">
            <div class="field is-grouped is-grouped-multiline">
              <!-- Strength -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Strength</span>
                    <span class="is-hidden-desktop">STR</span>
                  </span>
                  <span class="tag is-light">{{ character.strength }}</span>
                </div>
              </div>
              <!-- Dexterity -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Dexterity</span>
                    <span class="is-hidden-desktop">DEX</span>
                  </span>
                  <span class="tag is-light">{{ character.dexterity }}</span>
                </div>
              </div>
              <!-- Vitality -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Vitality</span>
                    <span class="is-hidden-desktop">VIT</span>
                  </span>
                  <span class="tag is-light">{{ character.vitality }}</span>
                </div>
              </div>
              <!-- Energy -->
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">
                    <span class="is-hidden-touch">Energy</span>
                    <span class="is-hidden-desktop">ENE</span>
                  </span>
                  <span class="tag is-light">{{ character.energy }}</span>
                </div>
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
                  class="card has-no-border-radius"
                >
                  <div class="card-content equipment">
                    <p class="has-text-grey">Primary left</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem v-if="character.head" :item="character.head" />
                <div v-if="!character.head" class="card has-no-border-radius">
                  <div class="card-content equipment">
                    <p class="has-text-grey">Helm</p>
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
                  class="card has-no-border-radius"
                >
                  <div class="card-content equipment">
                    <p class="has-text-grey">Primary right</p>
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
                  class="card has-no-border-radius"
                >
                  <div class="card-content equipment">
                    <p class="has-text-grey">Secondary left</p>
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
                  class="card has-no-border-radius"
                >
                  <div class="card-content equipment">
                    <p class="has-text-grey">Armor</p>
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
                  class="card has-no-border-radius"
                >
                  <div class="card-content equipment">
                    <p class="has-text-grey">Secondary right</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.gloves"
                  :item="character.gloves"
                />
                <div v-if="!character.gloves" class="card has-no-border-radius">
                  <div class="card-content equipment">
                    <p class="has-text-grey">Gloves</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem v-if="character.belt" :item="character.belt" />
                <div v-if="!character.belt" class="card has-no-border-radius">
                  <div class="card-content equipment">
                    <p class="has-text-grey">Belt</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem v-if="character.boots" :item="character.boots" />
                <div v-if="!character.boots" class="card has-no-border-radius">
                  <div class="card-content equipment">
                    <p class="has-text-grey">Boots</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.ring_left"
                  :item="character.ring_left"
                />
                <div
                  v-if="!character.ring_left"
                  class="card has-no-border-radius"
                >
                  <div class="card-content equipment">
                    <p class="has-text-grey">Left ring</p>
                  </div>
                </div>
              </div>
              <div class="column is-4-widescreen is-6-tablet">
                <CharacterItem
                  v-if="character.amulet"
                  :item="character.amulet"
                />
                <div v-if="!character.amulet" class="card has-no-border-radius">
                  <div class="card-content equipment">
                    <p class="has-text-grey">Amulet</p>
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
                  class="card has-no-border-radius"
                >
                  <div class="card-content equipment">
                    <p class="has-text-grey">Right ring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Mercenary -->
    <section class="section" v-if="character.hireling_name && !streamOverlay">
      <div class="container">
        <div class="columns is-mobile is-vcentered is-multiline">
          <div class="column is-narrow py-0 pr-0">
            <figure class="image is-48x48">
              <Icon
                :name="`${character.hireling_class}`"
                class="has-glow is-rounded"
              />
            </figure>
          </div>
          <div class="column is-10-mobile has-text-left">
            <p class="subtitle">
              Level {{ character.hireling_level }}
              {{ character.hireling_name }}
            </p>
          </div>
          <div class="column is-narrow">
            <p class="subtitle is-6">
              {{ character.hireling_strength }}
              <span class="has-text-grey">Strength</span>
            </p>
          </div>
          <div class="column is-narrow">
            <p class="subtitle is-6">
              {{ character.hireling_dexterity }}
              <span class="has-text-grey">Dexterity</span>
            </p>
          </div>
        </div>
        <div class="columns is-multiline is-gapless">
          <div class="column is-4-widescreen is-6-tablet">
            <CharacterItem
              v-if="character.hireling_primary_left"
              :item="character.hireling_primary_left"
            />
            <div
              v-if="!character.hireling_primary_left"
              class="card has-no-border-radius"
            >
              <div class="card-content equipment">
                <p class="has-text-grey">Primary left</p>
              </div>
            </div>
          </div>
          <div class="column is-4-widescreen is-6-tablet">
            <CharacterItem
              v-if="character.hireling_head"
              :item="character.hireling_head"
            />
            <div
              v-if="!character.hireling_head"
              class="card has-no-border-radius"
            >
              <div class="card-content equipment">
                <p class="has-text-grey">Head</p>
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
              class="card has-no-border-radius"
            >
              <div class="card-content equipment">
                <p class="has-text-grey">Armor</p>
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
