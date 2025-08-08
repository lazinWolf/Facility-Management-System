const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all residents
// @route   GET /api/admin/residents
// @access  Private/Admin
// @desc    Get all residents with filtering, sorting, and pagination
// @route   GET /api/admin/residents
// @access  Private/Admin
const getResidents = async (req, res) => {
  try {
    // Destructure query parameters with default values
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'name', 
      sortOrder = 'asc' 
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build the search filter for Prisma
    const whereClause = {
      role: 'RESIDENT',
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { apartmentNo: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    
    // Perform two queries in parallel: one for the data, one for the total count
    const [residents, totalResidents] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          apartmentNo: true,
          role: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: skip,
        take: limitNum,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    res.json({
      residents,
      currentPage: pageNum,
      totalPages: Math.ceil(totalResidents / limitNum),
      totalResidents,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a resident's profile
// @route   PUT /api/admin/residents/:id
// @access  Private/Admin
const updateResident = async (req, res) => {
  const { name, email, apartmentNo, role } = req.body;
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  try {
    // Ensure the user being updated is a resident
    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToUpdate) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Admins should not be able to change a user's role away from RESIDENT through this endpoint
    // to prevent accidental privilege escalation.
    if (role && role !== 'RESIDENT') {
        return res.status(400).json({ msg: 'Cannot change role from RESIDENT via this endpoint' });
    }

    const updatedResident = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        apartmentNo,
      },
      select: {
        id: true,
        name: true,
        email: true,
        apartmentNo: true,
        role: true,
      }
    });
    res.json(updatedResident);
  } catch (err) {
    console.error(err.message);
    // Handle potential unique constraint violation for email
    if (err.code === 'P2002' && err.meta?.target.includes('email')) {
      return res.status(400).json({ msg: 'Email is already in use' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a resident
// @route   DELETE /api/admin/residents/:id
// @access  Private/Admin
const deleteResident = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToDelete) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // To maintain data integrity, you might want to check for related records 
    // (complaints, bills, etc.) and decide how to handle them before deleting.
    // For now, we will proceed with deletion.

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ msg: 'Resident deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


module.exports = { getResidents, updateResident, deleteResident };