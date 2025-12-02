const cloudinary = require('cloudinary').v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/userModel"); // Users
const Doctor = require("../models/doctorsModel");
const Appointment = require("../models/Appointment");

// Default images
const DEFAULT_DOCTOR_IMAGE = "https://res.cloudinary.com/<your-cloud-name>/image/upload/v000000/default-doctor.png";
const DEFAULT_PROFILE = "https://res.cloudinary.com/<your-cloud-name>/image/upload/v000000/default-profile.png";

// ------------------- ADD DOCTOR -------------------
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address, available } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Please fill all the required details" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password too short" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    // Upload image only if provided
    let imageUrl = DEFAULT_DOCTOR_IMAGE;
    if (imageFile) {
      try {
        const result = await cloudinary.uploader.upload(imageFile.path, { folder: "doctor_profiles" });
        imageUrl = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err.message);
      }
    }

    const doctor = new Doctor({
      name,
      email,
      image: imageUrl,
      password: hashpassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available: available ?? true,
      date: Date.now()
    });

    await doctor.save();
    res.json({ success: true, message: "Doctor added successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Add doctor error", error: error.message });
  }
};

// ------------------- ADMIN LOGIN -------------------
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.SECRET_KEY);
      return res.json({ success: true, message: "Login success", token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- GET ALL DOCTORS -------------------
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    const safeDoctors = doctors.map(doc => ({
      ...doc.toObject(),
      image: doc.image || DEFAULT_DOCTOR_IMAGE
    }));

    res.json({ success: true, message: "Get doctors successfully", doctors: safeDoctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- GET SINGLE DOCTOR -------------------
const getSingleDoctor = async (req, res) => {
  try {
    const { docId } = req.params;
    const doctor = await Doctor.findById(docId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    res.json({ success: true, doctor: { ...doctor.toObject(), image: doctor.image || DEFAULT_DOCTOR_IMAGE } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- DELETE DOCTOR -------------------
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    await Doctor.findByIdAndDelete(id);
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- CHANGE AVAILABILITY -------------------
const changeAvailability = async (req, res) => {
  try {
    const { userId } = req.body;
    const doctor = await Doctor.findById(userId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    doctor.available = !doctor.available;
    await doctor.save();
    res.json({ success: true, message: "Availability changed", available: doctor.available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to change availability" });
  }
};

// ------------------- GET DASHBOARD DATA -------------------
const getDashboardData = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    const doctors = await Doctor.find({});
    const appointments = await Appointment.find({}).sort({ appointmentDate: -1 });

    const safeDoctors = doctors.map(doc => ({ ...doc.toObject(), image: doc.image || DEFAULT_DOCTOR_IMAGE }));
    const safeUsers = users.map(user => ({ ...user.toObject(), image: user.image || DEFAULT_PROFILE }));

    res.json({ success: true, users: safeUsers, doctors: safeDoctors, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- UPDATE APPOINTMENT STATUS -------------------
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();
    res.json({ success: true, message: `Appointment ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- GET ALL USERS -------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    const safeUsers = users.map(user => ({ ...user.toObject(), image: user.image || DEFAULT_PROFILE }));
    res.json({ success: true, users: safeUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- GET ALL APPOINTMENTS -------------------
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ appointmentDate: -1 });
    res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addDoctor,
  loginAdmin,
  getDoctors,
  getSingleDoctor,
  deleteDoctor,
  changeAvailability,
  getDashboardData,
  updateAppointmentStatus,
  getAllUsers,
  getAllAppointments
};
