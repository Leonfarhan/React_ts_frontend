import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBooks, deleteBook } from '../services/api';
import { toast } from 'react-toastify';

const BookList: React.FC = () => {
  interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    publicationYear: number;
  }

  // Simulasi mendapatkan role pengguna dari localStorage
  const [role, setRole] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Dapatkan role pengguna dari localStorage (atau dari sumber lain seperti Redux)
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    // Ambil daftar buku setelah mendapatkan role
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getAllBooks();
      setBooks(response.data as Book[]);
    } catch (error) {
      console.error('Fetch books error:', error);
      toast.error('Failed to fetch books.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        toast.success('Book deleted successfully!');
        fetchBooks();
      } catch (error) {
        console.error('Delete book error:', error);
        toast.error('Failed to delete book.');
      }
    }
  };

  return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">Book List</h4>
                {role === 'ADMIN' && (
                    <div className="d-flex gap-2">
                      <Link to="/books/create" className="btn btn-primary">
                        Add Book
                      </Link>
                      <Link to="/dashboard" className="btn btn-secondary ml-2">
                        Back to Dashboard
                      </Link>
                    </div>
                )}
              </div>
              <div className="card-body">
                <table className="table table-bordered table-striped">
                  <thead>
                  <tr>
                    <th className='text-center'>Title</th>
                    <th className='text-center'>Author</th>
                    <th className='text-center'>Publisher</th>
                    <th className='text-center'>Year</th>
                    <th className='text-center'>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td className='text-center'>{book.publicationYear}</td>
                        <td className='text-center'>
                          {role === 'ADMIN' && (
                              <>
                                <Link
                                    to={`/books/${book.id}/edit`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                  Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                  Delete
                                </button>
                              </>
                          )}

                          {role === 'USER' && (
                              <>
                                <Link
                                    to={`/transactions/create?bookId=${book.id}`}
                                    className='btn btn-success'>
                                  Borrow
                                </Link>
                              </>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default BookList;
