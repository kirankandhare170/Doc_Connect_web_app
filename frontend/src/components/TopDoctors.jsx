import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TopDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("https://doc-connect-5g3k.onrender.com/api/v1/admin/admin/getdoctors");
        if (res.data.success) setDoctors(res.data.doctors);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="px-6 md:px-20 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Top Doctors to Book
      </h1>
      <p className="text-gray-600 mb-8">Simply browse through the top trusted doctors</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {doctors.slice(0, 10).map((item) => (
          <div
            onClick={() => navigate(`/appointment/${item._id}`)}
            key={item._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer text-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
            />
            <div className="flex justify-center mb-2">
              <span className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                {item.available ? "Available" : "Unavailable"}
              </span>
            </div>
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-gray-500 text-sm">{item.speciality}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow">
          More
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;
