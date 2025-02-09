import { ReactNode } from "react";

interface TableRowProps {
  rows: Array<{ [key: string]: any }>;
  fallbackContent?: ReactNode;
  onRowClick?: (value?: any) => void;
}

const TableRows = ({ rows, fallbackContent, onRowClick }: TableRowProps) => {
  if (rows.length === 0) return <tbody>{fallbackContent}</tbody>;

  return (
    <tbody>
      {rows.map((row: { [key: string]: any }) => {
        return (
          <tr
            key={row.id ?? row}
            className="pointer"
            onClick={() => onRowClick && onRowClick(row)}
            role="button"
          >
            {Object.entries(row).map(([key, value]) => (
              <td key={key}>{value}</td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableRows;
