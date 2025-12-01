import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

const Appointment = () => {
  const { docId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
  });

  // Fetch single doctor by ID
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/admin/getdoctor/${docId}`
        );
        console.log(res);
        if (res.data.success) {
          setDoctor(res.data.doctor);
        }
      } catch (error) {
        console.error("Failed to fetch doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [docId]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  if (!doctor)
    return (
      <p className="text-center py-10 text-red-500 font-semibold">
        Doctor not found
      </p>
    );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedInEmail = localStorage.getItem("userEmail");
    if (formData.email !== loggedInEmail) {
      toast.error("Use the email of your logged-in account!");
      return;
    }

    if (!formData.name || !formData.email || !formData.date || !formData.time) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Send appointment to backend
      await axios.post("http://localhost:3000/api/appointments", {
        doctorId: doctor._id,
        doctorName: doctor.name,
        speciality: doctor.speciality,
        ...formData,
      });

      // Send Email notification
      await emailjs.send(
        "service_88lqnls",
        "template_wlmsvgh",
        {
          name: formData.name,
          email: formData.email,
          date: formData.date,
          time: formData.time,
          doctorName: doctor.name,
          speciality: doctor.speciality,
        },
        "n3JD2HNk5x_NNp7M-"
      );

      toast.success("Appointment booked successfully!");
      setFormData({ name: "", email: "", date: "", time: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-20 py-12">
      {/* Doctor Details */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-2xl shadow-md">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-40 h-40 object-cover rounded-full"
        />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{doctor.name}</h1>
          <p className="text-blue-600">{doctor.speciality}</p>
          <p>{doctor.about}</p>
          <p>Degree: {doctor.degree}</p>
          <p>Experience: {doctor.experience}</p>
          <p>Fees: ₹{doctor.fees}</p>
        </div>
      </div>

      {/* Form */}
      <div className="mt-10 bg-white p-8 rounded-2xl shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Book an Appointment
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">-- Select Time Slot --</option>
            {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map(
              (slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              )
            )}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
