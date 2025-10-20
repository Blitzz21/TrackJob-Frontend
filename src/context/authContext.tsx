import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      if (userData) setUser(JSON.parse(userData));
    }
  }, []);

  const login = (token: string, userData?: any) => {
    localStorage.setItem("token", token);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData || {});
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
