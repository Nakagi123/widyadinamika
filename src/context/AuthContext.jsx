import { createContext, useContext, useState } from "react";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider — wraps your whole app
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
    });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // persist on refresh
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isLoggedIn = user !== null;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook for easy access
export function useAuth() {
  return useContext(AuthContext);
}