import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../services/AuthProvider.tsx";
import { Button, Card } from 'flowbite-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const username = user?.username || 'Guest';

  const handleLogout = async () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully!');
  };

  return (
      <div className="flex justify-center items-center h-screen w-full">
        <Card className="p-2 px-2">
          <div className="flex justify-end">
              <Button color="failure" onClick={handleLogout} pill>
                Log Out
              </Button>
          </div>
          <div className="flex flex-col items-center py-12">
            <h5 className="mt-2 mb-4 text-2xl font-bold tracking-tight text-gray-900">
              Welcome, {username}!
            </h5>
            <p className="font-normal text-gray-700">
              This is your dashboard. Here you can access:
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/books">
              <Button color="blue" pill>
                List Book
              </Button>
            </Link>
            <Link to="/transactions">
              <Button color="blue" pill>
                Borrowing Transactions
              </Button>
            </Link>
          </div>
        </Card>
      </div>
  );
};

export default Dashboard;