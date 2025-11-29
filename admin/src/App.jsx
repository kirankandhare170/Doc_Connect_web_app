import { useContext } from "react";
import Login from "./pages/login";
import { AdminContext } from "./context/Admincontex";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Admin/Dashboard";
import Allappointments from "./Admin/Allappointments";
import Adddoctors from "./Admin/Adddoctors";
import DoctorList from "./Admin/DoctorList";
import { ToastContainer } from "react-toastify";

function App() {
  const { atoken } = useContext(AdminContext);

  return (
    <>
      {atoken ? (
        <div>
          <Navbar />
          <div className="flex items-start">
            <Sidebar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Allappointments" element={<Allappointments />} />
              <Route path="/add-doctor" element={<Adddoctors />} />
              <Route path="/doctors" element={<DoctorList />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div>
          <Login />
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
