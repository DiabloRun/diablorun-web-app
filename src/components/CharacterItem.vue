<template>
  <v-col cols="12" md="6" lg="4" class="pb-4 px-2">
    <v-card color="darkAccent" class="fill-height">
      <v-row no-gutters>
        <v-col align="center" class="pa-2">
          <v-img :src="imageSrc" height="50px" contain>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  size="18"
                  width="2"
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <h5 class="my-1">
            <span v-if="runeword" class="quality-gold"
              >{{ runeword }}<br
            /></span>
            <span :class="`quality-${runeword ? 'socketed' : item.quality}`">
              {{ runeword ? item.base_name : item.name }}
            </span>
          </h5>
          <p
            class="mb-0 body-2"
            :class="{ 'error--text': property.includes('ÿc1') }"
            v-for="property of properties"
            :key="property"
          >
            {{ property.replace(/^ÿc1/, '') }}
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<style scoped lang="scss">
.quality-yellow {
  color: #fdfd70;
}

.quality-orange {
  color: #f7c100;
}

.quality-green {
  color: #01fd00;
}

.quality-gold {
  color: #dcc784;
}

.quality-blue {
  color: #7575fd;
}

.quality-socketed {
  opacity: 0.5;
  font-weight: 400;
}

.quality-white {
  color: #fdfdfd;
}
</style>

<script>
import { itemImages } from '@diablorun/diablorun-data';

export default {
  name: 'CharacterItem',
  props: {
    item: Object
  },
  data() {
    return {
      imageSrc: '',
      properties: [],
      runeword: ''
    };
  },
  watch: {
    item: {
      immediate: true,
      handler(item) {
        this.imageSrc = itemImages[item.name] || itemImages[item.base_name];
        this.properties = JSON.parse(item.properties);

        const runewordMatch = item.name.match(/^(.*?) \[(.*?)\]$/);

        if (runewordMatch) {
          this.runeword = runewordMatch[2];
        } else {
          this.runeword = '';
        }
      }
    }
  }
};
</script>
