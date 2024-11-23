// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, UserCircle2, Mail, KeyRound } from 'lucide-react';

export default function Login() {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAnonymous) {
      // Handle anonymous login
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', 'anonymous');
      navigate('/');
    } else {
      // Handle email login
      try {
        // Add your login API call here
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'registered');
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Brain className="w-12 h-12 text-teal-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to MentalMuse</h2>
          <p className="mt-2 text-sm text-gray-600">Your Mental Wellness Companion</p>
        </div>

        <div className="flex justify-center space-x-4 p-1 bg-gray-50 rounded-lg">
          <button
            onClick={() => setIsAnonymous(true)}
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              isAnonymous 
                ? 'bg-white shadow-md text-teal-600' 
                : 'text-gray-500 hover:text-teal-600'
            }`}
          >
            <UserCircle2 className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Anonymous</span>
          </button>
          <button
            onClick={() => setIsAnonymous(false)}
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              !isAnonymous 
                ? 'bg-white shadow-md text-teal-600' 
                : 'text-gray-500 hover:text-teal-600'
            }`}
          >
            <Mail className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Email</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {!isAnonymous && (
            <div className="space-y-4">
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  required={!isAnonymous}
                />
              </div>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  required={!isAnonymous}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            {isAnonymous ? 'Continue Anonymously' : 'Sign In'}
          </button>
        </form>

        {!isAnonymous && (
          <div className="text-center space-y-2">
            <Link 
              to="/forgot-password" 
              className="text-sm text-teal-600 hover:text-teal-500"
            >
              Forgot your password?
            </Link>
            <div className="border-t pt-4">
              <Link 
                to="/register" 
                className="text-sm text-teal-600 hover:text-teal-500"
              >
                Don't have an account? Create one
              </Link>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}