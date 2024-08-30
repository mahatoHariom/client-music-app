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
  DropdownMenuPortal,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { mutationKeys, queryKeys } from "@/utils/mutation-keys";
import { deleteUser, getUsers } from "@/api/user";
import UserUpdateModal from "./modal/user-update-modal";
import { User } from "@/types/user";

const UsersTable: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [queryKeys.getAllUsers],
    queryFn: getUsers,
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
  const handleCloseModal = () => {
    setSelectedUserId(null);
  };
  return (
    <div>
      <UserUpdateModal
        userId={selectedUserId}
        onClose={handleCloseModal}
        refetchUsers={refetch}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table className="w-full border border-slate-100">
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button>Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleUpdate(user.id)}>
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user.id)}>
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
      )}
    </div>
  );
};

export default UsersTable;
