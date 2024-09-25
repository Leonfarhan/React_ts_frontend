import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBooks, deleteBook } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from "../services/AuthContext";

const BookList: React.FC = () => {
  interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    publicationYear: number;
  }

  const { user, role, loading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
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
                {user && role && (
                    <div className="d-flex gap-2">
                      {role === 'ADMIN' && (
                          <Link to="/books/create" className="btn btn-primary">
                            Add Book
                          </Link>
                      )}
                      <Link to="/dashboard" className="btn btn-secondary">
                        Back to Dashboard
                      </Link>
                    </div>
                )}
              </div>
              <div className="card-body">
                <table className="table table-bordered table-striped">
                  <thead>
                  <tr>
                    <th className="text-center">Title</th>
                    <th className="text-center">Author</th>
                    <th className="text-center">Publisher</th>
                    <th className="text-center">Year</th>
                    <th className="text-center">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          Loading...
                        </td>
                      </tr>
                  ) : (
                      books.map((book) => (
                          <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td className="text-center">{book.publicationYear}</td>
                            <td className="text-center">
                              {user && role && (
                                  <>
                                    {role === 'ADMIN' && (
                                        <>
                                          <Link to={`/books/${book.id}/edit`} className="btn btn-warning btn-sm me-2">
                                            Edit
                                          </Link>
                                          <button onClick={() => handleDelete(book.id)} className="btn btn-danger btn-sm">
                                            Delete
                                          </button>
                                        </>
                                    )}
                                    {role === 'USER' && (
                                        <Link to={`/transactions/create?bookId=${book.id}`} className="btn btn-success btn-sm">
                                          Borrow
                                        </Link>
                                    )}
                                  </>
                              )}
                            </td>
                          </tr>
                      ))
                  )}
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