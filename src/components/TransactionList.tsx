import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { getAllBorrowingTransactions, deleteBorrowingTransaction} from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from "../services/AuthContext.tsx";

interface Transaction {
  id: number;
  book: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    username: string;
  };
  borrowDate: string;
  returnDate: string;
  status: string;
}

const TransactionList: React.FC = () => {
  const { role } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => { fetchTransactions() }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getAllBorrowingTransactions();
      setTransactions(response.data as Transaction[]);
    } catch (error) {
      console.error('Fetch transactions error:', error);
      toast.error('Failed to fetch transactions.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteBorrowingTransaction(id);
        toast.success('Transaction deleted successfully!');
        fetchTransactions();
      } catch (error) {
        console.error('Delete transaction error:', error);
        toast.error('Failed to delete transaction.');
      }
    }
  };

  return (
      <div>
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title">Borrowing Transactions</h4>
                  <div className="d-flex gap-2">
                    <Link to="/transactions/create" className="btn btn-primary">
                      Create Transaction
                    </Link>
                    <Link to="/dashboard" className="btn btn-secondary ml-2">
                      Back to Dashboard
                    </Link>
                  </div>
                </div>

                <div className="card-body">
                  <table className="table table-bordered table-striped mt-2">
                    <thead>
                    <tr>
                      <th className="text-center">No</th>
                      <th className="text-center">Book</th>
                      <th className="text-center">User</th>
                      <th className="text-center">Borrow Date</th>
                      <th className="text-center">Return Date</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction, key) => (
                        <tr key={key} className='text-center'>
                          <td className='text-center'>{key+1}</td>
                          <td>{transaction.book.title}</td>
                          <td>{transaction.user.username}</td>
                          <td>{transaction.borrowDate}</td>
                          <td>{transaction.returnDate}</td>
                          <td>{transaction.status}</td>
                          { role === 'ADMIN' ? (
                              <td className='d-flex justify-content-evenly'>
                                <Link
                                    to={`/transactions/${transaction.id}/edit`}
                                    className="btn btn-warning btn-sm"
                                >
                                  Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(transaction.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                  Delete
                                </button>
                              </td>
                          ) : role === 'USER' ? (
                              <td>
                                <Link
                                    className='btn btn-warning btn-sm'>
                                  Return
                                </Link>
                              </td>
                          ) : null}
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TransactionList;