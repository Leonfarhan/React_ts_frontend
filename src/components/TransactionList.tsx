import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBorrowingTransactions, deleteBorrowingTransaction, updateBorrowingTransaction } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from "../services/AuthProvider.tsx";
import { Table, Button, Card, Alert } from 'flowbite-react';

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
  const [error, setError] = useState<string | null>(null);

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
      setError('Failed to fetch transactions.');
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
        setError('Failed to delete transaction.');
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
      setError('Failed to submit return request.');
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
      setError('Failed to approve return request.');
      toast.error('Failed to approve return request.');
    }
  };

  return (
      <div className="container h-screen mx-auto pt-5 p-4 !text-black">
        <div className="w-full">
          <Card className="shadow-lg !text-black">
            <div className="flex justify-between items-center px-4 !text-black">
              <h4 className="text-xl font-bold">Borrowing Transactions</h4>
              <div className="space-x-2">
                <Link to="/dashboard">
                  <Button color="purple" pill>Back to Dashboard</Button>
                </Link>
              </div>
            </div>

            <div className="card-body overflow-x-auto">
              {error && (
                  <Alert color="failure" className="!text-black">
                    {error}
                  </Alert>
              )}
              <Table hoverable={true}>
                <Table.Head className="!text-black">
                  <Table.HeadCell className="text-center">No</Table.HeadCell>
                  <Table.HeadCell>Book</Table.HeadCell>
                  {role === 'ADMIN' && <Table.HeadCell>User</Table.HeadCell>}
                  <Table.HeadCell>Borrow Date</Table.HeadCell>
                  <Table.HeadCell>Return Date</Table.HeadCell>
                  <Table.HeadCell className="text-center">Status</Table.HeadCell>
                  <Table.HeadCell className="text-center">Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y !text-black">
                  {transactions.map((transaction, key) => (
                      <Table.Row key={key} className="bg-white !text-black">
                        <Table.Cell className="text-center">{key + 1}</Table.Cell>
                        <Table.Cell>{transaction.book.title}</Table.Cell>
                        {role === 'ADMIN' && <Table.Cell>{transaction.user.username}</Table.Cell>}
                        <Table.Cell>{transaction.borrowDate}</Table.Cell>
                        <Table.Cell>{transaction.returnDate}</Table.Cell>
                        <Table.Cell className="text-center">
                      <span className={`px-2 py-1 rounded-lg ${
                          transaction.status === 'Borrowed' ? 'bg-yellow-200' :
                              transaction.status === 'Pending' ? 'bg-blue-200' : 'bg-green-200'
                      }`}>
                        {transaction.status}
                      </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex space-x-2 justify-center">
                            {role === 'ADMIN' ? (
                                <>
                                  <Link to={`/transactions/${transaction.id}/edit`}>
                                    <Button size="xs" color="warning">Edit</Button>
                                  </Link>
                                  <Button onClick={() => handleDelete(transaction.id)} size="xs" color="failure">
                                    Delete
                                  </Button>
                                  {transaction.status === 'Pending' && (
                                      <Button onClick={() => handleApproveReturn(transaction.id)} size="xs" color="success">
                                        Approve
                                      </Button>
                                  )}
                                </>
                            ) : role === 'USER' ? (
                                <>
                                  {transaction.status === 'Borrowed' && (
                                      <Button onClick={() => handleReturnRequest(transaction.id)} size="xs" color="warning">
                                        Return
                                      </Button>
                                  )}
                                  {transaction.status === 'Pending' && <span className="text-center">Pending</span>}
                                  {transaction.status === 'Returned' && <span className="text-center">Done</span>}
                                </>
                            ) : null}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Card>
        </div>
      </div>
  );
};

export default TransactionList;