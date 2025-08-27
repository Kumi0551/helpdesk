import React from "react";

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    >
      {children}
    </th>
  );
};

export default TableHeader;
