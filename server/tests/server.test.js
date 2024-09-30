const request = require('supertest');
const mongoose = require('mongoose');

// Mock mongoose to avoid actual DB connection
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValueOnce(() => Promise.resolve('Connected to MongoDB')),
}));

// Mock the routes for isolation
jest.mock('../routes/userRoutes.js', () => (req, res) => res.send('User route'));
jest.mock('../routes/taskRoutes.js', () => (req, res) => res.send('Task route'));

const app = require('../server'); // Assuming server.js exports the app

describe('Server Initialization and Routes', () => {
  it('should initialize the server and connect to MongoDB', async () => {
    // Check if mongoose.connect is called during app initialization
    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('should respond to /api/users route', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('User route');
  });

  it('should respond to /api/task route', async () => {
    const res = await request(app).get('/api/task');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Task route');
  });
});
