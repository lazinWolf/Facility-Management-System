const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockComplaints = {
  create: jest.fn(),
  findMany: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    complaint: mockComplaints,
  })),
}));

const app = require('../server');

describe('Complaints API', () => {
  let adminToken, residentToken;

  beforeEach(() => {
    jest.clearAllMocks();
    adminToken = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET);
    residentToken = jwt.sign({ id: 2, role: 'RESIDENT' }, process.env.JWT_SECRET);
  });

  it('POST /api/complaints - should allow a resident to create a complaint', async () => {
    const complaintData = { title: 'Leaky Faucet', description: 'The faucet in my kitchen is leaking.' };
    const created = { id: 1, ...complaintData, userId: 2 };
    mockComplaints.create.mockResolvedValue(created);

    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${residentToken}`)
      .send(complaintData);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(complaintData.title);
  });
  
  it('GET /api/complaints - should allow an admin to fetch all complaints', async () => {
    const mockData = [{ id: 1, title: 'Leaky Faucet', userId: 2 }];
    mockComplaints.findMany.mockResolvedValue(mockData);

    const res = await request(app)
      .get('/api/complaints')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});