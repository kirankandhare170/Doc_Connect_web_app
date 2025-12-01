const express = require("express");
const upload = require("../middlewares/multer");
const router = express.Router();
const {
  addDoctor,
  loginAdmin,
  getDoctors,
  changeAvailability,
  getDashboardData,
  getAllUsers,
  getAllAppointments,
  updateAppointmentStatus,
  toggleDoctorAvailability,
   deleteDoctor,
  getSingleDoctor,
   
} = require("../Collections/admincollection");

// ------------------- ADMIN AUTH -------------------
router.post("/admin/login", loginAdmin);

// ------------------- DOCTORS -------------------
router.post("/admin/add-doctor", upload.single("image"), addDoctor);
router.get("/admin/getdoctors", getDoctors);
router.patch("/admin/change", changeAvailability); // toggle availability
router.delete("/admin/delete-doctor/:id", deleteDoctor);
router.get("/admin/getdoctor/:docId", getSingleDoctor);

// ------------------- DASHBOARD -------------------
router.get("/admin/dashboard", getDashboardData);

// ------------------- USERS -------------------
router.get("/admin/users", getAllUsers);

// ------------------- APPOINTMENTS -------------------
router.get("/admin/appointments", getAllAppointments);
router.put("/admin/appointments/:id", updateAppointmentStatus);

module.exports = router;
