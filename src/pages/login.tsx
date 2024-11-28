// src/pages/Login.tsx
// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle2, Mail, KeyRound, Brain } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check onboarding on mount
  useEffect(() => {
    if (!localStorage.getItem('onboardingComplete')) {
      navigate('/onboarding');
    }
  }, [navigate]);

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isAnonymous) {
        const anonymousId = `anon_${Math.random().toString(36).slice(2)}`;
        
        // Set login data
        localStorage.setItem('userId', anonymousId);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'anonymous');
        
        // Clear any existing user data
        localStorage.removeItem('email');
        localStorage.removeItem('userData');
        
        setIsLoading(false);
        navigate('/home');
      } else {
        // Email login validation
        if (!email.trim() || !password.trim()) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }

        // Set login data
        localStorage.setItem('userId', email);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'email');
        localStorage.setItem('email', email);
        
        setIsLoading(false);
        navigate('/home');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl"
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Brain className="w-12 h-12 text-teal-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to MindMuse</h2>
          <p className="mt-2 text-sm text-gray-600">Your Mental Wellness Companion</p>
        </div>

        {/* Login Type Selection */}
        <div className="flex justify-center space-x-4 p-1 bg-gray-50 rounded-lg">
          <button
            type="button"
            onClick={() => setIsAnonymous(true)}
            disabled={isLoading}
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
            type="button"
            onClick={() => setIsAnonymous(false)}
            disabled={isLoading}
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

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 text-red-500 p-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {!isAnonymous && (
            <div className="space-y-4">
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="Email address"
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Password"
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (!isAnonymous && (!email || !password))}
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isAnonymous ? 'Continue Anonymously' : 'Sign In'
            )}
          </button>
        </form>

        {!isAnonymous && (
          <div className="text-center text-sm">
            <Link to="/register" className="text-teal-600 hover:text-teal-500">
              Don't have an account? Create one
            </Link>
          </div>
        )}

        <div className="mt-4 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </motion.div>
    </div>
  );
}