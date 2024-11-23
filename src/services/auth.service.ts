// src/services/auth.service.ts
interface LoginResponse {
    token: string;
    user: {
      id: string;
      nickname?: string;
      email?: string;
      isAnonymous: boolean;
    };
  }
  
  interface LoginError {
    message: string;
  }
  
  export const authService = {
    async login(isAnonymous: boolean, email?: string, password?: string): Promise<LoginResponse> {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('your-api-url/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isAnonymous,
            email,
            password,
          }),
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Login failed');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    },
  
    // Store auth token
    setToken(token: string): void {
      localStorage.setItem('token', token);
    },
  
    // Get stored token
    getToken(): string | null {
      return localStorage.getItem('token');
    },
  
    // Remove token on logout
    logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };