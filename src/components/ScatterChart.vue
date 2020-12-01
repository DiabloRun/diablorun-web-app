<script>
import { Scatter } from 'vue-chartjs';

export default {
  extends: Scatter,
  name: 'ScatterChart',
  props: {
    stat: String,
    chartData: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          ticks: {
            userCallback: (label) => {
              const h = Math.floor(label / 3600);
              const m = Math.floor(label % 3600 / 60);
              return `${h}h ${m}m`;
            }
          }
        }]
      }
    });
  },
  methods: {
    update() {
      try {
        this.$data._chart.update();
      } catch (err) {
        console.warn(err);
      }
    }
  }
}
</script>
