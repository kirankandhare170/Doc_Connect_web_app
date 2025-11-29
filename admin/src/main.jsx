import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom';
import AdminContextProvider, { AdminContext } from './context/Admincontex.jsx';
import AppContextProvider from './context/Appcontex.jsx';
import DoctorContextProvider from './context/doctorContex.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AdminContextProvider>
    <DoctorContextProvider>
      <AppContextProvider>
          <App />
      </AppContextProvider>
    </DoctorContextProvider>
  </AdminContextProvider>
   
  </BrowserRouter>,
)
