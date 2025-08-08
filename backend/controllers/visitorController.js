const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Resident: submit a visitor entry (pending approval)
const createVisitor = async (req, res) => {
  const { name, reason } = req.body;
  try {
    const visitor = await prisma.visitor.create({
      data: {
        name,
        reason,
        userId: req.user.id
      }
    });
    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to log visitor' });
  }
};

// Resident: view own visitor log
const getMyVisitors = async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch visitors' });
  }
};

// Admin: view all visitor entries
const getAllVisitors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { reason: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [visitors, totalVisitors] = await prisma.$transaction([
      prisma.visitor.findMany({
        where: whereClause,
        include: { user: { select: { name: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: skip,
        take: limitNum,
      }),
      prisma.visitor.count({ where: whereClause }),
    ]);

    res.json({
      data: visitors,
      currentPage: pageNum,
      totalPages: Math.ceil(totalVisitors / limitNum),
      totalCount: totalVisitors,
    });
  } catch (err) {
    console.error("Failed to fetch visitors:", err);
    res.status(500).json({ msg: 'Failed to fetch all visitors' });
  }
};


// Admin: approve a visitor entry
const approveVisitor = async (req, res) => {
  const { id } = req.params;
  try {
    const visitor = await prisma.visitor.update({
      where: { id: parseInt(id) },
      data: { approved: true }
    });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to approve visitor' });
  }
};

module.exports = {
  createVisitor,
  getMyVisitors,
  getAllVisitors,
  approveVisitor
};
