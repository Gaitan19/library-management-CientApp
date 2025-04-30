import { ReactNode } from "react";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any) => ReactNode;
}

interface CustomTableProps {
  data: any[];
  columns: Column[];
  rowClassName?: string;
}

export default function CustomTable({ data, columns, rowClassName = "" }: CustomTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.accessor}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className={rowClassName}>
              {columns.map((column) => (
                <td key={`${index}-${column.accessor}`} className="px-6 py-4 whitespace-nowrap">
                  {column.render 
                    ? column.render(item[column.accessor])
                    : (
                      <div className="text-sm text-gray-500">
                        {item[column.accessor]}
                      </div>
                    )
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}