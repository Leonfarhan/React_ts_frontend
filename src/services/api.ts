import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// --- Authentication ---
export const login = async (userData: { username: string; password: string }) => {
  return await api.post('/login', userData);
};

// --- Book Services ---
export const getAllBooks = async () => await api.get('/books');
export const getBookById = async (id: number) => await api.get(`/books/${id}`);
export const createBook = async (bookData: { title: string; author: string; publisher: string; publicationYear: number }) => await api.post('/books', bookData);
export const updateBook = async (id: number, bookData: { title: string; author: string; publisher: string; publicationYear: number }) => await api.put(`/books/${id}`, bookData);
export const deleteBook = async (id: number) => await api.delete(`/books/${id}`);

// --- User Services ---
export const getAllUsers = async () => await api.get('/users');
export const getUserById = async (id: number) => await api.get(`/users/${id}`);
export const createUser = async (userData: { username: string; password: string; role: string }) => await api.post('/users', userData); 
export const updateUser = async (id: number, userData: { username: string; password: string; role: string }) => await api.put(`/users/${id}`, userData); 
export const deleteUser = async (id: number) => await api.delete(`/users/${id}`);

// --- Borrowing Transaction Services ---
export const getAllBorrowingTransactions = async () => await api.get('/borrowing-transactions');
export const getBorrowingTransactionById = async (id: number) => await api.get(`/borrowing-transactions/${id}`);
export const createBorrowingTransaction = async (transactionData: { book: { id: number }; user: { id: number }; borrowDate: string; returnDate: string; status: string }) => await api.post('/borrowing-transactions', transactionData);
export const updateBorrowingTransaction = async (id: number, transactionData: { book: { id: number }; user: { id: number }; borrowDate: string; returnDate: string; status: string }) => await api.put(`/borrowing-transactions/${id}`, transactionData);
export const deleteBorrowingTransaction = async (id: number) => await api.delete(`/borrowing-transactions/${id}`);

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

api.interceptors.request.use(
  (config) => {
    if (config.url !== '/login') {
      config.headers = {
        ...config.headers,
        ...getAuthHeader(),
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;