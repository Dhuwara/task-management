<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="isValidChartData ? chartData : {}" 
    style="height: 300px;"
  />
</template>

<script>
import { ref, defineComponent, computed } from 'vue'; // Import computed
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const chartOptions = ref({
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'User Count by Status',
        },
      },
    });

    const isValidChartData = computed(() => {
      return (
        props.chartData &&
        props.chartData.labels &&
        Array.isArray(props.chartData.datasets) &&
        props.chartData.datasets.length > 0
      );
    });

    return {
      chartOptions,
      isValidChartData,
      chartData: props.chartData, // Access props in the setup function
    };
  },
});
</script>

<style>
</style>
