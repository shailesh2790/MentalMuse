import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = authService.getToken();
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user
  };
}