const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createComplaint = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        userId
      }
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create complaint' });
  }
};

const getUserComplaints = async (req, res) => {
  const userId = req.user.id;

  try {
    const complaints = await prisma.complaint.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch complaints' });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { status: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [complaints, totalComplaints] = await prisma.$transaction([
      prisma.complaint.findMany({
        where: whereClause,
        include: { user: { select: { name: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: skip,
        take: limitNum,
      }),
      prisma.complaint.count({ where: whereClause }),
    ]);

    res.json({
      data: complaints,
      currentPage: pageNum,
      totalPages: Math.ceil(totalComplaints / limitNum),
      totalCount: totalComplaints,
    });
  } catch (err) {
    console.error("Failed to fetch complaints:", err);
    res.status(500).json({ msg: 'Failed to fetch all complaints' });
  }
};

const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update complaint' });
  }
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus
};
