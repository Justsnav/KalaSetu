//context is a new react concept that lets multiple components(navbar, login page, protected pages) all know "who logged in "

import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const login = (userData, jwt)=>{
        setUser(userData);
        setToken(jwt);
        localStorage.setItem('token',jwt);
    };
    const logout = () =>{
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };
    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}  
        </AuthContext.Provider>
    );
}
export function useAuth(){
    return useContext(AuthContext);
}