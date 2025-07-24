const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockFacilities = {
  findMany: jest.fn(),
  create: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    facility: mockFacilities,
  })),
}));

const app = require('../server');

describe('Facilities API', () => {
  let adminToken, residentToken;

  beforeEach(() => {
    jest.clearAllMocks();
    adminToken = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET);
    residentToken = jwt.sign({ id: 2, role: 'RESIDENT' }, process.env.JWT_SECRET);
  });

  it('GET /api/facilities - should fetch all facilities for an authenticated user', async () => {
    const mockData = [{ id: 1, name: 'Swimming Pool', capacity: 20 }];
    mockFacilities.findMany.mockResolvedValue(mockData);

    const res = await request(app)
      .get('/api/facilities')
      .set('Authorization', `Bearer ${residentToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe('Swimming Pool');
  });

  it('POST /api/facilities - should allow an admin to create a facility', async () => {
    const facilityData = { name: 'Gym', description: 'Fitness Center', capacity: 15 };
    mockFacilities.create.mockResolvedValue({ id: 2, ...facilityData });

    const res = await request(app)
      .post('/api/facilities')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(facilityData);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Gym');
  });
});