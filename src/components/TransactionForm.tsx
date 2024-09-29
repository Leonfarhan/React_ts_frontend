import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createBorrowingTransaction,
  updateBorrowingTransaction,
  getAllBooks,
  getBorrowingTransactionById,
} from '../services/api';
import { Button, Card, Label, Select, TextInput } from 'flowbite-react';

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

const TransactionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bookId, setBookId] = useState<number | null>(null);
  const [borrowDate, setBorrowDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [status, setStatus] = useState('Borrowed');
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [transactionUser, setTransactionUser] = useState<{ id: number; username: string } | null>(null);
  const [errors, setErrors] = useState<{
    bookId?: string;
    userId?: string;
    borrowDate?: string;
    returnDate?: string;
  }>({});

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (id) {
        try {
          const response = await getBorrowingTransactionById(Number(id));
          const transaction: Transaction = response.data as Transaction;

          setBookId(transaction.book.id);
          setSelectedBookTitle(transaction.book.title);
          setSelectedUser(transaction.user.username);
          setBorrowDate(new Date(transaction.borrowDate));
          setReturnDate(new Date(transaction.returnDate));
          setStatus(transaction.status);
          setTransactionUser(transaction.user);
        } catch (error) {
          console.error('Fetch transaction details error:', error);
          toast.error('Failed to fetch transaction details.');
        }
      } else if (searchParams.get('bookId')) {
        try {
          const response = await getAllBooks();
          const bookIdFromURL = searchParams.get('bookId');
          const selectedBook = (response.data as { id: number; title: string }[]).find(
              (book) => book.id === Number(bookIdFromURL)
          );

          if (selectedBook) {
            setBookId(Number(bookIdFromURL));
            setSelectedBookTitle(selectedBook.title);
          }
        } catch (error) {
          console.error('Fetch books error:', error);
          toast.error('Failed to fetch books');
        }
      }
    };

    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (!id) {
        setSelectedUser(user.username);
        setTransactionUser(user);
      }
    }

    fetchTransactionDetails();
  }, [id, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!borrowDate) newErrors.borrowDate = 'Borrow date is required';
    if (!returnDate) newErrors.returnDate = 'Return date is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formattedBorrowDate = borrowDate ? borrowDate.toLocaleDateString('en-CA') : null;
      const formattedReturnDate = returnDate ? returnDate.toLocaleDateString('en-CA') : null;

      if (bookId && transactionUser && formattedBorrowDate && formattedReturnDate) {
        const transactionData = {
          book: { id: bookId },
          user: { id: transactionUser.id },
          borrowDate: formattedBorrowDate,
          returnDate: formattedReturnDate,
          status,
        };

        try {
          if (id) {
            await updateBorrowingTransaction(Number(id), transactionData);
            toast.success('Transaction updated successfully!');
          } else {
            await createBorrowingTransaction(transactionData);
            toast.success('Transaction created successfully!');
          }
          navigate('/transactions');
        } catch (error) {
          console.error('Form submission error:', error);
          toast.error('Failed to save transaction data.');
        }
      } else {
        toast.error('Book, User, or Date cannot be null.');
      }
    }
  };

  return (
      <div className="container mx-auto h-screen flex justify-center pt-10">
        <div className="w-full max-w-lg">
          <Card>
            <h5 className="text-2xl font-bold tracking-tight text-center text-gray-900">
              {id ? 'Edit Transaction' : 'Create Transaction'}
            </h5>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <Label className="font-medium text-lg text-gray-700">
                  Selected Book
                </Label>
                <p className="text-md text-gray-900">
                  {selectedBookTitle || 'No book selected'}
                </p>
              </div>

              {/* Borrower */}
              <div className="mb-4">
                <Label className="font-medium text-lg text-gray-700">
                  Borrower
                </Label>
                <p className="text-md text-gray-900">
                  {selectedUser || 'No user selected'}
                </p>
              </div>

              <div className="mb-6">
                <Label htmlFor="borrowDate" className="block mb-2 text-md text-gray-700">
                  Borrow Date
                </Label>
                <TextInput
                    id="borrowDate"
                    type="date"
                    required={true}
                    value={borrowDate ? borrowDate.toISOString().slice(0, 10) : ''}
                    onChange={(e) => {
                      setBorrowDate(new Date(e.target.value));
                      setErrors({ ...errors, borrowDate: '' });
                    }}
                    className={`block w-full text-black ${
                        errors.borrowDate ? 'border-red-500' : ''
                    }`}
                />
                {errors.borrowDate && (
                    <p className="text-red-500 text-sm mt-2">{errors.borrowDate}</p>
                )}
              </div>


              <div className="mb-6">
                <Label htmlFor="returnDate" className="block mb-2 text-md text-gray-700">
                  Return Date
                </Label>
                <TextInput
                    id="returnDate"
                    type="date"
                    required={true}
                    value={returnDate ? returnDate.toISOString().slice(0, 10) : ''}
                    onChange={(e) => {
                      setReturnDate(new Date(e.target.value));
                      setErrors({ ...errors, returnDate: '' });
                    }}
                    className={`block w-full text-black ${
                        errors.returnDate ? 'border-red-500' : ''
                    }`}
                />
                {errors.returnDate && (
                    <p className="text-red-500 text-sm mt-2">{errors.returnDate}</p>
                )}
              </div>


              <div className="mb-6">
                <Label htmlFor="status" className="block mb-2 text-md text-gray-700">
                  Status
                </Label>
                <Select
                    id="status"
                    required={true}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full text-gray-900"
                >
                  <option value="Borrowed">Borrowed</option>
                  <option value="Returned">Returned</option>
                </Select>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="submit" color="success" pill>
                  Submit
                </Button>
                <Link to="/transactions">
                  <Button color="failure" pill>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
  );
};

export default TransactionForm;