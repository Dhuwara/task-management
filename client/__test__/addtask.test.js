// AddTask.spec.js
import { render, fireEvent, waitFor } from '@testing-library/vue';
import AddTask from '@/components/Addtask.vue';
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';

// Mock the axios module
vi.mock('axios');

// Create a mock router for navigation
const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home</div>' },
    },
    {
      path: '/add-task',
      component: AddTask,
    },
  ],
});

describe('AddTask Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('fetches and displays assignees', async () => {
    // Mock the API response for fetching assignees
    const mockAssignees = [
      { _id: '1', name: 'John Doe' },
      { _id: '2', name: 'Jane Smith' },
    ];
    axios.get.mockResolvedValueOnce({ data: mockAssignees });

    // Render the component with the mock router
    const { getByLabelText, getByRole } = render(AddTask, {
      global: {
        plugins: [mockRouter],
      },
    });

    // Wait for the component to fetch the assignees
    await nextTick();

    // Check if the options are displayed in the select field
    expect(getByLabelText(/user/i)).toBeInTheDocument();
    expect(getByRole('option', { name: /john doe/i })).toBeInTheDocument();
    expect(getByRole('option', { name: /jane smith/i })).toBeInTheDocument();
  });

  it('submits task data successfully', async () => {
    // Mock the API response for fetching assignees
    const mockAssignees = [
      { _id: '1', name: 'John Doe' },
    ];
    axios.get.mockResolvedValueOnce({ data: mockAssignees });

    // Mock the API response for submitting the task
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    // Render the component with the mock router
    const { getByLabelText, getByRole } = render(AddTask, {
      global: {
        plugins: [mockRouter],
      },
    });

    // Wait for the component to fetch the assignees
    await nextTick();
    await fireEvent.change(userSelect, { target: { value: '1' } }); // Selecting John Doe

    await fireEvent.update(getByLabelText(/title/i), 'Test Task');
    await fireEvent.update(getByLabelText(/description/i), 'This is a test task description.');
    await fireEvent.update(getByLabelText(/due date/i), '2024-10-10');

    // Simulate form submission
    await fireEvent.click(getByRole('button', { name: /add task/i }));

    // Wait for the axios post call to resolve
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/task/addtask',
        {
          user: '1',
          title: 'Test Task',
          description: 'This is a test task description.',
          dueDate: '2024-10-10',
          status: 'pending',
        }
      );
    });
  });

  it('closes the modal and navigates back to the homepage', async () => {
    // Render the component with the mock router
    const { getByRole } = render(AddTask, {
      global: {
        plugins: [mockRouter],
      },
    });

    // Simulate closing the modal
    await fireEvent.click(getByRole('button', { name: /close/i }));

    // Check if the route was changed to the homepage
    await waitFor(() => {
      expect(mockRouter.currentRoute.value.path).toBe('/');
    });
  });
});
