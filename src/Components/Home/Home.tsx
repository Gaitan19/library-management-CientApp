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
      toast.error("Error al obtener libros");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>("https://localhost:7299/api/Users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Error al obtener usuarios");
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
        `${activeTab === "books" ? "Libro" : "Usuario"} agregado correctamente`
      );
      fetchBooks();
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error al agregar");
    }
  };

  const handleBorrow = async (userId: string) => {
    const bookId = selectedBook[userId];
    if (!bookId) {
      toast.error("Selecciona un libro para prestar");
      return;
    }

    try {
      await axios.post("https://localhost:7299/borrow", { userId, bookId });
      toast.success("Libro prestado exitosamente");
      fetchBooks();
      fetchUsers();
    } catch (error) {
      toast.error("Error al prestar libro");
    }
  };

  const handleReturn = async (userId: string, bookId: string) => {
    try {
      await axios.post("https://localhost:7299/return", { userId, bookId });
      toast.success("Libro devuelto exitosamente");
      fetchBooks();
      fetchUsers();
    } catch (error) {
      toast.error("Error al devolver libro");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center">Gestión de Biblioteca</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 p-2 bg-green-500 text-white rounded flex items-center"
      >
        <FaPlus className="mr-2" /> Agregar{" "}
        {activeTab === "books" ? "Libro" : "Usuario"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">
              Agregar {activeTab === "books" ? "Libro" : "Usuario"}
            </h2>
            {activeTab === "books" ? (
              <form>
                <input
                  type="text"
                  placeholder="Título"
                  className="border p-2 w-full mt-2"
                  onChange={(e) =>
                    setNewData({ ...newData, title: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Autor"
                  className="border p-2 w-full mt-2"
                  onChange={(e) =>
                    setNewData({ ...newData, author: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="ISBN"
                  className="border p-2 w-full mt-2"
                  onChange={(e) =>
                    setNewData({ ...newData, isbn: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Publicación year"
                  className="border p-2 w-full mt-2"
                  onChange={(e) =>
                    setNewData({
                      ...newData,
                      publicationYear: Number(e.target.value),
                    })
                  }
                  required
                />
              </form>
            ) : (
              <form>
                <input
                  type="text"
                  placeholder="Nombre"
                  className="border p-2 w-full mt-2"
                  onChange={(e) =>
                    setNewData({ ...newData, name: e.target.value })
                  }
                  required
                />
              </form>
            )}
            <button
              onClick={handleAdd}
              className="mt-4 p-2 bg-blue-500 text-white rounded w-full"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setActiveTab("books")}
          className={`p-2 rounded ${
            activeTab === "books" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          <FaBook className="inline-block mr-2" /> Libros
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`p-2 rounded ${
            activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          <FaUser className="inline-block mr-2" /> Usuarios
        </button>
      </div>

      {activeTab === "books" && (
        <div>
          <h2 className="text-2xl font-bold mt-6">Lista de Libros</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setFilterAvailable(true)}
              className="p-2 bg-green-500 text-white rounded"
            >
              Disponibles
            </button>
            <button
              onClick={() => setFilterAvailable(false)}
              className="p-2 bg-red-500 text-white rounded"
            >
              No Disponibles
            </button>
            <button
              onClick={() => setFilterAvailable(null)}
              className="p-2 bg-gray-500 text-white rounded"
            >
              Todos
            </button>
          </div>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ISBN</th>
                <th className="border p-2">Título</th>
                <th className="border p-2">Autor</th>
                <th className="border p-2">PublicationYear</th>
                <th className="border p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {books
                .filter(
                  (book) =>
                    filterAvailable === null ||
                    book.isAvailable === filterAvailable
                )
                .map((book) => (
                  <tr key={book.id} className="text-center">
                    <td className="border p-2">{book.isbn}</td>
                    <td className="border p-2">{book.title}</td>
                    <td className="border p-2">{book.author}</td>
                    <td className="border p-2">{book.publicationYear}</td>
                    <td className="border p-2">
                      {book.isAvailable ? "Disponible" : "Prestado"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-bold mt-6">Lista de Usuarios</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setFilterBorrowed(true)}
              className="p-2 bg-yellow-500 text-white rounded"
            >
              Con Préstamos
            </button>
            <button
              onClick={() => setFilterBorrowed(false)}
              className="p-2 bg-gray-500 text-white rounded"
            >
              Todos
            </button>
          </div>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Libros Prestados</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => !filterBorrowed || user.books.length > 0)
                .map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.books.length}</td>
                    <td className="border p-2">
                      <div>
                        <div className="mb-3">
                          <select
                            onChange={(e) =>
                              setSelectedBook({
                                ...selectedBook,
                                [user.id]: e.target.value,
                              })
                            }
                            className="p-2 border rounded"
                          >
                            <option value="">Seleccionar libro</option>
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
                            className="p-2 bg-blue-500 text-white rounded ml-2"
                          >
                            Prestar
                          </button>
                        </div>
                        <div className="flex justify-center flex-wrap">
                          {user.books.map((book) => (
                            <button
                              key={book.id}
                              onClick={() => handleReturn(user.id, book.id)}
                              className="p-2 bg-red-500 text-white rounded ml-2"
                            >
                              <FaUndo /> Devolver {book.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
