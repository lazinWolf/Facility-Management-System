const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all residents
// @route   GET /api/admin/residents
// @access  Private/Admin
const getResidents = async (req, res) => {
  try {
    const residents = await prisma.user.findMany({
      where: {
        role: 'RESIDENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        apartmentNo: true,
        role: true,
      }
    });
    res.json(residents);
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