"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/user"; // Ensure this API function exists
import { mutationKeys } from "@/utils/mutation-keys";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { RegisterFormData, registerSchema } from "@/validations/register";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchUsers: () => void;
}

const UserCreateModal: React.FC<UserCreateModalProps> = ({
  isOpen,
  onClose,
  refetchUsers,
}) => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const { mutate: createUser, isPending } = useMutation({
    mutationKey: [mutationKeys.register],
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("User created successfully");
      refetchUsers();
      onClose();
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        const message =
          (error.response?.data as any)?.message || "An error occurred";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    createUser(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" h-[80%] m-auto overflow-y-scroll">
        <DialogTitle>Create New User</DialogTitle>
        <Card className="w-full max-w-lg mx-auto my-4 p-8 shadow-lg ">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="First Name" />
                    </FormControl>
                    <FormMessage>{errors.first_name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Last Name" />
                    </FormControl>
                    <FormMessage>{errors.last_name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Address" />
                    </FormControl>
                    <FormMessage>{errors.address?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" type="email" />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Phone" />
                    </FormControl>
                    <FormMessage>{errors.phone?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="YYYY-MM-DD" />
                    </FormControl>
                    <FormMessage>{errors.dob?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full border rounded p-2">
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage>{errors.gender?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                {isPending && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Creating..." : "Create"}
              </Button>
            </form>
          </Form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateModal;
