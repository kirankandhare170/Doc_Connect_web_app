const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
// <-- FIX #1 (Use mailer.js)
require("dotenv").config();
const { sendAppointmentStatusMail } = require("../config/mailer");

// -----------------------------
// GET - All appointments for admin
// -----------------------------
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------
// PUT - Update appointment status (approve / reject / cancel)
// -----------------------------
router.put("/appointments/:id", async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatus = ["approved", "rejected", "cancelled", "pending"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Date formatting
    const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString("en-IN");

    /* -----------------------------
       Prepare Email Content
    ------------------------------ */
    const subject = `Your Appointment is ${status}`;
    const html = `
      <h2>Appointment ${status.toUpperCase()}</h2>
      <p>Hello <b>${appointment.patientName}</b>,</p>
      <p>Your appointment with:</p>
      <p><b>Dr. ${appointment.doctorName}</b> (${appointment.speciality})</p>
      <p>📅 Date: <b>${formattedDate}</b></p>
      <p>⏰ Time: <b>${appointment.timeSlot}</b></p>
      <p>Status has been updated to: <b>${status}</b>.</p>
      <br/>
      <p>Thank you for using <b>DocConnect</b>.</p>
    `;
    const text = `Hello ${appointment.patientName}, your appointment with Dr. ${appointment.doctorName} (${appointment.speciality}) on ${formattedDate} at ${appointment.timeSlot} has been ${status}.`;

    /* -----------------------------
       SEND EMAIL (safely)
    ------------------------------ */
    if (appointment.patientEmail) {
      try {
        await sendAppointmentStatusMail({
          toEmail: appointment.patientEmail,
          subject,
          html,
          text,
        });
        console.log(`Email sent to ${appointment.patientEmail} successfully.`);
      } catch (emailErr) {
        console.error("Error sending appointment email:", emailErr);
      }
    } else {
      console.warn(`No patient email found for appointment ID: ${appointment._id}`);
    }

    return res.json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      appointment,
    });

  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;