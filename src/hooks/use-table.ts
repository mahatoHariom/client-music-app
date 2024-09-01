import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UseTableProps {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
}

export const useTable = ({
  initialPage = 1,
  initialLimit = 5,
  initialSearch = "",
}: UseTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(limit),
      search,
    });
    router.push(`?${params.toString()}`);
  }, [currentPage, limit, search, router]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    limit,
    search,
    handlePageChange,
    handleSearchChange,
  };
};
