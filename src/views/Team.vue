<template>
  <v-container>
    <v-row class="my-16">
      <v-col class="text-center">
        <img class="logo big" src="@/assets/img/logo.png" />
        <h2>Team</h2>
      </v-col>
    </v-row>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" lg="10" xl="8">
        <v-card>
          <v-row no-gutters>
            <v-col cols="12" lg="8" class="d-flex flex-column">
              <v-card-title>We're brothers from Estonia</v-card-title>
              <v-card-subtitle>
                Our goal is to build a portal for Diablo players where people
                can compete in races, share their speedruns, characters and
                playthroughs.
              </v-card-subtitle>
              <v-spacer></v-spacer>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn text href="https://discord.gg/QMMDR2a" target="_blank">
                  <v-icon left>mdi-discord</v-icon>Contact us on Discord
                </v-btn>
                <v-btn
                  text
                  href="https://github.com/DiabloRun/"
                  target="_blank"
                >
                  <v-icon left>mdi-github</v-icon>GitHub
                </v-btn>
              </v-card-actions>
            </v-col>
            <v-divider vertical class="hidden-md-and-down" />
            <v-col class="pa-5">
              <v-row no-gutters class="pb-5">
                <v-col cols="auto">
                  <v-avatar size="96">
                    <img
                      alt="user"
                      src="https://s3.eu-central-1.amazonaws.com/d2.leede.ee/static/img/shenk.jpg"
                    />
                  </v-avatar>
                </v-col>
                <v-col class="my-auto">
                  <v-card-title> OverseerShenk </v-card-title>
                  <v-card-subtitle> Developer </v-card-subtitle>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="auto">
                  <v-avatar size="96">
                    <img
                      alt="user"
                      src="https://s3.eu-central-1.amazonaws.com/d2.leede.ee/static/img/indrek.jpg"
                    />
                  </v-avatar>
                </v-col>
                <v-col class="my-auto">
                  <v-card-title> Indrek </v-card-title>
                  <v-card-subtitle> Front-end developer </v-card-subtitle>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
