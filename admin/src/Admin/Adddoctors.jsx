import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";

const AddDoctors = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("1 year");
  const [about, setAbout] = useState("");
  const [fees, setFees] = useState("");
  const [address, setAddress] = useState("");

  const { baseUrl } = useContext(AdminContext);

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("address", address);
      formData.append("about", about);

      const { data } = await axios.post(
        `${baseUrl}/api/v1/admin/admin/add-doctor`,
        formData
      );

      alert(data.message);

      // Reset form
      setDocImg(null);
      setName("");
      setEmail("");
      setPassword("");
      setSpeciality("General Physician");
      setDegree("");
      setExperience("1 year");
      setAbout("");
      setFees("");
      setAddress("");
    } catch (error) {
      console.error(error);
      alert("Failed to add doctor.");
    }
  };

  const inputFields = [
    { label: "Doctor Name", value: name, setter: setName, type: "text", placeholder: "Enter doctor's name" },
    { label: "Doctor Email", value: email, setter: setEmail, type: "email", placeholder: "Enter email" },
    { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Enter password" },
    { label: "Degree", value: degree, setter: setDegree, type: "text", placeholder: "e.g. MBBS, MD" },
    { label: "Fees", value: fees, setter: setFees, type: "number", placeholder: "Consultation fees" },
    { label: "Address", value: address, setter: setAddress, type: "text", placeholder: "Clinic address" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10 flex justify-center">
      <form
        onSubmit={onsubmitHandler}
        className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Add Doctor
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-8">
          <label
            htmlFor="doc-img"
            className="cursor-pointer flex flex-col items-center"
          >
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Doctor"
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-gray-300 shadow-md"
            />
            <p className="text-gray-600 text-sm mt-2">Tap to upload picture</p>
          </label>
          <input
            type="file"
            id="doc-img"
            hidden
            accept="image/*"
            onChange={(e) => setDocImg(e.target.files[0])}
          />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {inputFields.map((field, index) => (
            <div key={index}>
              <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
              <input
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}

          {/* Speciality */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Speciality</label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>General Physician</option>
              <option>Cardiologist</option>
              <option>Dermatologist</option>
              <option>Neurologist</option>
              <option>Orthopedic</option>
              <option>Pediatrician</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i}>{i + 1} {i === 0 ? "year" : "years"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-1">About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            placeholder="Write about the doctor"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctors;
