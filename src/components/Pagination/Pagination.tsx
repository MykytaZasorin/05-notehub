import { FC } from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1} // контролює активну сторінку
      onPageChange={(selected) => onPageChange(selected.selected + 1)}
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
    />
  );
};

export default Pagination;
