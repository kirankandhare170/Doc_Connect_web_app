import React, { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("resetEmail");

  const changeHandler = async () => {
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://doc-connect-5g3k.onrender.com/api/v1/user/reset-password",
        { email, newPassword }
      );

      alert(res.data.message);
      localStorage.removeItem("resetEmail");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-600 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reset Password
        </h1>

        <p className="text-gray-600 text-sm mb-4 text-center">
          Enter a new password to secure your account
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />

        <button
          onClick={changeHandler}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-pink-300 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </section>
  );
}
