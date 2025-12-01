import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const verifyHandler = async () => {
    if (!otp || otp.length < 4) {
      alert("Enter a valid OTP!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://doc-connect-5g3k.onrender.com/api/v1/user/verify-reset-otp",
        { email, otp: otp.toString() }
      );

      alert(res.data.message);
      localStorage.setItem("verifiedResetEmail", email); // optional flag
      navigate("/reset-password");
    } catch (err) {
      console.log(err);
      alert("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-emerald-600 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Verify OTP
        </h1>

        <p className="text-center text-gray-600 mb-4">
          OTP sent to <span className="font-semibold">{email}</span>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 text-center text-xl tracking-widest placeholder-gray-400 mb-4"
        />

        <button
          onClick={verifyHandler}
          disabled={loading}
          className={`w-full py-3 text-white rounded-xl font-semibold transition ${
            loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </section>
  );
}
