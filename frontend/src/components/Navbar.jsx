import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "./../assets/assets";
import axios from "axios";

const Nav = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userImage, setUserImage] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchUser = async () => {
    if (!token || !userId) return;

    const localImage = localStorage.getItem("userImage");
    if (localImage) {
      setUserImage(localImage);
      return;
    }

    try {
      const res = await axios.post(
        "https://doc-connect-5g3k.onrender.com/api/v1/user/getuserprofile",
        { userId }
      );
      const image = res.data.user.image;
      localStorage.setItem("userImage", image);
      setUserImage(image);
    } catch (err) {
      console.log("Navbar user fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userImage");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      {/* NAVBAR CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={assets.logo} className="h-10 w-10" alt="Logo" />
          <h1 className="text-xl font-bold text-blue-600">Doc Connect</h1>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <NavLink to="/" className="hover:text-blue-600 transition">HOME</NavLink>
          <NavLink to="/doctors" className="hover:text-blue-600 transition">ALL DOCTORS</NavLink>
          <NavLink to="/about" className="hover:text-blue-600 transition">ABOUT</NavLink>
          <NavLink to="/contact" className="hover:text-blue-600 transition">CONTACT</NavLink>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* LOGIN / PROFILE */}
          {token ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={userImage || assets.upload_area}
                  alt="profile"
                  className="h-10 w-10 rounded-full border object-cover"
                />
                <img src={assets.dropdown_icon} className="w-4 h-4" alt="dropdown" />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border py-2 animate-fadeIn">
                  <p
                    onClick={() => navigate("/my-profile")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/my-appointments")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={logoutHandler}
                    className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/register")}
              className="hidden md:block px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t shadow-sm py-3 animate-fadeIn px-6">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            <NavLink to="/" onClick={() => setMobileMenu(false)}>HOME</NavLink>
            <NavLink to="/doctors" onClick={() => setMobileMenu(false)}>ALL DOCTORS</NavLink>
            <NavLink to="/about" onClick={() => setMobileMenu(false)}>ABOUT</NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenu(false)}>CONTACT</NavLink>

            {!token && (
              <button
                onClick={() => {
                  navigate("/register");
                  setMobileMenu(false);
                }}
                className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Create Account
              </button>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
