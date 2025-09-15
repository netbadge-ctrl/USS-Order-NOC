"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  pageSize: number;
  previousPage: () => void;
  nextPage: () => void;
}

export function Pagination({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  setPageIndex,
  setPageSize,
  pageSize,
  previousPage,
  nextPage,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = pageCount;
    const currentPage = pageIndex + 1;
    
    // Show first page
    pageNumbers.push(1);

    // Show ellipsis if needed
    if (currentPage > 3) {
      pageNumbers.push('...');
    }

    // Show pages around current page
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      }
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    // Show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers.map((page, index) =>
      typeof page === "number" ? (
        <Button
          key={index}
          variant={page === currentPage ? "outline" : "ghost"}
          size="sm"
          onClick={() => setPageIndex(page - 1)}
          className={page === currentPage ? "border-primary text-primary" : ""}
        >
          {page}
        </Button>
      ) : (
        <span key={index} className="px-2 py-1 text-sm">
          {page}
        </span>
      )
    );
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-2">
        {/* We can add a page size selector if needed */}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {renderPageNumbers()}
        <Button
          variant="outline"
          size="sm"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
