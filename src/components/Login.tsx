import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import { useAuth } from "../services/AuthContext.tsx";

interface LoginResponse {
  message: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

const Login: React.FC = () => {
  const { setUser, setRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({ username, password });
      const data = response.data as LoginResponse;

      console.log('Login response:', data);

      if (data.user && data.user.id) {
        localStorage.setItem('token', 'dummy-token');
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);

        setUser(data.user);
        setRole(data.user.role);

        toast.success(data.message || 'Login successful!');
        navigate('/dashboard');
        console.log(localStorage)
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="bg-white w-[35%] p-8 rounded">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h5 className="text-xl font-medium text-gray-900 text-center">Case Study</h5>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Farhan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
              <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;