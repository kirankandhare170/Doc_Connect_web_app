const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const cors = require('cors');
const connectCloudinary = require('./config/cloudinary');

dotenv.config();
const app = express();

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// CORS
app.use(
  cors({
    origin: [
      "https://doc-connect-app-inky.vercel.app",
      "https://doc-connect-admin.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API ROUTES ONLY (NO FRONTEND SERVING)
app.use('/api/v1', require('./routes/UserRoute'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/v1/admin', require('./routes/adminRoute'));

// Remove ALL static hosting
// Remove ALL index.html serving
// Backend should ONLY provide API routes

// Connect DB & Cloudinary
connectCloudinary();
connectDb();

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
