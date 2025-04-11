
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Define types for our authentication context
export type UserRole = 'diner' | 'restaurant_owner';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: (role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
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
    email: 'diner@example.com',
    password: 'password123',
    role: 'diner' as UserRole,
  },
  {
    id: '2',
    name: 'Restaurant Owner',
    email: 'owner@example.com',
    password: 'password123',
    role: 'restaurant_owner' as UserRole,
  }
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
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in our "database"
    const foundUser = USERS_DB.find(u => u.email === email && u.password === password && u.role === role);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      
      // Save user to local storage and state
      localStorage.setItem('dineflow_user', JSON.stringify(userData));
      setUser(userData);
      toast({
        title: "Welcome back!",
        description: `Welcome back, ${userData.name}!`,
      });
      return true;
    }
    
    // If not found in mock DB, create a user with the provided email
    // This is to simulate a successful login with the user's input
    if (!foundUser) {
      // Extract name from email (for display purposes)
      const nameFromEmail = email.split('@')[0]
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      
      const newUser = {
        id: `user-${Date.now()}`,
        name: nameFromEmail, // Use part before @ as name
        email: email,
        role: role,
      };
      
      localStorage.setItem('dineflow_user', JSON.stringify(newUser));
      setUser(newUser);
      toast({
        title: "Welcome!",
        description: `Welcome, ${newUser.name}!`,
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  };

  // Google login (simulated)
  const loginWithGoogle = async (role: UserRole): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Instead of using hardcoded values, we'll use a generic name based on the current timestamp
    // In a real implementation with Supabase, we would get the actual Google account details
    const timestamp = new Date().toLocaleTimeString();
    const googleUser = {
      id: `g-${Date.now()}`,
      name: `Google User (${timestamp})`, // Use a timestamp to make it unique
      email: `user-${Date.now()}@gmail.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      role,
    };
    
    // Save user data
    localStorage.setItem('dineflow_user', JSON.stringify(googleUser));
    setUser(googleUser);
    toast({
      title: "Welcome!",
      description: `Welcome, ${googleUser.name}!`,
    });
    return true;
  };

  // Signup (simulated)
  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (USERS_DB.some(u => u.email === email)) {
      toast({
        title: "Signup failed",
        description: "Email already in use",
        variant: "destructive",
      });
      return false;
    }
    
    // Create new user - use the actual name provided during signup
    const newUser = {
      id: `user-${Date.now()}`,
      name, // Use the actual name provided
      email,
      role,
    };
    
    // Save user data
    localStorage.setItem('dineflow_user', JSON.stringify(newUser));
    setUser(newUser);
    toast({
      title: "Success!",
      description: "Account created successfully!",
    });
    return true;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('dineflow_user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
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
