import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/components/DashboardPage.vue'; // Adjust path as necessary
import UserDetails from '@/components/userDetail.vue'; // Adjust path as necessary

// Set up Vue Router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/userdetail/:id', component: UserDetails },
  ],
});

describe('Dashboard and UserDetails Navigation', () => {
  beforeEach(async () => {
    router.push('/');
    await router.isReady();
  });

  it('navigates to user details and shows tasks when clicking on user name', async () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [router],
      },
    });

    console.log(wrapper.vm,'wrapper')
    // Simulate the click on the user name
    const userNameElement = wrapper.find('.hover-effect'); // Adjust class selector to match user name element

    
    await userNameElement.trigger('click');

    // Wait for navigation to the UserDetails component
    await router.isReady();

    // Verify we are now on the UserDetails page
    expect(wrapper.vm.$route.path).toBe('/userdetail/650c9d5e3a745b001c8b45d1'); // Replace '1' with the expected userId

    console.log(wrapper.vm.$route.path,"fwpwpfwfpw")
    // Find the tasks tab button and click it
    const tasksTabButton = wrapper.find('#v-pills-profile-tab'); // Adjust selector for the tasks tab
    await tasksTabButton.trigger('click');

    // Verify that the tasks are displayed
    const tasksList = wrapper.find('.taskul'); // Adjust selector to match task list element
    expect(tasksList.exists()).toBe(true);
  });
});
