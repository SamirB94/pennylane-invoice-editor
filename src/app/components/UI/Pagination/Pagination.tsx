import { Pagination as BootstrapPagination } from "react-bootstrap";
// import type { Pagination as PaginationType } from "./types";
import type { Pagination as PaginationType } from "../../../../types";

const Pagination = ({
  pagination,
  handlePagination,
}: {
  pagination: PaginationType;
  handlePagination: (page: number) => void;
}) => {
  const prevPage = pagination?.page - 1 > 0 ? pagination?.page - 1 : 1;
  const nextPage =
    pagination?.page + 1 > pagination?.total_pages
      ? pagination?.total_pages
      : pagination?.page + 1;

  return (
    <BootstrapPagination className="col-md-4 justify-content-end">
      <BootstrapPagination.First onClick={() => handlePagination(1)} />
      <BootstrapPagination.Prev onClick={() => handlePagination(prevPage)} />
      <BootstrapPagination.Item active>
        {pagination?.page}
      </BootstrapPagination.Item>
      <BootstrapPagination.Next onClick={() => handlePagination(nextPage)} />
      <BootstrapPagination.Last
        onClick={() => handlePagination(pagination?.total_pages)}
      />
    </BootstrapPagination>
  );
};

export default Pagination;
