import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <div>
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
  );
};

export default App;