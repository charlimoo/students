// start of frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiService from '../api/apiService';
import { toast } from 'sonner';

// --- Type Definitions ---
interface Role {
  id: number;
  name: string;
  description: string;
}

interface University {
    id: number;
    name: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  is_staff: boolean;
  is_active: boolean;
  roles: Role[];
  universities: University[]; // For University Experts
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  isImpersonating: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  stopImpersonating: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- AuthProvider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);

  useEffect(() => {
    // This function runs on initial application load to check for an existing session.
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const adminToken = localStorage.getItem('adminToken');

      if (adminToken) {
        setIsImpersonating(true);
      }

      if (token) {
        try {
          // Set the token for subsequent requests
          apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Fetch the current user's data to verify the token is valid
          const response = await apiService.get('/v1/me/');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Session verification failed, logging out.", error);
          logout(); // The token is invalid or expired
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await apiService.post('/auth/token/', { email, password });
    const { access, refresh } = response.data;
    
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    apiService.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    const userResponse = await apiService.get('/v1/me/');
    setUser(userResponse.data);
    setIsAuthenticated(true);
    return userResponse.data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminToken'); // Also clear admin token on full logout
    delete apiService.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setIsImpersonating(false);
  };

  const stopImpersonating = async () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    try {
      // It's good practice to inform the backend, even though we handle the rest client-side
      await apiService.post('/v1/impersonate/stop/');
    } catch (error) {
        console.warn("Could not notify backend of impersonation stop. Proceeding with client-side session restore.");
    } finally {
        // Restore the admin's session regardless of API call success
        localStorage.setItem('accessToken', adminToken);
        localStorage.removeItem('adminToken'); // Clean up the impersonation flag
        localStorage.removeItem('refreshToken'); // The refresh token belonged to the impersonated user

        toast.info("Returning to your administrator session.");
        
        // Force a full reload to re-authenticate as the admin and clear all app state
        window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, isImpersonating, login, logout, stopImpersonating }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// end of frontend/src/context/AuthContext.tsx