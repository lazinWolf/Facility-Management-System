const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. Mock the bcryptjs library
jest.mock('bcryptjs');

// 2. Define a mock object for the 'user' model
const mockUser = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

// 3. Mock the Prisma client to return our mock user object
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: mockUser,
  })),
}));

// 4. Require the app AFTER mocks are defined
const app = require('../server');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/auth/register - should register a new user successfully', async () => {
    const userData = { name: 'John Doe', email: 'john@test.com', password: 'password123' };
    mockUser.findUnique.mockResolvedValue(null);
    mockUser.create.mockResolvedValue({ id: 1, ...userData });
    // Mock the hash function to return a predictable value
    bcrypt.hash.mockResolvedValue('hashed_password');

    const res = await request(app).post('/api/auth/register').send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe('User registered');
  });

  it('POST /api/auth/login - should log in an existing user and return a token', async () => {
    const loginData = { email: 'jane@test.com', password: 'password123' };
    const mockUserData = { id: 2, name: 'Jane Doe', email: loginData.email, password: 'hashed_password', role: 'RESIDENT' };
    mockUser.findUnique.mockResolvedValue(mockUserData);
    // Control the outcome of the password comparison
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/api/auth/login').send(loginData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('GET /api/auth/profile - should fetch the profile for a logged-in user', async () => {
    const mockUserData = { id: 2, name: 'Jane Doe', email: 'jane@test.com', role: 'RESIDENT' };
    const token = jwt.sign({ id: mockUserData.id, role: mockUserData.role }, process.env.JWT_SECRET);
    mockUser.findUnique.mockResolvedValue(mockUserData);

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(mockUserData.email);
  });
});