import axios from "axios";

const API = axios.create({
  baseURL: "https://doc-connect-5g3k.onrender.com",
  
});

// REGISTER
const RegisterUser = async (data) => {
  try {
    const res = await API.post("/api/v1/user/register", data);
    return res;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};

// VERIFY OTP
const VerifyOtp = async (email, otp) => {
  try {
    const res = await API.post("/api/v1/user/verify-otp", { email, otp });
    return res;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "OTP Verification Failed");
  }
};

// RESEND OTP
const ResendOtp = async (email) => {
  try {
    const res = await API.post("/api/v1/user/resend-otp", { email });
    return res;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Resend OTP Failed");
  }
};

// LOGIN  (Now checks if user is verified)
const LoginUser = async (data) => {
  try {
    const res = await API.post("/api/v1/user/login", data);
    return res;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

// ADMIN
const admin = (adminToken) =>
  API.get("/api/v1/admin/users", {
    headers: { Authorization: adminToken },
  });

// USER
const user = ({ adminToken, id }) =>
  API.get(`/api/v1/edit/${id}`, {
    headers: { Authorization: adminToken },
  });

const Authservices = { 
  RegisterUser, 
  LoginUser,
  VerifyOtp,
  ResendOtp,
  admin, 
  user 
};

export default Authservices;
