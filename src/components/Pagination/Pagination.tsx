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
}) => (
  <ReactPaginate
    pageCount={pageCount}
    forcePage={currentPage - 1}
    onPageChange={(selected) => onPageChange(selected.selected + 1)}
    containerClassName={css.pagination}
    pageClassName={css.pageItem}
    pageLinkClassName={css.pageLink}
    activeClassName={css.active}
    previousClassName={css.prev}
    nextClassName={css.next}
  />
);

export default Pagination;
