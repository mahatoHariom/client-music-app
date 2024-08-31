
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const usePagination = (initialPage: number, initialLimit: number, initialSearch: string) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [limit] = useState<number>(initialLimit);
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(limit),
      search,
    });
    router.push(`?${params.toString()}`);
  }, [currentPage, limit, search, router]);

  return {
    currentPage,
    limit,
    search,
    setCurrentPage,
    setSearch
  };
};

export default usePagination;
