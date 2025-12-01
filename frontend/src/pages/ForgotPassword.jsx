import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtpHandler = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://doc-connect-5g3k.onrender.com/api/v1/user/forgot-password",
        { email }
      );

      alert(res.data.message);
      localStorage.setItem("resetEmail", email);
      window.location.href = "/verify-reset-otp";
    } catch (error) {
      console.error(error);
      alert("Email not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Forgot Password
        </h1>

        <p className="text-gray-600 text-sm mb-4 text-center">
          Enter your registered email to receive a password reset OTP.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <button
          onClick={sendOtpHandler}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </section>
  );
}
