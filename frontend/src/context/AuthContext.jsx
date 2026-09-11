import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
} from "../services/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("blognexus_token");

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch {
        localStorage.removeItem("blognexus_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  const login = async (email, password) => {
    const response = await loginUser({
      email,
      password,
    });

    const accessToken = response.data.access_token;

    localStorage.setItem("blognexus_token", accessToken);
    setUser(response.data.user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("blognexus_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;