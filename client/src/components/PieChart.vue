<template>
  <div style="height: 300px; margin-top: 10px;  width: 100% !important;">
    <!-- Only render the Pie chart if chartData is available -->
    <Pie v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: 'PieChart',
  components:{Pie},
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
         
        },
      },
    };
  },

  created() {
    // Log the chartData when the component is created
    console.log('Received chartData:', this.chartData);
  },

  watch: {
    // Watch for changes in chartData and log them
    chartData(newData) {
      console.log('Updated chartData:', newData);
    },
  },
};
</script>

<style scoped>
/* Optional PieChart-specific styles */
</style>
