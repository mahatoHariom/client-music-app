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
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
      </PaginationItem>
      {[...Array(totalPages)].map((_, index) => (
        <PaginationItem key={index}>
          <PaginationLink
            href="#"
            isActive={currentPage === index + 1}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);

export default PaginationComponent;
