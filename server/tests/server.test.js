const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Mock the Mongoose connection
jest.mock('mongoose', () => ({
    connect: jest.fn().mockResolvedValueOnce(Promise.resolve({})),
    connection: {
        on: jest.fn(),
    },
}));

// Mock the userRoutes and taskRoutes modules
jest.mock('server/src/routes/userRoutes.js', () => (req, res) => {
    res.status(200).send('Mocked Users');
});

jest.mock('server/src/routes/taskRoutes.js', () => (req, res) => {
    res.status(200).send('Mocked Tasks');
});

describe('Server with mocked routes', () => {
    beforeEach(() => {
        jest.spyOn(global.console, 'log').mockImplementation(() => {});
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