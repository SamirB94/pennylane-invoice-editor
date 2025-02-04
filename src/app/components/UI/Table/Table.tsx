import { Dispatch, ReactNode, SetStateAction } from "react";
import TableHeaders from "./TableHeaders";
import TableRows from "./TableRows";
import { Table as BootstrapTable } from "react-bootstrap";
import type { Pagination as PaginationType } from "../../../../types";
import Pagination from "../Pagination/Pagination";

export interface TableProps {
  data:
    | {
        headers: string[];
        rows: any;
      }
    | undefined;
  onRowClick?: (value: string) => void;
  fallbackContent?: ReactNode;
  options?: ReactNode;
  pagination?: PaginationType | null;
  setPagination?: Dispatch<SetStateAction<PaginationType | null>>;
}

const Table = ({
  data,
  onRowClick,
  fallbackContent,
  options,
  pagination,
  setPagination,
}: TableProps) => {
  if (!data) return <>No table data...</>;

  const { headers, rows } = data;

  const handlePagination = (page: number) => {
    if (setPagination && pagination)
      setPagination({
        page,
        page_size: pagination?.page_size,
        total_pages: pagination?.total_pages,
        total_entries: pagination?.total_entries,
      });
  };

  return (
    <>
      <div className="row justify-content-between">
        {options && <div className="col-md-8">{options}</div>}
        {pagination && (
          <Pagination
            pagination={pagination}
            handlePagination={handlePagination}
          />
        )}
      </div>
      <BootstrapTable className="table table-bordered table-striped table-hover">
        <TableHeaders headers={headers || []} />
        <TableRows
          rows={rows || []}
          fallbackContent={fallbackContent}
          onRowClick={onRowClick}
        />
      </BootstrapTable>
    </>
  );
};

export default Table;
