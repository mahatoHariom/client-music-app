"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createArtist } from "@/api/artist";
import { mutationKeys } from "@/utils/mutation-keys";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { CreateArtistFormData, createArtistSchema } from "@/validations/artist";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ArtistCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchArtists: () => void;
}

const ArtistCreateModal: React.FC<ArtistCreateModalProps> = ({
  isOpen,
  onClose,
  refetchArtists,
}) => {
  const form = useForm<CreateArtistFormData>({
    resolver: zodResolver(createArtistSchema),
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

  const { mutate: createArtistMutation, isPending } = useMutation({
    mutationKey: [mutationKeys.createArtist],
    mutationFn: createArtist,
    onSuccess: () => {
      toast.success("Artist created successfully");
      refetchArtists();
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

  const onSubmit = (data: CreateArtistFormData) => {
    createArtistMutation(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit">
        <DialogTitle className="text-center text-lg">
          Create New Artist
        </DialogTitle>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
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
                            format(field.value, "PPP")
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
                        selected={field.value}
                        onSelect={field.onChange}
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

            <FormField
              control={form.control}
              name="first_release_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Released Year</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Year" type="number" />
                  </FormControl>
                  <FormMessage>
                    {errors.first_release_year?.message}
                  </FormMessage>
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
              name="no_of_albums_released"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. of Albums Released</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Number of Albums"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage>
                    {errors.no_of_albums_released?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4 w-full" disabled={isPending}>
              {isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistCreateModal;
