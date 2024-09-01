"use client";
import React, { useState } from "react";
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
import { mutationKeys, queryKeys } from "@/utils/mutation-keys";
import { deleteUser, getUsers } from "@/api/user";
import UserUpdateModal from "../modal/user-update-modal";
import { User } from "@/types/user";
import { Input } from "../../ui/input";
import UserCreateModal from "../modal/user-create-modal";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useTable } from "@/hooks/use-table";

interface UsersTableProps {
  initialPage: number;
  initialLimit: number;
  initialSearch: string;
  // setSearch: (value: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  initialPage,
  initialLimit,
  initialSearch,
  // setSearch,
}) => {
  const { currentPage, limit, search, handlePageChange, handleSearchChange } =
    useTable({
      initialPage,
      initialLimit,
      initialSearch,
    });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [queryKeys.getAllUsers, currentPage, limit, search],
    queryFn: () => getUsers(currentPage, limit, search),
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationKey: [mutationKeys.deleteUser],
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const handleDelete = (userId: number) => {
    deleteUserMutation(userId);
  };

  const handleUpdate = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleCloseUpdateModal = () => {
    setSelectedUserId(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div>
      {/* User Update Modal */}
      <UserUpdateModal
        userId={selectedUserId}
        onClose={handleCloseUpdateModal}
        refetchUsers={refetch}
      />

      {/* User Create Modal */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        refetchUsers={refetch}
      />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium w-full">All Users</h1>
        <div className="flex items-center space-x-2 w-full">
          <Input
            className="w-full"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
          />
          <Button onClick={handleOpenCreateModal} className="flex gap-2">
            <PlusCircledIcon /> Add User
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-5 min-h-96 h-full">
          <Table className="w-full border border-slate-100">
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData?.users?.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.dob).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button>Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleUpdate(user.id)}
                          >
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id)}
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
              {usersData?.pagination.totalPages &&
                [...Array(usersData.pagination.totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              <PaginationItem>
                {currentPage !== usersData?.pagination.totalPages && (
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
