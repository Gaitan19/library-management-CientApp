"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBook, FaUser, FaPlus } from "react-icons/fa";
import { IBook, LibraryTab, INewData } from "@/Interfaces/IBook";
import { IUser } from "@/Interfaces/IUser";
import { fetchBooks, addBook } from "@/Services/bookService";
import { fetchUsers, addUser, borrowBook, returnBook } from "@/Services/userService";
import BookList from "../BookList/BookList";
import BookModal from "../BookModal/BookModal";
import UserList from "../UserList/UserList";
import UserModal from "../UserModal/UserModal";

export default function LibraryManagement() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [activeTab, setActiveTab] = useState<LibraryTab>("books");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);
  const [filterBorrowed, setFilterBorrowed] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<{ [key: string]: string }>({});
  const [newData, setNewData] = useState<INewData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, usersData] = await Promise.all([
        fetchBooks(),
        fetchUsers()
      ]);
      setBooks(booksData);
      setUsers(usersData);
    } catch (error) {
      toast.error("Error loading data");
    }
  };

  const handleAdd = async () => {
    try {
      if (activeTab === "books") {
        await addBook(newData as Omit<IBook, "id" | "isAvailable">);
      } else {
        await addUser(newData as Omit<IUser, "id" | "books">);
      }
      toast.success(`${activeTab === "books" ? "Book" : "User"} added successfully`);
      loadData();
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
      await borrowBook(userId, bookId);
      toast.success("Book borrowed successfully");
      loadData();
    } catch (error) {
      toast.error("Error when lending a book");
    }
  };

  const handleReturn = async (userId: string, bookId: string) => {
    try {
      await returnBook(userId, bookId);
      toast.success("Book returned successfully");
      loadData();
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
            {activeTab === "books" ? "Book" : "User"}
          </button>
  
          {activeTab === "books" ? (
            <BookList 
              books={books} 
              filterAvailable={filterAvailable} 
              setFilterAvailable={setFilterAvailable} 
            />
          ) : (
            <UserList
              users={users}
              books={books}
              filterBorrowed={filterBorrowed}
              setFilterBorrowed={setFilterBorrowed}
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              handleBorrow={handleBorrow}
              handleReturn={handleReturn}
            />
          )}
        </div>
      </main>
  
      {isModalOpen && activeTab === "books" && (
        <BookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAdd}
          newData={newData}
          setNewData={setNewData}
        />
      )}
  
      {isModalOpen && activeTab === "users" && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAdd}
          newData={newData}
          setNewData={setNewData}
        />
      )}
    </div>
  );
}