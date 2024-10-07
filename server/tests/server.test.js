import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../server'; // Import the app
// Mock Mongoose connection
jest.mock('mongoose', () => ({
    connect: jest.fn().mockResolvedValue({}),
    connection: {
        on: jest.fn(),
    },
}));

// Mock the userRoutes and taskRoutes modules
jest.mock('../routes/userRoutes', () => (req, res) => {
    res.status(200).send('Mocked Users');
});

jest.mock('../routes/taskRoutes', () => (req, res) => {
    res.status(200).send('Mocked Tasks');
});

describe('Server with mocked routes', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {}); // Mute console.log during testing
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should respond to GET /api/users with mocked data', async () => {
        const response = await request(app).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Mocked Users');
    });

    it('should respond to GET /api/task with mocked data', async () => {
        const response = await request(app).get('/api/task');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Mocked Tasks');
    });

    it('should return 404 for unknown routes', async () => {
        const response = await request(app).get('/api/unknown');
        expect(response.statusCode).toBe(404);
    });
});
