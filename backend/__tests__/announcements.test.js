const request = require('supertest');
const jwt = require('jsonwebtoken');

// 1. Define an object to hold the mock functions.
// The variable name MUST start with "mock" to be accessible by jest.mock().
const mockAnnouncements = {
  findMany: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

// 2. Mock the Prisma client to return the mock object.
// This is hoisted by Jest and can now safely access 'mockAnnouncements'.
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    announcement: mockAnnouncements,
  })),
}));

// 3. IMPORTANT: Require the app *after* the mocks are defined.
const app = require('../server');

describe('Announcements API', () => {
  let adminToken, residentToken;

  beforeEach(() => {
    // Clear mock history before each test to ensure they are independent
    jest.clearAllMocks();

    // Create fresh tokens for each test
    adminToken = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET);
    residentToken = jwt.sign({ id: 2, role: 'RESIDENT' }, process.env.JWT_SECRET);
  });

  it('GET /api/announcements - should fetch all announcements for a resident', async () => {
    const mockData = [{ id: 1, title: 'Meeting', content: 'A meeting will be held.' }];
    
    // Configure the mock's return value for this specific test
    mockAnnouncements.findMany.mockResolvedValue(mockData);

    const res = await request(app)
      .get('/api/announcements')
      .set('Authorization', `Bearer ${residentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockData);
    expect(mockAnnouncements.findMany).toHaveBeenCalledTimes(1);
  });

  it('POST /api/announcements - should allow an admin to create an announcement', async () => {
    const announcementData = { title: 'Pool Maintenance', content: 'Closed on Friday.' };
    const createdData = { id: 2, ...announcementData, creatorId: 1 };
    
    // Configure the mock's return value for this specific test
    mockAnnouncements.create.mockResolvedValue(createdData);

    const res = await request(app)
      .post('/api/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(announcementData);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(announcementData.title);
    expect(mockAnnouncements.create).toHaveBeenCalledWith({
      data: {
        title: announcementData.title,
        content: announcementData.content,
        creatorId: 1, // The admin's ID from the token
      },
    });
  });

  it('POST /api/announcements - should not allow a resident to create an announcement', async () => {
    const announcementData = { title: 'Resident Announcement', content: 'This should fail.' };

    const res = await request(app)
      .post('/api/announcements')
      .set('Authorization', `Bearer ${residentToken}`) // Using resident token
      .send(announcementData);

    // Expecting a 403 Forbidden status because of the 'isAdmin' middleware
    expect(res.statusCode).toBe(403);
    // Ensure the database was not called
    expect(mockAnnouncements.create).not.toHaveBeenCalled();
  });
});