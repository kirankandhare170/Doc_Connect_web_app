import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/Admincontex";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { baseUrl, atoken } = useContext(AdminContext);

  // State
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await axios.get(`${baseUrl}/api/v1/admin/users`, {
          headers: { Authorization: `Bearer ${atoken}` },
        });
        const doctorsRes = await axios.get(`${baseUrl}/api/v1/admin/getdoctors`, {
          headers: { Authorization: `Bearer ${atoken}` },
        });
        const appointmentsRes = await axios.get(
          `${baseUrl}/api/v1/admin/appointments`,
          { headers: { Authorization: `Bearer ${atoken}` } }
        );

        setUsers(usersRes.data.users || []);
        setDoctors(doctorsRes.data.doctors || []);
        setAppointments(appointmentsRes.data.appointments || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseUrl, atoken]);

  // Update appointment status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${baseUrl}/api/v1/admin/appointments/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${atoken}` } }
      );
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
      );
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  // Toggle doctor availability
  const toggleAvailability = async (id) => {
    try {
      await axios.patch(
        `${baseUrl}/api/v1/admin/change`,
        { userId: id },
        { headers: { Authorization: `Bearer ${atoken}` } }
      );
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, available: !doc.available } : doc
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update availability");
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500 animate-pulse text-lg">
        Loading...
      </p>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full min-h-screen bg-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your system performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
        <div className="bg-blue-500 text-white p-4 md:p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm md:text-base">Total Users</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">{users.length}</h2>
        </div>
        <div className="bg-green-500 text-white p-4 md:p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm md:text-base">Total Doctors</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">{doctors.length}</h2>
        </div>
        <div className="bg-purple-500 text-white p-4 md:p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm md:text-base">Total Appointments</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">{appointments.length}</h2>
        </div>
        <div className="bg-yellow-500 text-white p-4 md:p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm md:text-base">Total Revenue</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            ₹{appointments.reduce((acc, curr) => acc + (curr.fees || 0), 0)}
          </h2>
        </div>
      </div>

      {/* Users & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Recent Users */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <table className="w-full text-left text-sm md:text-base">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(-5).reverse().map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Latest Appointments */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Latest Appointments</h2>
          <table className="w-full text-left text-sm md:text-base">
            <thead>
              <tr className="border-b">
                <th className="py-2">Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(-5).reverse().map((appt) => (
                <tr key={appt._id} className="border-b hover:bg-gray-50 transition">
                  <td>{appt.patientName}</td>
                  <td>{appt.doctorName}</td>
                  <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm ${appt.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : appt.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="flex flex-wrap gap-1">
                    {appt.status !== "confirmed" && (
                      <button
                        onClick={() => handleStatusChange(appt._id, "confirmed")}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs md:text-sm"
                      >
                        Approve
                      </button>
                    )}
                    {appt.status !== "cancelled" && (
                      <button
                        onClick={() => handleStatusChange(appt._id, "cancelled")}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs md:text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor List */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Doctor List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-gray-50 p-4 rounded-xl flex flex-col items-center shadow hover:shadow-lg transition"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-gray-200"
              />
              <p className="text-lg font-semibold">{doc.name}</p>
              <p className="text-sm text-gray-500">{doc.speciality}</p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={doc.available}
                  onChange={() => toggleAvailability(doc._id)}
                  className="w-5 h-5 text-green-500 rounded"
                />
                <span className="text-sm text-gray-700">Available</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
