const request = require('supertest');
const jwt = require('jsonwebtoken');

// Define mocks for each model used in the test
const mockBookings = {
  findUnique: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
};
const mockFacilities = {
  findUnique: jest.fn(),
};

// Return both mock models from the PrismaClient mock
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    booking: mockBookings,
    facility: mockFacilities,
  })),
}));

const app = require('../server');

describe('Bookings API', () => {
  let residentToken;

  beforeEach(() => {
    jest.clearAllMocks();
    residentToken = jwt.sign({ id: 2, role: 'RESIDENT' }, process.env.JWT_SECRET);
  });

  it('POST /api/bookings - should allow a resident to book a facility', async () => {
    const bookingData = { facilityId: 1, date: new Date().toISOString(), slot: 'S_09_10' };
    const createdBooking = { id: 1, userId: 2, ...bookingData };

    // Configure all required mocks for the controller logic
    mockBookings.findUnique.mockResolvedValue(null);
    mockFacilities.findUnique.mockResolvedValue({ id: 1, capacity: 10 });
    mockBookings.count.mockResolvedValue(5);
    mockBookings.create.mockResolvedValue(createdBooking);

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${residentToken}`)
      .send(bookingData);

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe(1);
  });
});