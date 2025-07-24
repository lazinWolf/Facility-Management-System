const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'RESIDENT'
      }
    });

    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    
    res.status(500).json({ msg: 'Server error' });
  }
};


// // @desc    Get user profile
// // @route   GET /api/auth/profile
// // @access  Private
const getProfile = async (req, res) => {
  try {
    // req.user.id is available from the verifyToken middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      // Use select to exclude the password from the result
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        apartmentNo: true,
      }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// // @desc    Update user profile
// // @route   PUT /api/auth/profile
// // @access  Private
const updateProfile = async (req, res) => {
  const { name, apartmentNo } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        // Only update fields that are provided
        ...(name && { name }),
        ...(apartmentNo && { apartmentNo }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        apartmentNo: true,
      }
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


module.exports = { register, login, getProfile, updateProfile };
