// src/components/layout/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Award, Trophy, Mic, LogOut } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-semibold text-teal-600">
              MentalMuse
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </div>
            </Link>

            <Link
              to="/community"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/community' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </div>
            </Link>

            <Link
              to="/journal"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/journal' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4" />
                <span>Journal</span>
              </div>
            </Link>

            <Link
              to="/mindful-quest"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/mindful-quest' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Mindful Quest</span>
              </div>
            </Link>

            <Link
              to="/achievements"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/achievements' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Achievements</span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}