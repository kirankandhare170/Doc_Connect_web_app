const cloudinary = require('cloudinary').v2;
const bcrypt = require("bcrypt");
const doctorModel = require("../models/doctorsModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
const User = require("../models/userModel"); // newusers1
const Doctor = require("../models/doctorsModel");
const Appointment = require("../models/Appointment");
const addDoctor = async (req, res) => {
  try {
    const { 
      name, email, password, speciality, degree, 
      experience, about, fees, address, available 
    } = req.body;

    const imageFile = req.file;

    // check required fields
    if (
      !name || !email || !password || !speciality || !degree ||
      !experience || !about || !fees || !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required details"
      });
    }

    // password validation
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a stronger password" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    let imageUrl = "";
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    }

    // prepare doctor data
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashpassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address, // if you're sending JSON string in Postman
      available: available ?? true, // default true if not provided
      date: Date.now()
    };

    const adddoctordata = new doctorModel(doctorData);
    await adddoctordata.save();

    return res.json({
      success: true,
      message: "Doctor added successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "addDoctor error",
      error: error.message
    });
  }
};


const loginAdmin = async (req, res) => {
   try {
      const { email , password} = req.body
      if(email ===process.env.ADMIN_EMIAL && password === process.env.ADMIN_PASSWORD ){
         const token = jwt.sign( email+ password , process.env.SECRET_KEY)
         res.json({
          success: true,
          message : "login success",
          token,
         })
      }else{
        res.json({
          success: false,
          message : "invalid credential "
        })
      }
    
      }   catch (error) {
    console.log(error)
    res.json({
      success: false ,
      message : "invalid credential"
    })
   }
}



/// get all doctors

const getDoctors = async (req, res) => {
       const doctors = await doctorModel.find({})
       if(doctors){
        return res.send({success: true , message : "get doctors successfully", doctors})
       }
       
}

const changeAvailability = async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if the doctor exists
    const user = await doctorModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    // Toggle availability
    user.available = !user.available;
    await user.save(); // save the updated document

    res.send({ success: true, message: "Availability changed", available: user.available });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to change availability" });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    const doctors = await Doctor.find({});
    const appointments = await Appointment.find({}).sort({ appointmentDate: -1 });

    res.json({ success: true, users, doctors, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();
    res.json({ success: true, message: `Appointment ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// -----------------------------
// GET ALL APPOINTMENTS
// -----------------------------
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ appointmentDate: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Delete doctor error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

  const  getSingleDoctor = async (req, res) => {
  try {
    const { docId } = req.params;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Get doctor by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports ={ addDoctor, loginAdmin, getDoctors, changeAvailability,getDashboardData,
  toggleDoctorAvailability: changeAvailability, // alias for routes
  updateAppointmentStatus,
  getAllUsers,
  getAllDoctors: getDoctors, // alias
  getAllAppointments,deleteDoctor,getSingleDoctor  }




