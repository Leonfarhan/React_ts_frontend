import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBook, getBookById, updateBook } from '../services/api';
import { Button, TextInput, Label, Card, Alert } from 'flowbite-react';

const BookForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publicationYear, setPublicationYear] = useState(0);
  const [submitted, setSubmitted] = useState(false);
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
    setSubmitted(true);

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
      <div className="container h-screen mx-auto pt-10">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Card>
              <h4 className="text-xl font-bold mb-4 text-center">
                {id ? 'Edit Book' : 'Create Book'}
              </h4>

              {/* Alert muncul hanya ketika submitted true dan ada error */}
              {submitted && Object.keys(errors).length > 0 && (
                  <Alert color="failure" className="mb-4">
                    Please fix the following errors:
                    <ul className="mt-2">
                      {Object.values(errors).map((error, index) => (
                          <li key={index}>- {error}</li>
                      ))}
                    </ul>
                  </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="title" className="mb-2 block !text-black">
                    Title:
                  </Label>
                  <TextInput
                      id="title"
                      placeholder="Enter book title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors({ ...errors, title: '' });
                      }}
                      color={errors.title ? 'failure' : 'default'}
                      helperText={errors.title && <span>{errors.title}</span>}
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="author" className="mb-2 block !text-black">
                    Author:
                  </Label>
                  <TextInput
                      id="author"
                      placeholder="Enter author's name"
                      value={author}
                      onChange={(e) => {
                        setAuthor(e.target.value);
                        setErrors({ ...errors, author: '' });
                      }}
                      color={errors.author ? 'failure' : 'default'}
                      helperText={errors.author && <span>{errors.author}</span>}
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="publisher" className="mb-2 block !text-black">
                    Publisher:
                  </Label>
                  <TextInput
                      id="publisher"
                      placeholder="Enter publisher name"
                      value={publisher}
                      onChange={(e) => {
                        setPublisher(e.target.value);
                        setErrors({ ...errors, publisher: '' });
                      }}
                      color={errors.publisher ? 'failure' : 'default'}
                      helperText={errors.publisher && <span>{errors.publisher}</span>}
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="publicationYear" className="mb-2 block !text-black">
                    Publication Year:
                  </Label>
                  <TextInput
                      id="publicationYear"
                      type="number"
                      placeholder="Enter year of publication"
                      value={publicationYear}
                      onChange={(e) => {
                        setPublicationYear(parseInt(e.target.value, 10));
                        setErrors({ ...errors, publicationYear: '' });
                      }}
                      color={errors.publicationYear ? 'failure' : 'default'}
                      helperText={errors.publicationYear && <span>{errors.publicationYear}</span>}
                  />
                </div>

                <div className="flex justify-end items-center mt-6">
                  <Button type="submit" className="mr-2" color="success" pill>
                    Submit
                  </Button>
                  <Link to="/books">
                    <Button color="failure" pill>Cancel</Button>
                  </Link>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default BookForm;
