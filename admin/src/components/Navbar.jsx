import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { atoken, setAtoken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    setAtoken("");
    localStorage.removeItem("atoken");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">Admin Dashboard</h1>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {atoken ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-700 px-4 py-3 space-y-3 animate-fadeIn">
          {atoken ? (
            <button
              onClick={logout}
              className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
