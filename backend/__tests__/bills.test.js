const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockBills = {
  findMany: jest.fn(),
  create: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    bill: mockBills,
  })),
}));

const app = require('../server');

describe('Bills API', () => {
  let adminToken, residentToken;

  beforeEach(() => {
    jest.clearAllMocks();
    adminToken = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET);
    residentToken = jwt.sign({ id: 2, role: 'RESIDENT' }, process.env.JWT_SECRET);
  });

  it('GET /api/bills/mine - should fetch bills for the logged-in resident', async () => {
    const mockData = [{ id: 1, title: 'Water Bill', userId: 2 }];
    mockBills.findMany.mockResolvedValue(mockData);

    const res = await request(app)
      .get('/api/bills/mine')
      .set('Authorization', `Bearer ${residentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe('Water Bill');
  });

  it('POST /api/bills - should allow an admin to create a bill', async () => {
    const billData = { userId: 2, title: 'Maintenance Fee', amount: 100, dueDate: new Date().toISOString() };
    mockBills.create.mockResolvedValue({ id: 2, ...billData });

    const res = await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(billData);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(billData.title);
  });
});