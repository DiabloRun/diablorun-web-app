<template>
  <v-container>
    <v-row dense>
      <!-- Title -->

      <v-col cols="12">
        <v-row>
          <v-col>
            <h1>Pacifist category rules</h1>
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
                Timer starts right after character creation and ends when you
                land the killing blow on normal Baal.
              </li>
              <li>
                Time is measured in Real Time and In-game Time.
              </li>
            </ul>
          </v-card-text>
          <v-divider> </v-divider>
          <v-card-title>
            Players setting
          </v-card-title>
          <v-card-text>
            Pacifist does not separate into multiple players setting categories.
            All runs have the freedom to change players setting during the run
            from 1 to 8.
          </v-card-text>
          <v-divider></v-divider>
          <v-card-title>
            Category specific
          </v-card-title>
          <v-card-text>
            <ul>
              <li>
                You may not take any action that would directly deal damage to
                anything with a life bar [any attack, most skills, some
                shrines].
              </li>
              <li>
                You may not force something to attack you or others [Taunt,
                Confuse, Attract].
              </li>
              <li>
                You may not set traps for things to walk into [Assassin traps],
                nor use directly damaging auras [Sanctuary, Holy Fire].
              </li>
              <li>
                You may not hire anyone [Mercenaries] or summon anything [most
                summons] to do anything forbidden on your behalf, but you aren't
                responsible for the actions of fully independent NPCs [Flavie,
                Wild Barbarians].
              </li>
              <li>
                Thorns, Iron Maiden, Spirit of Barbs, "attacker takes damage",
                and "chance to cast when struck" are permitted sources of
                damage.
              </li>
              <li>
                Offensive skills used for mobility or convenience [Telekinesis,
                Charge, Leap Attack] are allowed, but accidentally targeting or
                attacking something (which Charge and Leap Attack sometimes do
                automatically) invalidates the run. Use at your own risk.
              </li>
              <li>
                Directly attacking or dealing damage, even an accidental attack
                due to the "bindings glitch", invalidates the run. Set hotkeys
                for "Throw" and "Unsummon", take care not to equip throwing
                weapons, and get in the habit of re-setting your bindings every
                time you equip or unequip anything.
              </li>
              <li>
                Crowd control skills that don't deal damage are allowed [Leap,
                Bone Wall, Decoy], except if they force things to attack you or
                others [Taunt, Confuse, Attract].
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
