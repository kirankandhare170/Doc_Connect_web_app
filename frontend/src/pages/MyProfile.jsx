import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

export default function MyProfile() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  // Fetch user info
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `https://doc-connect-5g3k.onrender.com/api/v1/user/getuserprofile/${userId}`
      );
      const userData = res.data.user;
      setUser(userData);
      setName(userData.name);
      setPhone(userData.phone);
      setEmail(userData.email);
      if (userData.image) localStorage.setItem("userImage", userData.image);
    } catch (error) {
      console.log("Fetch profile error:", error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedImage = localStorage.getItem("userImage");

    if (storedUser) {
      setUser(storedUser);
      setName(storedUser.name || "");
      setEmail(storedUser.email || "");
      setPhone(storedUser.phone || "");
      setImage(storedImage || storedUser.image || null);
    }

    fetchProfile();
  }, []);

  // Update profile
  const updateHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      if (image) formData.append("image", image);

      const res = await axios.post(
        "https://doc-connect-5g3k.onrender.com/api/v1/user/updateProfile",
        formData
      );

      alert(res.data.message);

      if (res.data.user.image) {
        localStorage.setItem("userImage", res.data.user.image);
      }

      fetchProfile();
      setImage(null);
    } catch (error) {
      console.log("Update profile error:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="mt-24 p-6 md:p-10 max-w-xl mx-auto bg-white shadow-xl rounded-2xl">
    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
      My Profile
    </h1>

    <form onSubmit={updateHandler} className="space-y-6">
      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <label htmlFor="profile-img" className="cursor-pointer">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user.image || assets.upload_icon
            }alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 hover:border-blue-400 transition"
          />
        </label>
        <input
          id="profile-img"
          type="file"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
        <p className="text-gray-500 text-sm mt-2">Click image to change</p>
      </div>

      {/* Name */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  </div>
);
}
