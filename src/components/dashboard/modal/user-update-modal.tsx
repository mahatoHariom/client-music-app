import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQuery } from "@tanstack/react-query";
import { updateUser, getUserById } from "@/api/user";
import { mutationKeys, queryKeys } from "@/utils/mutation-keys";
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
import { CalendarIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { RegisterFormData, registerSchema } from "@/validations/register";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface UserUpdateModalProps {
  userId: number | null;
  onClose: () => void;
  refetchUsers: () => void;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({
  userId,
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
    setValue,
  } = form;

  const { data: user, refetch } = useQuery({
    queryKey: [queryKeys.getUserById, userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (user) {
      const userWithFormattedDate = {
        ...user,
        dob: user.dob ? new Date(user.dob) : null,
      };
      reset(userWithFormattedDate);
    }
  }, [user, reset]);

  const { mutate: updateUserMutation } = useMutation({
    mutationKey: [mutationKeys.updateUser],
    mutationFn: (data: RegisterFormData) => updateUser(userId!, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      refetchUsers();
      onClose();
    },
    onError: (error: AxiosError) => {
      if (error instanceof AxiosError) {
        const message =
          (error.response?.data as any)?.message || "An error occurred";
        toast.error(message);
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    if (typeof data.dob === "string") {
      data.dob = new Date(data.dob);
    }
    if (userId) {
      updateUserMutation(data);
    }
  };

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className=" h-[80%] m-auto overflow-y-scroll p-10">
        <DialogTitle className="text-center text-lg">Update User</DialogTitle>

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
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => setValue("dob", date as Date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
              // disabled={isPending}
            >
              {/* {isPending && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )} */}
              {/* {isPending ? "Updating..." : "Update"} */}
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserUpdateModal;
