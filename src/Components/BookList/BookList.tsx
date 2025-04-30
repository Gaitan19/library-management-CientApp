import { IBook } from "@/Interfaces/IBook";
import CustomTable from "../CustomTable/CustomTable";
import FilterButtons from "../FilterButtons/FilterButtons";

interface BookListProps {
  books: IBook[];
  filterAvailable: boolean | null;
  setFilterAvailable: (value: boolean | null) => void;
}

export default function BookList({ 
  books, 
  filterAvailable, 
  setFilterAvailable 
}: BookListProps) {
  const columns = [
    { header: "ISBN", accessor: "isbn" },
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { header: "Year", accessor: "publicationYear" },
    { 
      header: "State", 
      accessor: "isAvailable",
      render: (value: boolean) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {value ? "Available" : "Borrowed"}
        </span>
      )
    }
  ];

  const filterOptions = [
    { label: "Available", value: true, color: "green" },
    { label: "Not Available", value: false, color: "red" },
    { label: "All", value: null, color: "blue" }
  ];

  const filteredBooks = books.filter(
    (book) => filterAvailable === null || book.isAvailable === filterAvailable
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Book List</h2>
        <FilterButtons
          options={filterOptions}
          selectedValue={filterAvailable}
          onSelect={setFilterAvailable}
        />
      </div>
      <CustomTable 
        data={filteredBooks} 
        columns={columns} 
        rowClassName="hover:bg-gray-50 transition-colors duration-150"
      />
    </div>
  );
}