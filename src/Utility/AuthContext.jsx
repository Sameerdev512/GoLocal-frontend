import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [login,setLogin] = useState(false)

    return (
        <AuthContext.Provider value={{ role,setRole, login,setLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

