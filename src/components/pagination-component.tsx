import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const noPages = totalPages === 0;

  const isPreviousDisabled = currentPage === 1 || noPages;

  const isNextDisabled = currentPage === totalPages || noPages;

  return (
    <Pagination>
      <PaginationContent>
        {!isPreviousDisabled && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                !isPreviousDisabled && onPageChange(currentPage - 1)
              }
            />
          </PaginationItem>
        )}

        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              isActive={currentPage === index + 1}
              onClick={() => !noPages && onPageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {!isNextDisabled && (
          <PaginationItem>
            <PaginationNext
              onClick={() => !isNextDisabled && onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
