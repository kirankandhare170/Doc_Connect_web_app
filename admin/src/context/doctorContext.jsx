import { createContext, useState } from "react";

export const doctorContext = createContext()

const DoctorContextProvider = (props) => {
      
    const value = {

    }

    return (
       <doctorContext.Provider value={value}>
        {props.children}
       </doctorContext.Provider>
    )
}

export default DoctorContextProvider 