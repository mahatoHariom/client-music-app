"use client";

import React, { useState, useRef, useEffect } from "react";
import { CiImport } from "react-icons/ci";
import { FaFileExport } from "react-icons/fa";
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
import {
  deleteArtist,
  getArtists,
  importArtists,
  exportArtist,
  exportAllArtist,
} from "@/api/artist";
import { Input } from "../../ui/input";
import { Artist } from "@/types/artist";
import ArtistCreateModal from "../modal/create-artist-modal";
import ArtistUpdateModal from "../modal/artist-update-modal";
import { useTable } from "@/hooks/use-table";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface ArtistsTableProps {
  initialPage: number;
  initialLimit: number;
  initialSearch: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const ArtistsTable: React.FC<ArtistsTableProps> = ({
  initialPage,
  initialLimit,
  initialSearch,
  setSearch,
}) => {
  const { currentPage, limit, search, handlePageChange, handleSearchChange } =
    useTable({
      initialPage,
      initialLimit,
      initialSearch,
    });

  useEffect(() => {
    setSearch(search);
  }, [search, setSearch]);

  const router = useRouter();

  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  // const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

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
    // setShowUpdateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCloseUpdateModal = () => {
    // setShowUpdateModal(false);
    setSelectedArtistId(null);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);

      try {
        await importArtists(formData);
        toast.success("Artists imported successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to import artists");
      }
    }
  };

  const handleExport = async (artistId: number) => {
    try {
      const data = await exportArtist(artistId);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `artist_${artistId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error("Failed to export artist data");
    }
  };

  const handleExportAll = async () => {
    try {
      const data = await exportAllArtist();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "artists_all.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error("Failed to export all artists");
    }
  };

  return (
    <div>
      <ArtistCreateModal
        isOpen={showCreateModal}
        refetchArtists={refetch}
        onClose={handleCloseCreateModal}
      />
      <ArtistUpdateModal
        artistId={selectedArtistId}
        onClose={handleCloseUpdateModal}
        refetchArtists={refetch}
      />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium w-full">All Artists</h1>
        <div className="flex gap-4 w-full">
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name..."
            className="min-w-52"
          />
        </div>
      </div>
      <div className="flex justify-end w-full items-end gap-10">
        <Button onClick={handleImportClick} className="flex gap-2">
          <CiImport /> Import Artists
        </Button>
        <Button onClick={handleExportAll} className="flex gap-2">
          <FaFileExport /> Export Artists
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportFile}
          accept=".csv"
          style={{ display: "none" }}
        />
        <Button onClick={() => setShowCreateModal(true)} className="flex gap-2">
          <PlusCircledIcon /> Create New Artist
        </Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-5 min-h-96 h-full mt-5">
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
                          <DropdownMenuItem
                            onClick={() => handleExport(artist.id)}
                          >
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/artist/${artist.id}`)
                            }
                          >
                            View Songs
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
