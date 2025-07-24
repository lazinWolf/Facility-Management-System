const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockVisitors = {
  create: jest.fn(),
  update: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    visitor: mockVisitors,
  })),
}));

const app = require('../server');

describe('Visitors API', () => {
  let adminToken, residentToken;

  beforeEach(() => {
    jest.clearAllMocks();
    adminToken = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET);
    residentToken = jwt.sign({ id: 2, role: 'RESIDENT' }, process.env.JWT_SECRET);
  });

  it('POST /api/visitors - should allow a resident to log a new visitor', async () => {
    const visitorData = { name: 'Cousin Bob', reason: 'Family Visit' };
    const created = { id: 1, ...visitorData, userId: 2, approved: false };
    mockVisitors.create.mockResolvedValue(created);

    const res = await request(app)
      .post('/api/visitors')
      .set('Authorization', `Bearer ${residentToken}`)
      .send(visitorData);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.approved).toBe(false);
  });

  it('PUT /api/visitors/:id/approve - should allow an admin to approve a visitor', async () => {
    const visitorId = 1;
    const updated = { id: visitorId, approved: true };
    mockVisitors.update.mockResolvedValue(updated);

    const res = await request(app)
      .put(`/api/visitors/${visitorId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.approved).toBe(true);
  });
});