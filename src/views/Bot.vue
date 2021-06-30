<template>
  <v-container>
    <v-row>
      <!-- Bot commands -->
      <v-col cols="12">
        <h1>Twitch bot commands</h1>
        <h2 class="subtitle">
          Adding
          <a target="_blank" href="https://www.twitch.tv/diablorun">
            DiabloRun</a
          >
          Twitch bot account as moderator is recommended
        </h2>
      </v-col>
      <v-col cols="12">
        <v-simple-table dense class="text-no-wrap">
          <thead>
            <tr>
              <th>Commands</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                !gear
              </td>
              <td>
                Links to active character diablo.run gear page
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="12">
        <h1>Socketing</h1>
        <h2 class="subtitle">
          Recipes to socket bases with the cube. Can't socket superior bases.
          It's fine if the item is ethereal.
        </h2>
      </v-col>
      <v-col cols="12">
        <v-simple-table dense class="text-no-wrap">
          <thead>
            <tr>
              <th>Commands</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                !socket weapon
              </td>
              <td>
                Ral + Amn + Perfect Amethyst
              </td>
            </tr>
            <tr>
              <td>
                !socket armor
              </td>
              <td>
                Tal + Thul + Perfect Topaz
              </td>
            </tr>
            <tr>
              <td>
                !socket helm
              </td>
              <td>
                Tal + Thul + Perfect Topaz
              </td>
            </tr>
            <tr>
              <td>
                !socket shield
              </td>
              <td>
                Tal + Amn + Perfect Ruby
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="12">
        <h1>Cube recipes</h1>
        <h2 class="subtitle">
          Possible crafting bases are weapon, shield, helm, armor, gloves, belt,
          boots, ring and amulet. For example
          <strong>!caster amulet</strong> outputs "Caster Amulet: Magic Amulet +
          Amn + Amethyst + Jewel".
        </h2>
      </v-col>
      <v-col cols="12">
        <v-simple-table dense class="text-no-wrap">
          <thead>
            <tr>
              <th>Commands</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                !blood "base"
              </td>
              <td>Blood recipes</td>
            </tr>
            <tr>
              <td>
                !caster "base"
              </td>
              <td>
                Caster recipes
              </td>
            </tr>
            <tr>
              <td>
                !hit "base"
              </td>
              <td>
                Hit power recipes
              </td>
            </tr>
            <tr>
              <td>
                !safety "base"
              </td>
              <td>
                Safety recipes
              </td>
            </tr>
            <tr>
              <td>
                !"rune"
              </td>
              <td>
                Recipe to build the rune. For example
                <strong>!ral</strong> outputs "Ral: 3 Tal".
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>
