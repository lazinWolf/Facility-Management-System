const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Resident: get own bills
const getMyBills = async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      where: { userId: req.user.id },
      orderBy: { dueDate: 'asc' }
    });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch bills' });
  }
};

// Admin: get all bills
const getAllBills = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'dueDate', sortOrder = 'desc' } = req.query;
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

    const [bills, totalBills] = await prisma.$transaction([
      prisma.bill.findMany({
        where: whereClause,
        include: { user: { select: { name: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: skip,
        take: limitNum,
      }),
      prisma.bill.count({ where: whereClause }),
    ]);

    res.json({
      data: bills,
      currentPage: pageNum,
      totalPages: Math.ceil(totalBills / limitNum),
      totalCount: totalBills,
    });
  } catch (err) {
    console.error("Failed to fetch bills:", err);
    res.status(500).json({ msg: 'Failed to fetch all bills' });
  }
};

// Admin: create a new bill for a resident
const createBill = async (req, res) => {
  const { userId, title, amount, dueDate } = req.body;
  try {
    const bill = await prisma.bill.create({
      data: {
        userId,
        title,
        amount,
        dueDate: new Date(dueDate)
      }
    });
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create bill' });
  }
};

// Admin: update or delete bill
const updateBill = async (req, res) => {
  const { id } = req.params;
  const { title,amount, dueDate, status } = req.body;
  try {
    const bill = await prisma.bill.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }), 
        ...(amount !== undefined && { amount }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(status && { status })
      }
    });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update bill' });
  }
};

const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.bill.delete({ where: { id: parseInt(id) } });
    res.json({ msg: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete bill' });
  }
};

// Resident: pay a bill (status → paid)
const payBill = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await prisma.bill.update({
      where: { id: parseInt(id) },
      data: { status: 'paid' }
    });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to pay bill' });
  }
};

module.exports = {
  getMyBills,
  getAllBills,
  createBill,
  updateBill,
  deleteBill,
  payBill
};
