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
    <div className="w-[80%] m-auto h-full">
      <Button onClick={handleBackClick} variant={"outline"}>
        <IoIosArrowRoundBack /> Back to dashboard
      </Button>
      <SongsTable artistId={Number(id)} />
    </div>
  );
};

export default ArtistSongs;
