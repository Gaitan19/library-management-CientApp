import { IBook } from "@/Interfaces/IBook";
import { IUser } from "@/Interfaces/IUser";
import { FaUser, FaBook, FaUndo } from "react-icons/fa";
import FilterButtons from "../FilterButtons/FilterButtons";

interface UserListProps {
  users: IUser[];
  books: IBook[];
  filterBorrowed: boolean;
  setFilterBorrowed: (value: boolean) => void;
  selectedBook: { [key: string]: string };
  setSelectedBook: (value: { [key: string]: string }) => void;
  handleBorrow: (userId: string) => void;
  handleReturn: (userId: string, bookId: string) => void;
}

export default function UserList({
  users,
  books,
  filterBorrowed,
  setFilterBorrowed,
  selectedBook,
  setSelectedBook,
  handleBorrow,
  handleReturn,
}: UserListProps) {
  const filterOptions = [
    { label: "With Loans", value: true, color: "yellow" },
    { label: "All", value: false, color: "blue" }
  ];

  const filteredUsers = users.filter(
    (user) => !filterBorrowed || user.books.length > 0
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users List</h2>
        <FilterButtons
          options={filterOptions}
          selectedValue={filterBorrowed}
          onSelect={setFilterBorrowed}
        />
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
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
  );
}