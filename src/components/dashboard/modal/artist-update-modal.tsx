"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getArtistById, updateArtistById } from "@/api/artist";
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
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { UpdateArtistFormData, updateArtistSchema } from "@/validations/artist";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ArtistUpdateModalProps {
  artistId: number | null;
  onClose: () => void;
  refetchArtists: () => void;
}

const ArtistUpdateModal: React.FC<ArtistUpdateModalProps> = ({
  artistId,
  onClose,
  refetchArtists,
}) => {
  const form = useForm<UpdateArtistFormData>({
    resolver: zodResolver(updateArtistSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = form;

  const { data: artist, refetch } = useQuery({
    queryKey: [queryKeys.getArtistById, artistId],
    queryFn: () => getArtistById(artistId!),
    enabled: !!artistId,
  });

  const { mutate: updateArtistMutation, isPending } = useMutation({
    mutationKey: [mutationKeys.updateArtist],
    mutationFn: (data: { id: number; artist: Partial<UpdateArtistFormData> }) =>
      updateArtistById(data),
    onSuccess: () => {
      toast.success("Artist updated successfully");
      refetchArtists();
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.data) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  useEffect(() => {
    if (artist) {
      const artistData = {
        ...artist.data,
        dob: artist.data.dob ? new Date(artist.data.dob) : null,
        first_release_year: artist.data.first_release_year?.toString(),
        no_of_albums_released: artist.data.no_of_albums_released.toString(),
      };
      reset(artistData);
    }
  }, [artist, reset]);

  const onSubmit = (data: UpdateArtistFormData) => {
    if (artistId) {
      if (typeof data.dob === "string") {
        data.dob = new Date(data.dob);
      }
      updateArtistMutation({ id: artistId, artist: data });
    }
  };

  return (
    <Dialog open={!!artistId} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Update Artist</DialogTitle>
        <Card className="w-full max-w-lg mx-auto my-4 p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                          onSelect={(date) => setValue("dob", date)}
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

              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                {isPending && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Updating..." : "Update"}
              </Button>
            </form>
          </Form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistUpdateModal;
