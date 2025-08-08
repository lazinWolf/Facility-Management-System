const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// List all facilities
async function getFacilities(req, res) {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [facilities, totalFacilities] = await prisma.$transaction([
      prisma.facility.findMany({
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
        skip: skip,
        take: limitNum,
      }),
      prisma.facility.count({ where: whereClause }),
    ]);

    res.json({
      data: facilities,
      currentPage: pageNum,
      totalPages: Math.ceil(totalFacilities / limitNum),
      totalCount: totalFacilities,
    });
  } catch (err) {
    console.error("Failed to fetch facilities:", err);
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
