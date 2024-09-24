import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createBorrowingTransaction,
  getBorrowingTransactionById,
  updateBorrowingTransaction,
  getAllBooks,
} from '../services/api';

const TransactionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bookId, setBookId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [borrowDate, setBorrowDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [status, setStatus] = useState('Borrowed'); // Default status
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | null>(null); // State untuk judul buku

  const [books, setBooks] = useState<{ id: number; title: string }[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [errors, setErrors] = useState<{
    bookId?: string;
    userId?: string;
    borrowDate?: string;
    returnDate?: string;
  }>({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        setBooks(response.data as { id: number; title: string }[]);

        // Cek apakah ada bookId di query params, jika ada set bookId otomatis
        const bookIdFromURL = searchParams.get('bookId');
        if (bookIdFromURL) {
          setBookId(Number(bookIdFromURL));

          // Cari judul buku berdasarkan bookId dan setel state
          const selectedBook = response.data.find(
              (book: { id: number }) => book.id === Number(bookIdFromURL)
          );
          if (selectedBook) {
            setSelectedBookTitle(selectedBook.title);
          }
        }
      } catch (error) {
        console.error('Fetch books error:', error);
        toast.error('Failed to fetch books.');
      }
    };

    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }

    fetchBooks();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!borrowDate) newErrors.borrowDate = 'Borrow date is required';
    if (!returnDate) newErrors.returnDate = 'Return date is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (bookId && currentUser) {
        const transactionData = {
          book: { id: bookId },
          user: { id: currentUser.id },
          borrowDate: borrowDate?.toISOString() ?? '',
          returnDate: returnDate?.toISOString() ?? '',
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
        toast.error('Book or User cannot be null.');
      }
    }
  };

  return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">
                  {id ? 'Edit Transaction' : 'Create Transaction'}
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <p id="book">{selectedBookTitle || 'No book selected'}</p> {/* Tampilkan judul buku */}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="borrowDate" className="mb-2">Borrow Date</label>
                    <input
                        type="date"
                        className={`form-control ${errors.borrowDate ? 'is-invalid' : ''}`}
                        id="borrowDate"
                        value={borrowDate ? borrowDate.toISOString().slice(0, 10) : ''}
                        onChange={(e) => {
                          setBorrowDate(new Date(e.target.value));
                          setErrors({ ...errors, borrowDate: '' });
                        }}
                    />
                    {errors.borrowDate && (
                        <div className="invalid-feedback">{errors.borrowDate}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="returnDate" className="mb-2">Return Date</label>
                    <input
                        type="date"
                        className={`form-control ${errors.returnDate ? 'is-invalid' : ''}`}
                        id="returnDate"
                        value={returnDate ? returnDate.toISOString().slice(0, 10) : ''}
                        onChange={(e) => {
                          setReturnDate(new Date(e.target.value));
                          setErrors({ ...errors, returnDate: '' });
                        }}
                    />
                    {errors.returnDate && (
                        <div className="invalid-feedback">{errors.returnDate}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="status" className="mb-2">Status</label>
                    <select
                        className="form-control"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Borrowed">Borrowed</option>
                      <option value="Returned">Returned</option>
                      {/*<option value="Overdue">Overdue</option>*/}
                    </select>
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <button type="submit" className="btn btn-primary me-2">
                      Save
                    </button>
                    <Link to="/transactions" className="btn btn-secondary ml-2">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TransactionForm;