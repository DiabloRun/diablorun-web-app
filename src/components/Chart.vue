<template>
  <div>
    <highcharts class="hc" :options="options" ref="chart"></highcharts>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';

exportingInit(Highcharts);

export default {
  props: ['options']
};
</script>
