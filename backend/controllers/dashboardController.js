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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch all relevant records from the last 7 days
    const [complaintsLast7Days, visitorsLast7Days] = await Promise.all([
        prisma.complaint.findMany({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.visitor.findMany({ where: { createdAt: { gte: sevenDaysAgo } } })
    ]);

    // Process the data in JavaScript to create daily counts
    const dailyActivity = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayString = d.toISOString().split('T')[0];
        dailyActivity[dayString] = { complaints: 0, visitors: 0 };
    }

    complaintsLast7Days.forEach(c => {
        const dayString = c.createdAt.toISOString().split('T')[0];
        if (dailyActivity[dayString]) {
            dailyActivity[dayString].complaints++;
        }
    });

    visitorsLast7Days.forEach(v => {
        const dayString = v.createdAt.toISOString().split('T')[0];
        if (dailyActivity[dayString]) {
            dailyActivity[dayString].visitors++;
        }
    });
    
    const sortedActivity = Object.entries(dailyActivity).sort().reverse();
    const activityLabels = sortedActivity.map(([day]) => new Date(day).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }));
    const complaintCounts = sortedActivity.map(([, counts]) => counts.complaints);
    const visitorCounts = sortedActivity.map(([, counts]) => counts.visitors);

    // 3. Structure and send the response
    res.json({
      stats: {
        totalResidents,
        pendingComplaints,
        pendingVisitors,
        totalUnpaidAmount: unpaidBillsResult._sum.amount || 0,
      },
      charts: {
        dailyActivity: {
            labels: activityLabels,
            complaints: complaintCounts,
            visitors: visitorCounts,
        }
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