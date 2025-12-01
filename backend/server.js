const express = require('express')
const dotenv = require('dotenv')
const connectDb = require('./config/db')
const cors = require('cors')
const connectCloudinary = require('./config/cloudinary')

const path = require("path");

dotenv.config()
const app = express()

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Force Node.js to prefer IPv4

const _dirname = path.resolve();


app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173"],
  credentials: true
}));
//app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// middleware
app.use('/api/v1', require('./routes/UserRoute'))
app.use("/api/appointments", require('./routes/appointmentRoutes'));
app.use("/api/admin", require('./routes/admin'));
app.use('/api/v1', require('./routes/adminRoute'))
//app.use('/api/v1', require('./Route/todoroute'))




// API routes


// Admin frontend



connectCloudinary()
// port 
connectDb()
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server  running on port ${port}`)
})