"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getMusicByArtistId,
  createMusic,
  updateMusicById,
  deleteMusicById,
} from "@/api/music";
import { Music } from "@/types/music";
import { Input } from "@/components/ui/input";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import SongCreateModal from "../modal/song-create-modal";
import SongUpdateModal from "../modal/song-update-modal";
import { useTable } from "@/hooks/use-table";
import CustomPagination from "@/components/pagination-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import EmptyState from "@/components/empty-state";

interface SongTableProps {
  artistId: number;
}

const SongsTable: React.FC<SongTableProps> = ({ artistId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";
  const [selectedMusicId, setSelectedMusicId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const { currentPage, limit, search, handlePageChange, handleSearchChange } =
    useTable({
      initialPage,
      initialLimit: 5,
      initialSearch,
    });

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      search,
    });
    router.push(`?${params.toString()}`);
  }, [currentPage, search, router]);

  const {
    data: musicData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["music", artistId, currentPage, search],
    queryFn: () => getMusicByArtistId(artistId, search, currentPage),
  });

  const { mutate: createMusicMutation } = useMutation({
    mutationFn: (data: Music) => createMusic(artistId, data),
    onSuccess: () => {
      toast.success("Music created successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to create music");
    },
  });

  const { mutate: deleteMusicMutation } = useMutation({
    mutationFn: deleteMusicById,
    onSuccess: () => {
      toast.success("Music deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete music");
    },
  });

  const handleCreate = useCallback(
    (musicData: any) => {
      createMusicMutation(musicData);
      setShowCreateModal(false);
    },
    [createMusicMutation]
  );

  const handleUpdate = useCallback((musicId: number) => {
    setSelectedMusicId(musicId);
    setShowUpdateModal(true);
  }, []);

  const handleDelete = useCallback(
    (musicId: number) => {
      deleteMusicMutation(musicId);
    },
    [deleteMusicMutation]
  );

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleCloseUpdateModal = useCallback(() => {
    setShowUpdateModal(false);
  }, []);

  return (
    <div>
      <SongCreateModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        refetchSongs={refetch}
        artistId={artistId}
      />

      <SongUpdateModal
        isOpen={showUpdateModal}
        onClose={handleCloseUpdateModal}
        refetchSongs={refetch}
        artistId={artistId}
        musicId={selectedMusicId!}
      />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium">All Songs</h1>
        <div className="flex items-center">
          <Input
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="mr-4 w-full min-w-96"
          />
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusCircledIcon />
            Add New Song
          </Button>
        </div>
      </div>
      {isLoading ? (
        <LoadingSkeleton />
      ) : musicData?.data?.length === 0 || musicData?.data === undefined ? (
        <EmptyState />
      ) : (
        <>
          <Table className="w-full border border-slate-100">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Album</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {musicData?.data.map((music: Music) => (
                <TableRow key={music.id}>
                  <TableCell>{music.title}</TableCell>
                  <TableCell>{music.album_name}</TableCell>
                  <TableCell>{music.genre}</TableCell>
                  <TableCell>
                    {
                      new Date(music.created_at as string)
                        .toISOString()
                        .split("T")[0]
                    }
                  </TableCell>
                  <TableCell>
                    {
                      new Date(music.updated_at as string)
                        .toISOString()
                        .split("T")[0]
                    }
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button>Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleUpdate(music.id)}
                          >
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(music.id)}
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

          <div className="mt-4">
            <CustomPagination
              currentPage={currentPage}
              totalPages={musicData?.pagination.totalPages || 0}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SongsTable;
