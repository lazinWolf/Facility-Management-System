const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get aggregated stats and data for the admin dashboard
// @route   GET /api/dashboard
// @access  Private/Admin
const getDashboardData = async (req, res) => {
  try {
    // 1. Get Key Stats in parallel
    const [
      totalResidents,
      pendingComplaints,
      pendingVisitors,
      unpaidBillsResult,
      recentComplaints,
    ] = await prisma.$transaction([
      prisma.user.count({ where: { role: 'RESIDENT' } }),
      prisma.complaint.count({ where: { status: 'Pending' } }),
      prisma.visitor.count({ where: { approved: false } }),
      prisma.bill.aggregate({
        _sum: { amount: true },
        where: { status: 'unpaid' },
      }),
      prisma.complaint.findMany({
        where: { status: 'Pending' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      }),
    ]);

    // 2. Get data for charts
    const complaintsByStatus = await prisma.complaint.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // 3. Structure and send the response
    res.json({
      stats: {
        totalResidents,
        pendingComplaints,
        pendingVisitors,
        totalUnpaidAmount: unpaidBillsResult._sum.amount || 0,
      },
      charts: {
        complaintsByStatus: complaintsByStatus.map(item => ({
          status: item.status,
          count: item._count.status,
        })),
      },
      recentActivity: {
        recentComplaints,
      },
    });
  } catch (err) {
    console.error('Dashboard Data Error:', err);
    res.status(500).json({ msg: 'Server error while fetching dashboard data' });
  }
};

module.exports = { getDashboardData };