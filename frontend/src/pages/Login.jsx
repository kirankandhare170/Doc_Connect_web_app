import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ---------- Email/Password Login ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://doc-connect-5g3k.onrender.com/api/v1/user/login", {
        email,
        password,
      });

      alert(res.data.message);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userEmail", res.data.user.email);

      navigate("/");
    } catch (error) {
      console.log("Login error:", error);
      alert("Invalid Login");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Google Login ----------
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("https://doc-connect-5g3k.onrender.com/api/v1/user/google-auth", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userEmail", res.data.user.email);

      alert(`Welcome ${res.data.user.name}! Logged in with Google`);
      navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>

        {/* ---------- Email Login Form ---------- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-xl font-semibold transition ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ---------- OR Separator ---------- */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-400 font-semibold">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* ---------- Google Login ---------- */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google login failed")}
          >
            <div className="flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer hover:shadow-md transition">
              <FcGoogle className="mr-2 text-2xl" />
              <span className="text-gray-700 font-medium">Login with Google</span>
            </div>
          </GoogleLogin>
        </div>

        {/* ---------- Register & Forgot Password ---------- */}
        <p className="mt-4 text-center text-gray-700 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 cursor-pointer hover:underline font-medium"
          >
            Register here
          </span>
        </p>

        <p
          className="text-indigo-600 mt-3 cursor-pointer text-sm text-center hover:underline"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>
      </div>
    </section>
  );
}
