// Dashboard.test.js
import { render, fireEvent, screen,waitFor } from '@testing-library/vue';
import Dashboard from '@/components/DashboardPage.vue'; // Adjust the import based on your file structure
import { describe, it, expect } from 'vitest';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import Addtask from '@/components/Addtask.vue';
import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
vi.mock('axios');

// Create a mock router
const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [], // Add any necessary routes here
});

describe('Dashboard Component', () => {
  it('renders the AddTask component when the Add Task button is clicked', async () => {
    // Render the Dashboard component
    render(Dashboard);

    // Find the Add Task button
    const addTaskButton = screen.getByRole('button', { name: /add task/i });

    // Click the Add Task button
    await fireEvent.click(addTaskButton);

    // Check if the AddTask component is rendered
    const addTaskComponent = screen.getByTestId('add-task-component');

    // Assert that the AddTask component is in the document
    expect(addTaskComponent).toBeTruthy(); // Check if the element exists
  });

});


describe("addTask functionality",()=>{

  it('fetches and displays assignees in the dropdown', async () => {
    const mockAssignees = [
      { _id: new ObjectId('650c9d2e3a745b001c8b45a1'), name: 'John Doe' },
      { _id: new ObjectId('650c9d2e3a745b001c8b45b1'), name: 'Jane Smith' },
    ];
  
    axios.get.mockResolvedValueOnce({ data: mockAssignees });
  
    const { getByLabelText, getByRole } = render(Addtask, {
      global: {
        plugins: [mockRouter],
      },
    });
  
    await nextTick();
    await waitFor(() => {
      expect(getByLabelText(/user/i)).to.exist;  // Replaced with exist
      expect(getByRole('option', { name: /john doe/i })).to.exist;  // Replaced with exist
      expect(getByRole('option', { name: /jane smith/i })).to.exist;  // Replaced with exist
    });
  });

  it('updates task title', async () => {
    const { getByLabelText } = render(Addtask, {
      global: {
        plugins: [mockRouter],
      },
    });

    const titleInput = getByLabelText(/title/i);
    await fireEvent.update(titleInput, 'Test Task');

    expect(titleInput.value).toBe('Test Task');
  });

  it('updates task description', async () => {
    const { getByLabelText } = render(Addtask, {
      global: {
        plugins: [mockRouter],
      },
    });

    const descriptionInput = getByLabelText(/description/i);
    await fireEvent.update(descriptionInput, 'This is a test task description.');

    expect(descriptionInput.value).toBe('This is a test task description.');
  });
  it('sets the date in the due date field', async () => {
    const { getByLabelText } = render(Addtask, {
      global: {
        plugins: [mockRouter],
      },
    });
  
    // Get the input for 'Due date'
    const dateInput = getByLabelText(/due date/i); // or getByLabelText('Due date')
    
    // Update the date input field with a new date
    await fireEvent.update(dateInput, '2024-10-10');
  
    // Assert the input value has been updated correctly
    expect(dateInput.value).toBe('2024-10-10');
  });

  it('renders the status field', async () => {
    const { getByLabelText } = render(Addtask, {
      global: {
        plugins: [mockRouter],
      },
    });
  
    const statusField = getByLabelText(/status/i); // Use regex for case-insensitive matching
    expect(statusField).toBeDefined(); // Checks that the field is defined
    expect(statusField).toBeTruthy(); // Checks that the field is truthy (exists and is not null/undefined)
  });

  it('submits task data successfully', async () => {
    const mockAssignees = [
      { _id: '650c9d2e3a745b001c8b45a1', name: 'John Doe' },
      { _id: '650c9d2e3a745b001c8b45b1', name: 'Jane Smith' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockAssignees });
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const { getByLabelText, getByRole } = render(Addtask, {
      global: {
        plugins: [mockRouter],
      },
    });

    await nextTick();

    const userSelect = getByLabelText(/user/i);
    await waitFor(() => {
      expect(userSelect.options.length).toBeGreaterThan(0); 
   
      console.log(userSelect.innerHTML, "User Select Element Options HTML");
    });
   
    const johnDoeOption = Array.from(userSelect.options).find(option => option.text === 'John Doe');

   
    if (johnDoeOption) {
      await fireEvent.update(userSelect, { target: { value: johnDoeOption.value } });
      
      console.log('Selected Userrr ID:', );
    } else {
      throw new Error('John Doe option not found in the select');
    }

    await fireEvent.update(getByLabelText(/title/i), 'Test Task');
    await fireEvent.update(getByLabelText(/description/i), 'This is a test task description.');
    await fireEvent.update(getByLabelText(/due date/i), '2024-10-10');

    await fireEvent.click(getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/task/addtask',
        {
          user: '650c9d2e3a745b001c8b45a1',
          title: 'Test Task',
          description: 'This is a test task description.',
          dueDate: '2024-10-10',
          status: 'pending',
        }
      );
    });
  });
})