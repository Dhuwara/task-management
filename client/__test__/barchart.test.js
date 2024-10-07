import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import BarChart from '@/components/BarChart.vue'; // Adjust the path as necessary

describe('BarChart', () => {
  it('renders the BarChart component correctly with valid data', async () => {
    const chartData = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'Votes',
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
          data: [12, 19, 3],
        },
      ],
    };

    const wrapper = mount(BarChart, {
      props: {
        chartData,
      },
    });

    expect(wrapper.findComponent({ name: 'Bar' }).exists()).toBe(true);
    expect(wrapper.vm.chartOptions.plugins.legend.display).toBe(true);
  });

  it('displays the correct title in the chart options', async () => {
    const chartData = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'Votes',
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
          data: [12, 19, 3],
        },
      ],
    };

    const wrapper = mount(BarChart, {
      props: {
        chartData,
      },
    });

    await wrapper.vm.$nextTick();
    console.log(wrapper.vm.chartData.datasets[0].label,"tssssssssss")
    expect(wrapper.vm.chartData.datasets[0].label).toBe('Votes');

  });



});
