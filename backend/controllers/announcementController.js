const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Resident & Admin: view all announcements
async function getAnnouncements(req, res) {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        creator: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(announcements);
  } catch (err) {
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
