const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// List all facilities
async function getFacilities(req, res) {
  try {
    const facilities = await prisma.facility.findMany();
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch facilities' });
  }
}

// Admin: create facility
async function createFacility(req, res) {
  const { name, description, capacity } = req.body;
  try {
    const facility = await prisma.facility.create({
      data: { name, description, capacity }
    });
    res.status(201).json(facility);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create facility' });
  }
}

module.exports = { getFacilities, createFacility };
