"use client";
import SongsTable from "@/components/dashboard/table/song-table";
import { useParams } from "next/navigation";
import React from "react";

const ArtistSongs = () => {
  const { id } = useParams();
  return (
    <div className=" w-[80%] m-auto">
      <SongsTable artistId={Number(id)} />
    </div>
  );
};

export default ArtistSongs;
