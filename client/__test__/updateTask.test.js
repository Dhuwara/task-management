// UpdateTask.spec.js
import { render, fireEvent, waitFor } from '@testing-library/vue';
import UpdateTask from '@/components/UpdateTask.vue';
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
      path: '/:id',
      component: UpdateTask,
    },
  ],
});

describe('UpdateTask Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('updates task data successfully', async () => {
    // Mock the task data fetched from the API
    const mockTask = {
      _id: '123',
      title: 'Original Title',
      description: 'Original Description',
      dueDate: '2023-10-10',
      status: 'pending',
    };

    // Mock the API response for fetching the task
    axios.get.mockResolvedValueOnce({ data: mockTask });

    // Mock the API response for updating the task
    axios.put.mockResolvedValueOnce({ data: { ...mockTask, title: 'Updated Title', status: 'completed' } });

    // Render the component with the mock router
    const { getByLabelText, getByRole } = render(UpdateTask, {
      global: {
        plugins: [mockRouter],
      },
    });

    // Wait for the component to fetch the task data
    await nextTick();

    // Simulate user input to update the task data
    await fireEvent.update(getByLabelText(/title/i), 'Updated Title');
    await fireEvent.update(getByLabelText(/description/i), 'Updated Description');
    await fireEvent.update(getByLabelText(/due date/i), '2023-10-15');
    await fireEvent.update(getByLabelText(/status/i), 'completed');

    // Simulate form submission
    await fireEvent.click(getByRole('button', { name: /update task/i }));

    // Wait for the axios put call to resolve
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:5000/api/task/updatetask/${mockTask._id}`,
        {
          title: 'Updated Title',
          description: 'Updated Description',
          dueDate: '2023-10-15',
          status: 'completed',
        }
      );
    });

    // Optionally, you can also check if the form was reset
    expect(getByLabelText(/title/i).value).toBe('');
    expect(getByLabelText(/description/i).value).toBe('');
    expect(getByLabelText(/due date/i).value).toBe('');
    expect(getByLabelText(/status/i).value).toBe(''); // Assuming the initial state of status is empty
  });
});
