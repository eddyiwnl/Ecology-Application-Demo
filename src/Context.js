import React, { useState } from "react";
  
export const DropDownContext = React.createContext();
export const ContextProvider = ({ children }) => {
    const [majorgroup, setMajorGroup] = useState('');
  
    return (
        <DropDownContext.Provider value={{ majorgroup, setMajorGroup }}>
            {children}
        </DropDownContext.Provider>
    );
};