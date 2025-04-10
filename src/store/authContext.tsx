
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define types for our authentication context
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  loginWithGoogle: async () => false,
  signup: async () => false,
  logout: () => {},
});

// Sample user data (simulating a database)
const USERS_DB = [
  {
    id: '1',
    name: 'John Doe',
    email: 'demo@example.com',
    password: 'password123',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('dineflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Email/password login
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in our "database"
    const foundUser = USERS_DB.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };
      
      // Save user to local storage and state
      localStorage.setItem('dineflow_user', JSON.stringify(userData));
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    }
    
    toast.error('Invalid email or password');
    return false;
  };

  // Google login (simulated)
  const loginWithGoogle = async (): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create simulated Google user
    const googleUser = {
      id: 'g-123456',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    };
    
    // Save user data
    localStorage.setItem('dineflow_user', JSON.stringify(googleUser));
    setUser(googleUser);
    toast.success(`Welcome, ${googleUser.name}!`);
    return true;
  };

  // Signup (simulated)
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (USERS_DB.some(u => u.email === email)) {
      toast.error('Email already in use');
      return false;
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
    };
    
    // Save user data
    localStorage.setItem('dineflow_user', JSON.stringify(newUser));
    setUser(newUser);
    toast.success('Account created successfully!');
    return true;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('dineflow_user');
    setUser(null);
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        loginWithGoogle, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
