"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBook, FaUser, FaUndo, FaPlus, FaTimes } from "react-icons/fa";

interface Book {
  id: string;
  title: string;
  author: string;
  isAvailable: boolean;
  publicationYear: number;
  isbn: string;
}

interface User {
  id: string;
  name: string;
  books: Book[];
}

export default function LibraryManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"books" | "users">("books");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);
  const [filterBorrowed, setFilterBorrowed] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<{ [key: string]: string }>(
    {}
  );
  const [newData, setNewData] = useState<{
    title?: string;
    author?: string;
    isbn?: string;
    name?: string;
    publicationYear?: number;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get<Book[]>("https://localhost:7299/api/Books");
      setBooks(res.data);
    } catch (error) {
      toast.error("Error getting books");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>("https://localhost:7299/api/Users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Error getting users");
    }
  };

  const handleAdd = async () => {
    try {
      if (activeTab === "books") {
        await axios.post("https://localhost:7299/api/Books", newData);
      } else {
        await axios.post("https://localhost:7299/api/Users", newData);
      }
      toast.success(
        `${activeTab === "books" ? "Book" : "User"} added successfully`
      );
      fetchBooks();
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error adding");
    }
  };

  const handleBorrow = async (userId: string) => {
    const bookId = selectedBook[userId];
    if (!bookId) {
      toast.error("Select a book to borrow");
      return;
    }

    try {
      await axios.post("https://localhost:7299/api/users/borrow", { userId, bookId });
      toast.success("Book borrowed successfully");
      fetchBooks();
      fetchUsers();
    } catch (error) {
      toast.error("Error when lending a book");
    }
  };

  const handleReturn = async (userId: string, bookId: string) => {
    try {
      await axios.post("https://localhost:7299/api/users/return", { userId, bookId });
      toast.success("Book returned successfully");
      fetchBooks();
      fetchUsers();
    } catch (error) {
      toast.error("Error returning book");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-2 leading-[normal]">
        Library Management
        </h1>
        <p className="text-gray-600">Manage your book collection and users</p>
      </header>
  
      {/* Main Content */}
      <main className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("books")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
              activeTab === "books" 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaBook className="inline-block mr-2" /> Books
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
              activeTab === "users" 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaUser className="inline-block mr-2" /> Users
          </button>
        </div>
  
        {/* Content Area */}
        <div className="p-6">
          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-8 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center hover:scale-105 transform"
          >
            <FaPlus className="mr-2" /> Add{" "}
            {activeTab === "books" ? "Libro" : "Usuario"}
          </button>
  
          {/* Books Section */}
          {activeTab === "books" && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Book List</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterAvailable(true)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterAvailable === true 
                        ? "bg-green-100 text-green-800 shadow-inner" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Available
                  </button>
                  <button
                    onClick={() => setFilterAvailable(false)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterAvailable === false 
                        ? "bg-red-100 text-red-800 shadow-inner" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Not Available
                  </button>
                  <button
                    onClick={() => setFilterAvailable(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterAvailable === null 
                        ? "bg-blue-100 text-blue-800 shadow-inner" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>
  
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books
                      .filter(
                        (book) =>
                          filterAvailable === null ||
                          book.isAvailable === filterAvailable
                      )
                      .map((book) => (
                        <tr 
                          key={book.id} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.isbn}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publicationYear}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              book.isAvailable 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {book.isAvailable ? "Available" : "Borrowed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
  
          {/* Users Section */}
          {activeTab === "users" && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Users List</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterBorrowed(true)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterBorrowed 
                        ? "bg-yellow-100 text-yellow-800 shadow-inner" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    With Loans
                  </button>
                  <button
                    onClick={() => setFilterBorrowed(false)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !filterBorrowed 
                        ? "bg-blue-100 text-blue-800 shadow-inner" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>
  
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Books</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users
                      .filter((user) => !filterBorrowed || user.books.length > 0)
                      .map((user) => (
                        <tr 
                          key={user.id} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="text-blue-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.books.length}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-3">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <select
                                  onChange={(e) =>
                                    setSelectedBook({
                                      ...selectedBook,
                                      [user.id]: e.target.value,
                                    })
                                  }
                                  className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                  <option value="">Select book</option>
                                  {books
                                    .filter((book) => book.isAvailable)
                                    .map((book) => (
                                      <option key={book.id} value={book.id}>
                                        {book.title}
                                      </option>
                                    ))}
                                </select>
                                <button
                                  onClick={() => handleBorrow(user.id)}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                                >
                                  <FaBook className="mr-2" /> Lend
                                </button>
                              </div>
                              {user.books.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {user.books.map((book) => (
                                    <button
                                      key={book.id}
                                      onClick={() => handleReturn(user.id, book.id)}
                                      className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm shadow-sm hover:shadow-md transition-all flex items-center"
                                    >
                                      <FaUndo className="mr-1" /> {book.title}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
  
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add {activeTab === "books" ? "Book" : "User"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
  
              {activeTab === "books" ? (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Ej: Cien años de soledad"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={(e) =>
                        setNewData({ ...newData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                    <input
                      type="text"
                      placeholder="Example: Gabriel García"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={(e) =>
                        setNewData({ ...newData, author: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                    <input
                      type="text"
                      placeholder="Ej: 978-0307474728"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={(e) =>
                        setNewData({ ...newData, isbn: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of publication</label>
                    <input
                      type="number"
                      placeholder="Ej: 1967"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          publicationYear: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </form>
              ) : (
                <form>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                    <input
                      type="text"
                      placeholder="Example: Juan Pérez"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={(e) =>
                        setNewData({ ...newData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </form>
              )}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
