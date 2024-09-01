"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createMusic } from "@/api/music";
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { Music } from "@/types/music";
import { createMusicSchema } from "@/validations/music";
import { mutationKeys } from "@/utils/mutation-keys";

interface SongCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchSongs: () => void;
  artistId: number;
}

const SongCreateModal: React.FC<SongCreateModalProps> = ({
  isOpen,
  onClose,
  refetchSongs,
  artistId,
}) => {
  const form = useForm<Music>({
    resolver: zodResolver(createMusicSchema),
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

  const { mutate: createSong, isPending } = useMutation({
    mutationKey: [mutationKeys.createMusic],
    mutationFn: (data: Music) => createMusic(artistId, data),
    onSuccess: () => {
      toast.success("Song created successfully");
      refetchSongs();
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

  const onSubmit = (data: Music) => {
    createSong(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" h-auto">
        <DialogTitle className="text-center text-lg">
          Create New Song
        </DialogTitle>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Title" />
                  </FormControl>
                  <FormMessage>{errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="album_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Album Name" />
                  </FormControl>
                  <FormMessage>{errors.album_name?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full border rounded p-2">
                      <option value="">Select Genre</option>
                      <option value="rnb">R&B</option>
                      <option value="country">Country</option>
                      <option value="classic">Classic</option>
                      <option value="rock">Rock</option>
                      <option value="jazz">Jazz</option>
                    </select>
                  </FormControl>
                  <FormMessage>{errors.genre?.message}</FormMessage>
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

export default SongCreateModal;
