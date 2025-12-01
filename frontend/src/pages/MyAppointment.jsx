
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const email = localStorage.getItem("userEmail"); // store email at login
  const [loading, setLoading] = useState(true);

  // Fetch user's appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://doc-connect-5g3k.onrender.com/api/appointments/${email}`);
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Cancel appointment
  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await axios.delete(`https://doc-connect-5g3k.onrender.com/api/appointments/cancel/${id}`);
      alert(res.data.message);
      fetchAppointments(); // refresh after cancel
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left text-gray-800">
        My Appointments
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600 text-center">You have no appointments.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="border p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow hover:shadow-lg transition"
            >
              <div className="mb-4 md:mb-0">
                <p>
                  <span className="font-semibold">Doctor:</span> {appt.doctorName}
                </p>
                <p>
                  <span className="font-semibold">Speciality:</span> {appt.speciality}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {appt.appointmentDate}
                </p>
                <p>
                  <span className="font-semibold">Time:</span> {appt.timeSlot}
                </p>
              </div>

              <button
                onClick={() => cancelAppointment(appt._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition self-end md:self-auto"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
