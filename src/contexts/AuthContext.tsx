import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { loginRequest, signupRequest } from "../utils/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const { access_token, role } = await loginRequest(username, password);

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);

      setUser({ username, role } as User); // ⚠️ simplified User (since backend only returns email+role)
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    setIsLoading(true);
    try {
      const { role } = await signupRequest(data);
      localStorage.setItem("role", role);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = user !== null;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUser({ email: "unknown", role });
    }
    setIsLoading(false);
  }, []);

  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
