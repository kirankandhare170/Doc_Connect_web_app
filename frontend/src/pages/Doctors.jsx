import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DEFAULT_DOCTOR_IMAGE = "https://res.cloudinary.com/<your-cloud-name>/image/upload/v000000/default-doctor.png";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialityData, setSpecialityData] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://doc-connect-5g3k.onrender.com/api/v1/admin/admin/getdoctors");
        if (res.data.success) {
          setDoctors(res.data.doctors || []);

          const specialities = [
            ...new Set(res.data.doctors.map((doc) => doc.speciality)),
          ].map((spec) => ({ speciality: spec }));
          setSpecialityData(specialities);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors =
    selectedSpeciality === "All"
      ? doctors
      : doctors.filter((doc) => doc.speciality === selectedSpeciality);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500 animate-pulse">
        Loading doctors...
      </p>
    );
  }

  return (
    <section className="px-6 md:px-20 py-16 bg-gradient-to-b from-blue-50 to-white">

      {/* Header */}
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          All <span className="text-blue-600">Doctors</span>
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Browse and book appointments with trusted doctors by speciality.
        </p>
      </div>

      {/* Speciality Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-10 justify-center md:justify-start">
        <button
          onClick={() => setSelectedSpeciality("All")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition transform hover:scale-105 ${
            selectedSpeciality === "All"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>

        {specialityData.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedSpeciality(item.speciality)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition transform hover:scale-105 ${
              selectedSpeciality === item.speciality
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {item.speciality}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredDoctors.map((doc) => (
          <Link to={`/appointment/${doc._id}`} key={doc._id}>
            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition cursor-pointer text-center">

              <img
                src={doc.image || DEFAULT_DOCTOR_IMAGE}
                alt={doc.name}
                className="w-28 h-28 object-cover rounded-full mx-auto mb-3 shadow-sm"
              />

              <div className="flex justify-center mb-2">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    doc.available
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {doc.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="font-semibold text-gray-800 text-lg">{doc.name}</p>
              <p className="text-gray-500 text-sm">{doc.speciality}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Doctors;
