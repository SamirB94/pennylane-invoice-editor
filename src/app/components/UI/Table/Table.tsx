import { ReactNode } from "react";
import TableHeaders from "./TableHeaders";
import TableRows from "./TableRows";
import { Table as BootstrapTable } from "react-bootstrap";

export interface TableProps {
  data:
    | {
        headers: string[];
        rows: any;
      }
    | undefined;
  onRowClick?: (value: string) => void;
  fallbackContent?: ReactNode;
}

const Table = ({ data, onRowClick, fallbackContent }: TableProps) => {
  if (!data) return <>No table data...</>;

  const { headers, rows } = data;

  return (
    <BootstrapTable className="table table-bordered table-striped table-hover">
      <TableHeaders headers={headers || []} />
      <TableRows
        rows={rows || []}
        fallbackContent={fallbackContent}
        onRowClick={onRowClick}
      />
    </BootstrapTable>
  );
};

export default Table;
