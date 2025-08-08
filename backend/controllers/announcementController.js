const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Resident & Admin: view all announcements
async function getAnnouncements(req, res) {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { creator: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [announcements, totalAnnouncements] = await prisma.$transaction([
      prisma.announcement.findMany({
        where: whereClause,
        include: { creator: { select: { name: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: skip,
        take: limitNum,
      }),
      prisma.announcement.count({ where: whereClause }),
    ]);

    res.json({
      data: announcements,
      currentPage: pageNum,
      totalPages: Math.ceil(totalAnnouncements / limitNum),
      totalCount: totalAnnouncements,
    });
  } catch (err) {
    console.error("Failed to fetch announcements:", err);
    res.status(500).json({ msg: 'Failed to fetch announcements' });
  }
}

// Admin: create a new announcement
async function createAnnouncement(req, res) {
  const { title, content } = req.body;
  const creatorId = req.user.id;
  try {
    const ann = await prisma.announcement.create({
      data: { title, content, creatorId }
    });
    res.status(201).json(ann);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create announcement' });
  }
}

// Admin: delete announcement
async function deleteAnnouncement(req, res) {
  const { id } = req.params;
  try {
    await prisma.announcement.delete({ where: { id: Number(id) } });
    res.json({ msg: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete announcement' });
  }
}

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
