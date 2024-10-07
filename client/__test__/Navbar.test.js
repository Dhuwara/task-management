import { mount } from '@vue/test-utils';
import Navbar from '@/components/Navbar.vue'; // Adjust the path as necessary
import { createRouter, createWebHistory } from 'vue-router';
import { vi } from 'vitest';

// Define dummy routes for testing
const routes = [
  { path: '/', component: { template: '<div>Home</div>' } }, // Dummy home component
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('Navbar.vue', () => {
  beforeEach(() => {
    router.push('/'); // Set initial route
  });

  test('clicking the logo navigates to home route', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    });

    // Find the logo image and trigger a click
    const logo = wrapper.find('img');
    await logo.trigger('click');

    // Assert that the router has pushed to the home route
    expect(router.currentRoute.value.fullPath).toBe('/');
  });
});
