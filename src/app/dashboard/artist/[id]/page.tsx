"use client";
import { IoIosArrowRoundBack } from "react-icons/io";
import SongsTable from "@/components/dashboard/table/song-table";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const ArtistSongs = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="max-w-4xl m-auto  w-full h-full flex flex-col gap-10">
      <Button
        onClick={handleBackClick}
        variant={"outline"}
        className="w-34 max-w-52"
      >
        <IoIosArrowRoundBack /> Back to dashboard
      </Button>
      <SongsTable artistId={Number(id)} />
    </div>
  );
};

export default ArtistSongs;
