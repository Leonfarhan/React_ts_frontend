import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBook, getBookById, updateBook } from '../services/api';

const BookForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publicationYear, setPublicationYear] = useState(0);

  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    publisher?: string;
    publicationYear?: string;
  }>({});

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          const response = await getBookById(Number(id));
          const { title, author, publisher, publicationYear } = response.data as {
            title: string;
            author: string;
            publisher: string;
            publicationYear: number;
          };
          setTitle(title);
          setAuthor(author);
          setPublisher(publisher);
          setPublicationYear(publicationYear);
        } catch (error) {
          console.error('Fetch book error:', error);
          toast.error('Failed to fetch book details.');
        }
      };
      fetchBook();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    if (!publisher.trim()) newErrors.publisher = 'Publisher is required';
    if (publicationYear <= 0) newErrors.publicationYear = 'Invalid year';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const bookData = { title, author, publisher, publicationYear };

      try {
        if (id) {
          await updateBook(Number(id), bookData);
          toast.success('Book updated successfully!');
        } else {
          await createBook(bookData);
          toast.success('Book created successfully!');
        }
        navigate('/books');
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error('Failed to save book data.');
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
                {id ? 'Edit Book' : 'Create Book'}
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors({ ...errors, title: '' }); 
                    }}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                    id="author"
                    value={author}
                    onChange={(e) => {
                      setAuthor(e.target.value);
                      setErrors({ ...errors, author: '' }); 
                    }}
                  />
                  {errors.author && (
                    <div className="invalid-feedback">{errors.author}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="publisher">Publisher:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.publisher ? 'is-invalid' : ''}`}
                    id="publisher"
                    value={publisher}
                    onChange={(e) => {
                      setPublisher(e.target.value);
                      setErrors({ ...errors, publisher: '' }); 
                    }}
                  />
                  {errors.publisher && (
                    <div className="invalid-feedback">{errors.publisher}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="publicationYear">Publication Year:</label>
                  <input
                    type="number"
                    className={`form-control ${errors.publicationYear ? 'is-invalid' : ''}`}
                    id="publicationYear"
                    value={publicationYear}
                    onChange={(e) => {
                      setPublicationYear(parseInt(e.target.value, 10)); 
                      setErrors({ ...errors, publicationYear: '' });
                    }}
                  />
                  {errors.publicationYear && (
                    <div className="invalid-feedback">{errors.publicationYear}</div>
                  )}
                </div>
                <div className="d-flex justify-content-end mt-3"> 
                  <button type="submit" className="btn btn-primary me-2">
                    Save
                  </button>
                  <Link to="/books" className="btn btn-secondary ml-2">
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

export default BookForm;