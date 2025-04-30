import { INewData } from "@/Interfaces/IBook";
import { FaTimes } from "react-icons/fa";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  newData: INewData;
  setNewData: (data: INewData) => void;
}

export default function UserModal({ 
  isOpen, 
  onClose, 
  onSave, 
  newData, 
  setNewData 
}: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Add User</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Example: John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={(e) =>
                  setNewData({ ...newData, name: e.target.value })
                }
                required
              />
            </div>
          </form>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}