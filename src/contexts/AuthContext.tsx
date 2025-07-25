import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../services/auth.service';
import { authApi } from '../services/api.service';


interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for token in local storage during initialization
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Get current user from API
          const userData = await authApi.getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          // Invalid token or API error
          console.error('Auth validation error:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Sign up function
  async function signUp(name: string, email: string, password: string, phone?: string) {
    try {
      const response = await authApi.register(name, email, password, phone);
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Login function
  async function login(email: string, password: string) {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout function
  async function logout() {
    localStorage.removeItem('token');
    setCurrentUser(null);
  }

  // Reset password function
  async function resetPassword(email: string, newPassword: string) {
    try {
      await authApi.resetPassword(email, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Update profile function
  async function updateProfile(userData: Partial<User>) {
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  const value = {
    currentUser,
    loading,
    signUp,
    login,
    logout,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 