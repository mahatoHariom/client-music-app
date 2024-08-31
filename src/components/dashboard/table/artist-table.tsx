"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteArtist, getArtists } from "@/api/artist";
import { Input } from "../../ui/input";
import { Artist } from "@/types/artist";
import { Pagination as PaginationType } from "@/types/pagination"; // Ensure you have a Pagination type defined

const ArtistsTable: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 5;
  const initialSearch = searchParams.get("search") || "";

  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
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

  const {
    data: artistsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["artists", currentPage, limit, search],
    queryFn: () => getArtists(currentPage, limit, search),
  });

  const { mutate: deleteArtistMutation } = useMutation({
    mutationFn: deleteArtist,
    onSuccess: () => {
      toast.success("Artist deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete artist");
    },
  });

  const handleDelete = (artistId: number) => {
    deleteArtistMutation(artistId);
  };

  const handleUpdate = (artistId: number) => {
    setSelectedArtistId(artistId);
  };

  const handleCloseModal = () => {
    setSelectedArtistId(null);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (artistsData?.pagination.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* <ArtistUpdateModal
        artistId={selectedArtistId}
        onClose={handleCloseModal}
        refetchArtists={refetch}
      /> */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium w-full">All Artists</h1>
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name..."
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-5 min-h-96 h-full">
          <Table className="w-full border border-slate-100">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>First Released Year</TableHead>
                <TableHead>No. of Albums Released</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artistsData?.artists.map((artist: Artist) => (
                <TableRow key={artist.id}>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell>
                    {artist.dob
                      ? new Date(artist.dob).toISOString().split("T")[0]
                      : "N/A"}
                  </TableCell>

                  <TableCell>{artist.address}</TableCell>
                  <TableCell>
                    {artist.first_release_year
                      ? new Date(artist.first_release_year)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </TableCell>
                  <TableCell>{artist.no_of_albums_released}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button>Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleUpdate(artist.id)}
                          >
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(artist.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              {[...Array(artistsData?.pagination.totalPages || 0)].map(
                (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ArtistsTable;
