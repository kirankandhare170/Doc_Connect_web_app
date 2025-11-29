import { createContext, useState } from "react";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
      const [atoken , setAtoken] = useState(localStorage.getItem("atoken"))

      const baseUrl = import.meta.env.VITE_BACKEND_URL
      
    const value = {
         atoken , setAtoken,
         baseUrl,
    }

    return (
       <AdminContext.Provider value={value}>
        {props.children}
       </AdminContext.Provider>
    )
}

export default AdminContextProvider 