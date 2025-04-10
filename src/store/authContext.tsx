
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

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
    
    // Create simulated Google user
    const googleUser = {
      id: role === 'diner' ? 'g-123456' : 'g-789012',
      name: role === 'diner' ? 'Jane Smith' : 'Restaurant Manager',
      email: role === 'diner' ? 'jane@example.com' : 'manager@restaurant.com',
      avatar: role === 'diner' ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' : 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
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
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
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
