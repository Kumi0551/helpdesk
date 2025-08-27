import React from "react";

const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {children}
    </td>
  );
};

export default TableCell;
