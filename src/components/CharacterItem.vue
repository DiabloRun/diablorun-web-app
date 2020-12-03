<template>
  <div class="card">
    <div class="card-content equipment">
      <div class="content has-text-centered">
        <div class="columns is-mobile is-centered is-gapless">
          <div class="column is-narrow">
            <img :src="imageSrc">
          </div>
          <div class="column is-10">
            <h1 :class="`title is-item has-small-margin`">
              <span v-if="runeword" class="quality-gold">{{ runeword }}<br></span>
              <span :class="`quality-${runeword ? 'socketed' : item.quality}`">
                {{ runeword ? item.base_name : item.name }}
              </span>
            </h1>
            <p class="has-text-small has-no-margin"
              :class="{ 'has-text-warning': property.includes('ÿc1') }"
              v-for="property of properties" :key="property">
              {{ property.replace(/^ÿc1/, '') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
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
    opacity: .5;
    font-size: .95rem;
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
