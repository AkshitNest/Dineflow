
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/store/authContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dineflow-dark/95 backdrop-blur-lg text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-dineflow-light-purple font-bold text-xl mr-1">Dine</span>
              <span className="font-bold text-xl">flow</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Features</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pricing</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="text-white border-dineflow-light-purple hover:bg-dineflow-light-purple/10">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-dineflow-orange hover:bg-dineflow-orange/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dineflow-dark/95 backdrop-blur-lg shadow-lg pb-3 px-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Home</Link>
            <Link to="/features" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Features</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Pricing</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Contact</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Login</Link>
                <Link to="/signup" className="bg-dineflow-orange text-white block px-3 py-2 rounded-md text-base font-medium mt-2" onClick={toggleMenu}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
