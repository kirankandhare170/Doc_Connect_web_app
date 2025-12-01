import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
   const { baseUrl } = useContext(AdminContext);
  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/admin/appointments`);
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${baseUrl}/api/admin/appointments/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
      );
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update status");
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-500 animate-pulse">Loading...</p>;
  }

  return (
    <div className="px-4 md:px-16 py-12 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">All Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block shadow-lg rounded-lg">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Doctor</th>
                  <th className="px-6 py-3">Speciality</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3">{appt.patientName}</td>
                    <td className="px-6 py-3">{appt.doctorName}</td>
                    <td className="px-6 py-3">{appt.speciality}</td>
                    <td className="px-6 py-3">{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                    <td className="px-6 py-3">{appt.timeSlot}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          appt.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : appt.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleStatusChange(appt._id, "approved")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(appt._id, "rejected")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusChange(appt._id, "cancelled")}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col md:hidden gap-4">
            {appointments.map((appt) => (
              <div key={appt._id} className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">{appt.patientName}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      appt.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : appt.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Doctor: {appt.doctorName} ({appt.speciality})
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Date: {new Date(appt.appointmentDate).toLocaleDateString()} | Time: {appt.timeSlot}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleStatusChange(appt._id, "approved")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(appt._id, "rejected")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange(appt._id, "cancelled")}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllAppointments;