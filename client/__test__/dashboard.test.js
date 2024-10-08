import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from '@/components/DashboardPage.vue'; // Adjust the path as necessary
import userDetail from '@/components/userDetail.vue';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');
// Create a mock router
const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/userdetail/:userId',
        component: userDetail,
      },
    ],
  });

describe('DashboardPage', () => {
  let wrapper;

  beforeEach(async () => {
    // Mock the API response
    axios.get.mockResolvedValueOnce({
      data: [
        { _id: '1', title: 'Task 1', user: 'user1', userName: 'User One', status: 'completed' },
        { _id: '2', title: 'Task 2', user: 'user2', userName: 'User Two', status: 'in-progress' },
        { _id: '3', title: 'Task 3', user: 'user3', userName: 'User Three', status: 'pending' },
      ],
    });

    // Mount the component
    wrapper = mount(DashboardPage);
    
    // Wait for the component to fetch data and update the DOM
    await wrapper.vm.$nextTick();
  });

  it('renders the table correctly', () => {
    // Check if the table exists
    const table = wrapper.find('.table');
    expect(table.exists()).toBe(true);

    // Check the number of rows in the table body
    const rows = table.findAll('tbody tr');
    expect(rows.length).toBe(3); // We mocked 3 tasks

    // Check the content of the first row
    const firstRowCells = rows[0].findAll('td');
    expect(firstRowCells[0].text()).toBe('Task 1');
    expect(firstRowCells[1].text()).toBe('User One');
    expect(firstRowCells[2].text()).toBe('completed');

    // Check the content of the second row
    const secondRowCells = rows[1].findAll('td');
    expect(secondRowCells[0].text()).toBe('Task 2');
    expect(secondRowCells[1].text()).toBe('User Two');
    expect(secondRowCells[2].text()).toBe('in-progress');

    // Check the content of the third row
    const thirdRowCells = rows[2].findAll('td');
    expect(thirdRowCells[0].text()).toBe('Task 3');
    expect(thirdRowCells[1].text()).toBe('User Three');
    expect(thirdRowCells[2].text()).toBe('pending');
  });

  it('navigates to UserDetail component when assignee name is clicked', async () => {
    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          tableData: [
            {
              _id: '1',
              title: 'Task 1',
              userName: 'John Doe',
              user: 'user1',
              status: 'in-progress',
            },
          ],
        };
      },
    });

    // Trigger router navigation
    await wrapper.find('.hover-effect').trigger('click');

    // Wait for router to navigate
    await wrapper.vm.$nextTick();

    // Check that the current route is the user detail route
    expect(router.currentRoute.value.path).toBe('/userdetail/user1');

    // Optionally, you can mount the UserDetail component and check its content
    const userDetailWrapper = mount(userDetail);
    expect(userDetailWrapper.exists()).toBe(true);
  });

});