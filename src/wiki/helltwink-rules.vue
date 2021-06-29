<template>
  <v-container>
    <v-row dense>
      <!-- Title -->
      <v-col cols="12">
        <v-row>
          <v-col>
            <h1>Hell Twink category rules</h1>
          </v-col>
          <v-col cols="auto" class="my-auto">
            <!--
            <v-btn>
              <v-icon small left :to="{ name: 'Leaderoard' }"
                >mdi-arrow-left</v-icon
              >
              Back to leaderboard
            </v-btn>
            -->
          </v-col>
        </v-row>
        <v-card>
          <v-card-title>
            Timer
          </v-card-title>
          <v-card-text>
            <ul>
              <li>
                Timer starts right after your character loads into the game.
              </li>
              <li>
                Time is measured in Real Time and In-game Time.
              </li>
            </ul>
          </v-card-text>
          <v-card-text>
            <strong>Timer stops when following conditions are met:</strong>
            <ul>
              <li>
                All quests in normal, nightmare and hell difficulty.
              </li>
              <li>
                Killed Cow King in normal, nightmare and hell difficulty.
              </li>
              <li>
                Reach level 80.
              </li>
            </ul>
          </v-card-text>
          <v-divider> </v-divider>
          <v-card-title>
            Players setting
          </v-card-title>
          <v-card-text>
            Twink does not separate into multiple players setting categories.
            All runs have the freedom to change players setting during the run
            from 1 to 8.
          </v-card-text>
          <v-divider></v-divider>
          <v-card-title>
            Hell Twink rules
          </v-card-title>
          <v-card-text>
            <ul>
              <li>
                You CANNOT start with your character pre-equipped. All items
                must start from your inventory/stash. The only exception is for
                the character's original starting items as mentioned above.
              </li>
              <li>
                Unseeded maps only. If you reset your run, you should reroll
                your map seed using something like TCP/IP
              </li>

              <li>
                Start with any non-quest items you want in your stash/inventory,
                limited to: Helms, Weapons, Shields, Chests, Gloves, Boots,
                Belts, Rings, Amulets, Throwing Potions
              </li>
              <li>
                That means that you can socket runes/gems/jewels into your gear
                but, you can't start with free floating runes/gems/jewels
              </li>
              <li>
                Starting with gold not allowed, but you can sell your items for
                gold.
              </li>
              <li>Ladder items are allowed.</li>
              <li>
                You're allowed to only have one item with teleport charges.
              </li>
              <li>
                All items must be a legitimate item that you could potentially
                find/craft playing vanilla Diablo II: LOD 1.14d. To check if
                item is legitimate use this tool:
                <a
                  href="https://tools.harrogath.com/affixcalc.html#"
                  target="_blank"
                  >Affix Calc</a
                >
              </li>
            </ul>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-title>
            Global rules
          </v-card-title>
          <GeneralRules> </GeneralRules>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GeneralRules from '@/components/GeneralRules.vue';

export default {
  components: { GeneralRules },
  name: 'BlogPost'
};
</script>
