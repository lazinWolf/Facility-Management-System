const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Resident: book a slot
async function createBooking(req, res) {
  const { facilityId, date, slot } = req.body;
  const userId = req.user.id;

  try {
    // Ensure no double-booking
    const exists = await prisma.booking.findUnique({
      where: { facilityId_date_slot_userId: { facilityId, date: new Date(date), slot, userId } }
    });
    if (exists) return res.status(400).json({ msg: 'You have already booked this slot' });

    // Capacity check
    const count = await prisma.booking.count({
      where: { facilityId, date: new Date(date), slot }
    });
    const facility = await prisma.facility.findUnique({ where: { id: facilityId } });
    if (count >= facility.capacity) {
      return res.status(400).json({ msg: 'Slot is full' });
    }

    const booking = await prisma.booking.create({
      data: { facilityId, userId, date: new Date(date), slot }
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Failed to create booking' });
  }
}

// Resident: view own bookings
async function getMyBookings(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { facility: true },
      orderBy: { date: 'asc' }
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch bookings' });
  }
}

module.exports = { createBooking, getMyBookings };
