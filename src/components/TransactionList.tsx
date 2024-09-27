import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {getAllBorrowingTransactions, deleteBorrowingTransaction, updateBorrowingTransaction} from '../services/api';
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
  const { role, user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getAllBorrowingTransactions();
      let allTransactions = response.data as Transaction[];

      if (role === 'USER' && user) {
        allTransactions = allTransactions.filter(transaction => transaction.user.id === user.id);
      }
      setTransactions(allTransactions);
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

  const handleReturnRequest = async (id: number) => {
    try {
      const transactionToUpdate = transactions.find(t => t.id === id);

      if (!transactionToUpdate) {
        toast.error("Transaction not found");
        return;
      }

      await updateBorrowingTransaction(id, {
        ...transactionToUpdate,
        status: 'Pending',
      });
      toast.success('Return request submitted!');
      fetchTransactions();
    } catch (error) {
      console.error('Return request error:', error);
      toast.error('Failed to submit return request.');
    }
  };

  const handleApproveReturn = async (id: number) => {
    try {
      const transactionToUpdate = transactions.find(t => t.id === id);
      if (!transactionToUpdate) {
        toast.error("Transaction not found");
        return;
      }

      await updateBorrowingTransaction(id, {
        ...transactionToUpdate,
        status: 'Returned',
      });
      toast.success('Return request approved!');
      fetchTransactions();
    } catch (error) {
      console.error('Approve return error:', error);
      toast.error('Failed to approve return request.');
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
                  {user && role && (
                      <div className="d-flex gap-2">
                        {/*{role === 'ADMIN' && (*/}
                        {/*    <Link to="/transactions/create" className="btn btn-primary">*/}
                        {/*      Create Transaction*/}
                        {/*    </Link>*/}
                        {/*)}*/}
                        <Link to="/dashboard" className="btn btn-secondary ml-2">
                          Back to Dashboard
                        </Link>
                      </div>
                  )}
                </div>

                <div className="card-body">
                  <table className="table table-bordered table-striped mt-2">
                    <thead>
                    <tr>
                      <th className="text-center align-middle">No</th>
                      <th className="text-center align-middle">Book</th>
                      { role === 'ADMIN' && (
                          <th className="text-center align-middle">User</th>
                      )}
                      <th className="text-center align-middle">Borrow Date</th>
                      <th className="text-center align-middle">Return Date</th>
                      <th className="text-center align-middle">Status</th>
                      <th className="text-center align-middle">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction, key) => (
                        <tr key={key} className='text-center'>
                          <td className='text-center'>{key + 1}</td>
                          <td>{transaction.book.title}</td>
                          { role === 'ADMIN' && (
                              <td>{transaction.user.username}</td>
                          )}
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
                                {transaction.status === 'Pending' && (
                                    <button
                                        onClick={() => handleApproveReturn(transaction.id)} // Gunakan handleApproveReturn
                                        className="btn btn-success btn-sm ms-2"
                                    >
                                      Approve
                                    </button>
                                )}
                              </td>
                          ) : role === 'USER' ? (
                              <td>
                                {transaction.status === 'Borrowed' && (
                                    <button
                                        onClick={() => handleReturnRequest(transaction.id)}
                                        className="btn btn-warning btn-sm"
                                    >
                                      Return
                                    </button>
                                )}
                                {transaction.status === 'Pending' && <span>Pending</span>}
                                {transaction.status === 'Returned' && <span>Done</span>}
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