import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../services/AuthContext.tsx";

const Dashboard: React.FC = () => {
  const { user, logout} = useAuth();
  const navigate = useNavigate();
  const username = user?.username || 'Guest'; // opsi chaining

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully!');
  }

  return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title">Dashboard</h4>
                  <button onClick={handleLogout} className="btn btn-danger">
                    Log Out
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Welcome, {username}!</h5>
                  <p>This is your dashboard. Here you can access:</p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to="/books" className="btn btn-primary">
                      List Books
                    </Link>
                    <Link to="/transactions" className="btn btn-primary">
                      Borrowing Transactions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;