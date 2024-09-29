import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/Login';
import BookList from './components/BookList';
import BookForm from './components/BookForm.tsx';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import {AuthProvider} from "./services/AuthProvider.tsx";

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
      <AuthProvider>
        <Router>
          <div className="w-full h-full" style={{background: `linear-gradient(to top, #09203f 0%, #537895 100%)`}}>
            <Routes>
              <Route path="/" element={isLoggedIn ? <Navigate to='/dashboard'/> : <Login/>} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/books/create" element={<BookForm />} />
                <Route path="/books/:id/edit" element={<BookForm />} />
                <Route path="/transactions" element={<TransactionList />} />
                <Route path="/transactions/create" element={<TransactionForm />} />
                <Route path="/transactions/:id/edit" element={<TransactionForm />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
  );
};

export default App;