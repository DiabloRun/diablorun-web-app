<template>
  <v-container>
    <v-row dense>
      <!-- Title -->
      <v-col cols="12">
        <v-row>
          <v-col>
            <h1>Hell category rules</h1>
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
                land the killing blow on hell Baal.
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
            <ul>
              <li>
                Players X runs have the freedom to change the setting during the
                run to any value from 1 to 8.
              </li>
              <li>
                Players 1 runs never change it from the default setting.
              </li>
              <li>
                Players 8 runs must use /players 8 the entire run. In case of a
                game crash you're allowed to set it back to /players 8 in town.
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
