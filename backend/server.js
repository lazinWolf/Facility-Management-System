require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');



const app = express();
const prisma = new PrismaClient();


app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/complaints', complaintRoutes);

const billRoutes = require('./routes/billRoutes');
app.use('/api/bills', billRoutes);

const visitorRoutes = require('./routes/visitorRoutes');
app.use('/api/visitors', visitorRoutes);

const facilityRoutes = require('./routes/facilityRoutes');
const bookingRoutes  = require('./routes/bookingRoutes');

app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes);

const announcementRoutes = require('./routes/announcementRoutes');
app.use('/api/announcements', announcementRoutes);


app.get('/', (req, res) => {
  res.send('Facility Management API');
});

const PORT = process.env.PORT || 5000;


if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for testing purposes
module.exports = app;
