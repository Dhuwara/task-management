const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Adjust path as necessary
const User = require('../modals/user');
const Task = require('../modals/task.model');


let mongoServer;

// Initialize MongoDB memory server
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to the in-memory MongoDB only if not already connected
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Clear collections before each test
beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
});

describe('Task API', () => {
    let userId;
    
    beforeAll(async () => {
        // Create a test user
        const user = await User.create({
            name: 'Test User',
            email: 'test.user@example.com',
            task_ids: [],
            address: '123 Main St',
            dateOfJoining: new Date(),
            dob: new Date('1990-01-01'),
            phone: '+1234567890',
            zipcode: '12345',
            Designation: 'Developer',
        });
        userId = user._id;
    });

    test('GET /api/tasks should return all tasks', async () => {
        const response = await request(app).get('/api/task');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    

    test('POST /api/tasks should create a new task', async () => {
        const newTask = {
            title: 'New Task',
            description: 'This is a new task',
            status: 'in-progress',
            dueDate: new Date(),
            user: userId,
        };

        const response = await request(app).post('/api/task/addtask').send(newTask);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe(newTask.title);
    });

    test('POST /api/tasks should return 500 if there is a server error', async () => {
        // Mock the task.create method to throw an error
        jest.spyOn(Task, 'create').mockImplementation(() => {
            throw new Error('Database Error');
        });

        const newTask = {
            title: 'New Task',
            description: 'This is a new task',
            status: 'in-progress',
            dueDate: new Date(),
            user: userId,
        };

        const response = await request(app).post('/api/task/addtask').send(newTask);

        // Expect a 500 status and appropriate error message
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database Error');

        // Restore the original method
        jest.restoreAllMocks();
    });



    test('GET /api/tasks/:id should return a task by ID', async () => {
        const task = await Task.create({
           
            title: 'Sample Task',
            description: 'Sample Description',
            status: 'completed',
            dueDate: new Date(),
            user: userId,
        });

        const response = await request(app).get(`/api/task/tasks/${task._id}`);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(task.title);
    });

    test('GET /api/tasks/:id should return 404 for non-existing task', async () => {
        const response = await request(app).get('/api/task/tasks/60d3b41c203c5c5f5c89f3ff'); // Example invalid ID
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Task not found');
    });
    

    test('GET /api/tasks/:id should return 500 if there is a server error', async () => {
        // Spy on the Task.findById method and mock it to throw an error
        const findByIdSpy = jest.spyOn(Task, 'findById').mockImplementation(() => {
            throw new Error('Database Error');
        });

        const response = await request(app).get(`/api/task/tasks/60d3b41c203c5c5f5c89f3ff`);

        // Expect a 500 status and appropriate error message
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error fetching task');

        // Restore the original method
        findByIdSpy.mockRestore();
    });

    

    test('GET /api/tasks/d/assigned should return tasks with user names', async () => {
        const task = await Task.create({
            title: 'Task with User',
            description: 'Task Description',
            status: 'not-started',
            dueDate: new Date(),
            user: userId,
        });

        const response = await request(app).get('/api/task/assigned');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('userName');
    });

    test('GET /api/tasks/d/assigned should return 500 if there is a server error', async () => {
        // Spy on the Task.aggregate method and mock it to throw an error
        const aggregateSpy = jest.spyOn(Task, 'aggregate').mockImplementation(() => {
            throw new Error('Database Error');
        });

        const response = await request(app).get('/api/task/assigned');

        // Expect a 500 status and appropriate error message
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error fetching tasks with user names');

        // Restore the original method
        aggregateSpy.mockRestore();
    });

    test('GET /api/tasks/c/count should return task counts by status', async () => {
        await Task.create({
            title: 'Task 1',
            description: 'Task 1 Description',
            status: 'completed',
            dueDate: new Date(),
            user: userId,
        });

        await Task.create({
            title: 'Task 2',
            description: 'Task 2 Description',
            status: 'in-progress',
            dueDate: new Date(),
            user: userId,
        });

        const response = await request(app).get('/api/task/countofstatus');
        expect(response.status).toBe(200);
        
    });

    test('GET /api/tasks/c/count should return 500 if there is a server error', async () => {
        // Spy on the Task.find method and mock it to throw an error
        const findSpy = jest.spyOn(Task, 'find').mockImplementation(() => {
            throw new Error('Database Error');
        });

        const response = await request(app).get('/api/task/countofstatus');

        // Expect a 500 status and appropriate error message
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while counting statuses.');

        // Restore the original method
        findSpy.mockRestore();
    });

    test('DELETE /api/tasks/:id should delete a task', async () => {
        const task = await Task.create({
            title: 'Task to Delete',
            description: 'Description',
            status: 'not-started',
            dueDate: new Date(),
            user: userId,
        });
        console.log(task._id,"hello")

        const response = await request(app).delete(`/api/task/deletetask/${task._id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task deleted successfully');
    });

    test('DELETE /api/tasks/:id should return 404 for non-existing task', async () => {
        const response = await request(app).delete('/api/task/deletetask/60d3b41c203c5c5f5c89f3ff'); // Example invalid ID
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Task not found');
    });
});


test('DELETE /api/tasks/:id should return 500 on error', async () => {
    jest.spyOn(Task, 'findByIdAndDelete').mockImplementationOnce(() => {
        throw new Error('Database error');
    });

    const response = await request(app).delete('/api/task/deletetask/Task._id');
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
});



describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
        // Create a sample task before each test
        const task = await Task.create({
            title: 'Initial Task',
            description: 'Initial Description',
            status: 'not-started',
            dueDate: new Date(),
            user: '60d3b41c203c5c5f5c89f3ff',
        });
        taskId = task._id;
    });

    test('should update task status when provided', async () => {
        const response = await request(app)
            .put(`/api/task/updatetask/${taskId}`)
            .send({ status: 'completed' });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('completed'); // Check if the status is updated
        expect(response.body.title).toBe('Initial Task'); // Ensure other fields remain unchanged
    });

    test('should not update task status if not provided', async () => {
        const response = await request(app)
            .put(`/api/task/updatetask/${taskId}`)
            .send({}); // Sending an empty body, no status

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('not-started'); // Check if the status remains unchanged
    });

    

    test('should return 404 for non-existing task', async () => {
        const response = await request(app)
            .put('/api/task/updatetask/60d3b41c203c5c5f5c89f3ff') // Example invalid ID
            .send({ status: 'completed' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Task not found');
    });

    test('should return 500 on error during update', async () => {
        jest.spyOn(Task, 'findByIdAndUpdate').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .put(`/api/task/updatetask/${taskId}`)
            .send({ status: 'completed' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });
});




afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});