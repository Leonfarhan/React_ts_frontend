import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks, deleteBook } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from "../services/AuthContext";
import { Table, Button } from 'flowbite-react';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
}


const BookList: React.FC = () => {
  const { user, role } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);

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
      <div className="container mx-auto p-4 py-6 h-full">
        <div className="w-full">
          <div className="bg-black rounded-lg">
            <div className="flex justify-between items-center py-3 px-4 border-b">
              <h4 className="text-xl font-bold text-white">Book List</h4>
              <div className="space-x-2 flex">
                {user && role === 'ADMIN' && (
                    <Link to="/books/create">
                      <Button color="blue" pill>Add Book</Button>
                    </Link>
                )}
                <Link to="/dashboard">
                  <Button color="purple" pill>Back to Dashboard</Button>
                </Link>
              </div>
            </div>
            <div className="card-body overflow-x-auto">
              <Table hoverable={true}>
                <Table.Head>
                  <Table.HeadCell className="text-black">Title</Table.HeadCell>
                  <Table.HeadCell className="text-black">Author</Table.HeadCell>
                  <Table.HeadCell className="text-black">Publisher</Table.HeadCell>
                  <Table.HeadCell className="text-black">Year</Table.HeadCell>
                  <Table.HeadCell className="text-center text-black">Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {books.map((book) => (
                      <Table.Row key={book.id} className="bg-white">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                          {book.title}
                        </Table.Cell>
                        <Table.Cell className="text-black">{book.author}</Table.Cell>
                        <Table.Cell className="text-black">{book.publisher}</Table.Cell>
                        <Table.Cell className="text-black">{book.publicationYear}</Table.Cell>
                        <Table.Cell className="flex justify-center">
                          <div className="flex space-x-2">
                            {user && role && (
                                <>
                                  {role === 'ADMIN' && (
                                      <>
                                        <Link to={`/books/${book.id}/edit`}>
                                          <Button size="xs" color="warning" pill>
                                            Edit
                                          </Button>
                                        </Link>
                                        <Button
                                            onClick={() => handleDelete(book.id)}
                                            size="xs"
                                            color="failure"
                                            pill
                                        >
                                          Delete
                                        </Button>
                                      </>
                                  )}
                                  {role === 'USER' && (
                                      <Link to={`/transactions/create?bookId=${book.id}`}>
                                        <Button size="xs" color="success" pill>
                                          Borrow
                                        </Button>
                                      </Link>
                                  )}
                                </>
                            )}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default BookList;