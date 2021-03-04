<template>
  <v-container fill-height fluid class="pa-6">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8" lg="6">
        <v-card>
          <v-card-title>We're brothers from Estonia</v-card-title>
          <v-card-subtitle>
            Our goal is to build a portal for Diablo players where people can
            compete in races, share their speedruns, characters and
            playthroughs.
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-row justify="center" class="text-center pa-9">
            <v-col>
              <v-avatar size="96">
                <img
                  alt="user"
                  src="https://s3.eu-central-1.amazonaws.com/d2.leede.ee/static/img/indrek.jpg"
                />
              </v-avatar>
              <v-card-title class="justify-center"> Indrek </v-card-title>
              <v-card-subtitle class="pb-0"> Developer </v-card-subtitle>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
              <v-avatar size="96">
                <img
                  alt="user"
                  src="https://s3.eu-central-1.amazonaws.com/d2.leede.ee/static/img/shenk.jpg"
                />
              </v-avatar>
              <v-card-title class="justify-center">
                OverseerShenk
              </v-card-title>
              <v-card-subtitle class="pb-0"> Developer </v-card-subtitle>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              color="primary lighten-2"
              text
              href="https://discord.gg/QMMDR2a"
              target="_blank"
            >
              <v-icon left>mdi-discord</v-icon>Contact us on
              Discord
            </v-btn>
            <v-btn
              color="primary lighten-2"
              text
              href="https://github.com/DiabloRun/"
              target="_blank"
            >
              <v-icon left>mdi-github</v-icon>GitHub
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
