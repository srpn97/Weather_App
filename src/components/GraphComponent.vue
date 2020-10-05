<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    label: {
      type: String,
    },
    chartData: {
      type: Array,
    },
    options: {
      type: Object,
    },
    chartColors: {
      type: Object,
    },
  },
  mounted() {
    const dates = this.chartData.map((d) => d.date);
    const temps = this.chartData.map((d) => d.temps);
    const {
      borderColor,
      pointBorderColor,
      pointBackgroundColor,
      backgroundColor,
    } = this.chartColors;

    this.renderChart(
      {
        labels: dates,
        datasets: [
          {
            label: this.label,
            data: temps,
            borderColor: borderColor,
            pointBorderColor: pointBorderColor,
            pointBackgroundColor: pointBackgroundColor,
            fill: "+2",
            backgroundColor: [
              "rgba(255, 99, 132, 0.0)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderWidth: 2,
          },
        ],
      },
      this.options
    );
  },
};
</script>

<style lang='less'>
</style>