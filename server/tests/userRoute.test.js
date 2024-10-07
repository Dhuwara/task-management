const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); 
const User = require('../modals/user'); 
const Task = require('../modals/task.model')
let mongoServer;

// Initialize MongoDB memory server
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log("MongoDB Mock Server URI:", uri);  // Add this to verify
    
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User API Routes', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('GET /api/users', () => {
        test('should return status 200 and an array of users', async () => {
            const users = [
                {
                    name: 'Charlie Davis',
                    email: 'charlie.davis@example.com',
                    task_ids: [],
                    address: '123 Main St, Springfield, California, USA',
                    dateOfJoining: new Date('2020-01-15'),
                    dob: new Date('1990-01-01'),
                    phone: '+1234567890',
                    zipcode: '12345',
                    Designation: 'Tester',
                },
                {
                    name: 'Bob Williams',
                    email: 'bob.williams@example.com',
                    task_ids: [],
                    address: '123 Main St, Springfield, California, USA',
                    dateOfJoining: new Date('2020-01-15'),
                    dob: new Date('1990-01-01'),
                    phone: '+1234567890',
                    zipcode: '12345',
                    Designation: 'Frontend developer',
                },
            ];
            await User.insertMany(users);

            const response = await request(app).get('/api/users');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object); 
            expect(Array.isArray(response.body)).toBe(true); 
        });

        test('should return an empty array when no users exist', async () => {
            const response = await request(app).get('/api/users');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object); 
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        test('should handle errors gracefully', async () => {
            jest.spyOn(User, 'find').mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/users');

            expect(response.status).toBe(500);
            expect(response.body).toBeInstanceOf(Object); 
            expect(response.body).toEqual({ error: 'Database error' });

            User.find.mockRestore();
        });
    });

    // test get user by id
    describe('GET /api/users/:id', () => {
        let createdUserId;

        beforeEach(async () => {
            await User.deleteMany({});
            const user = new User({
                name: 'Charlie Davis',
                email: 'charlie.davis@example.com',
                task_ids: [],
                address: '123 Main St, Springfield, California, USA',
                dateOfJoining: new Date('2020-01-15'),
                dob: new Date('1990-01-01'),
                phone: '+1234567890',
                zipcode: '12345',
                Designation: 'Tester',
            });
            const savedUser = await user.save();
            createdUserId = savedUser._id;
        });

        test('should return user document when user exists', async () => {
            const response = await request(app).get(`/api/users/user/${createdUserId}`);

            expect(response.status).toBe(200);
            
        });

        test('should return 404 when user does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId(); // Use 'new' to instantiate ObjectId
            const response = await request(app).get(`/api/users/user/${nonExistentId}`);
        
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'User not found' });
        });

        test('should handle errors gracefully', async () => {
            // Simulate an error by mocking the User.findById method
            jest.spyOn(User, 'findById').mockRejectedValue(new Error('Database error'));
        
            const response = await request(app).get(`/api/users/user/${createdUserId}`);
        
            expect(response.status).toBe(500);
         
        
            // Restore original implementation
            User.findById.mockRestore();
        });
    });

    describe('GET /api/users/task', () => {
        beforeEach(async () => {
            await User.deleteMany({});
            await Task.deleteMany({});
        });

        test('should return users with their tasks and status 200', async () => {
            // Create a test user first
            const user1 = await User.create({
                name: 'Charlie Davis',
                email: 'charlie.davis@example.com',
                task_ids: [], // Will be populated later
                address: '123 Main St, Springfield, California, USA',
                dateOfJoining: new Date('2020-01-15'),
                dob: new Date('1990-01-01'),
                phone: '+1234567890',
                zipcode: '12345',
                Designation: 'Tester',
            });

            // Create some test tasks and associate them with the user
            const task1 = await Task.create({
                title: 'Deployment',
                description: 'Deploy the application to the cloud',
                status: 'completed',
                dueDate: new Date(),
                user: user1._id, // Link to the user
            });

            const task2 = await Task.create({
                title: 'Frontend Refactor',
                description: 'Refactor the frontend components',
                status: 'completed',
                dueDate: new Date(),
                user: user1._id, // Link to the user
            });

            // Update user with task_ids
            user1.task_ids = [task1._id, task2._id];
            await user1.save();

            const response = await request(app).get('/api/users/task');

            expect(response.status).toBe(200);
           
        });

        test('should handle errors gracefully and return status 500', async () => {
            // Mock the aggregate method to throw an error
            jest.spyOn(User, 'aggregate').mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/users/task');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Database error'});

            // Restore original implementation
            User.aggregate.mockRestore();
        });
    });

    describe('GET /api/users/task/count', () => {
        beforeEach(async () => {
            await User.deleteMany({});
        });

        test('should return users with their task counts and status 200', async () => {
            // Create test users with all required fields
            const user1 = await User.create({
                name: 'Charlie Davis',
                email: 'charlie.davis@example.com',
                phone: '+1234567890', // Required field
                dob: new Date('1990-01-01'), // Required field
                dateOfJoining: new Date('2020-01-15'), // Required field
                address: '123 Main St, Springfield, California, USA', // Required field
                task_ids: ['650c9dc33a745b001c8b45e9', '650c9dd43a745b001c8b45ea'],
            });

            const user2 = await User.create({
                name: 'Bob Williams',
                email: 'bob.williams@example.com',
                phone: '+1234567890', // Required field
                dob: new Date('1990-01-01'), // Required field
                dateOfJoining: new Date('2020-01-15'), // Required field
                address: '123 Main St, Springfield, California, USA', // Required field
                task_ids: ['650c9da03a745b001c8b45d8'],
            });

            const response = await request(app).get('/api/users/user/d/getusercount');

            expect(response.status).toBe(200);
           
        });

        test('should return an empty object when no users exist', async () => {
            const response = await request(app).get('/api/users/user/d/getusercount');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({});
        });

        test('should handle errors gracefully and return status 500', async () => {
            // Mock the aggregate method to throw an error
            jest.spyOn(User, 'aggregate').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app).get('/api/users/user/d/getusercount');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Database error'});

            // Restore original implementation
            User.aggregate.mockRestore();
        });
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
