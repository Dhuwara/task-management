import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardPage from '@/components/DashboardPage.vue';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('DashboardPage.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(DashboardPage);
  });

  it('fetches pie chart data and updates the state', async () => {
    const mockPieChartData = {
      "in-progress": 2,
      "pending": 2,
      "completed": 4,
    };

    // Mock axios.get to return the mock data
    axios.get.mockResolvedValueOnce({ data: mockPieChartData });

    // Call the fetchPieChartData method
  await wrapper.vm.fetchPieChartData();
  

    // Check if axios.get was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/task/countofstatus');

    // Check if state.pieChartData was updated correctly
    expect(wrapper.vm.pieChartData).toEqual({
      labels: ['in-progress', 'pending', 'completed'],
      datasets: [
        {
          data: [2, 2, 4],
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
        },
      ],
    });
  });

  it('handles error when fetching pie chart data', async () => {
    // Mock axios.get to throw an error
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    // Call the fetchPieChartData method
    await wrapper.vm.fetchPieChartData();

    // Check if axios.get was called
    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/task/countofstatus');

    // Since there was an error, the pieChartData should remain null
    expect(wrapper.vm.pieChartData).toBeNull();
  });
});
