// "use client";
// import React, { useState, useEffect } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { createArtist, getArtistById, updateArtistById } from "@/api/artist";
// import { toast } from "sonner";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// interface Artist {
//   id?: number;
//   name: string;
//   dob: string;
//   gender: string;
//   first_release_year: number;
//   address: string;
//   no_of_albums_released: number;
// }

// interface ArtistUpdateModalProps {
//   artistId: number | null;
//   onClose: () => void;
//   refetchArtists: () => void;
// }

// const ArtistUpdateModal: React.FC<ArtistUpdateModalProps> = ({
//   artistId,
//   onClose,
//   refetchArtists,
// }) => {
//   const [artistData, setArtistData] = useState<Artist>({
//     name: "",
//     dob: "",
//     gender: "",
//     first_release_year: 0,
//     address: "",
//     no_of_albums_released: 0,
//   });

//   const { data } = useQuery(
//     ["artist", artistId],
//     () => getArtistById(artistId!),
//     {
//       enabled: !!artistId,
//     }
//   );

//   useEffect(() => {
//     if (data) {
//       setArtistData(data);
//     }
//   }, [data]);

//   const { mutate: saveArtist } = useMutation({
//     mutationFn: artistId ? updateArtistById : createArtist,
//     onSuccess: () => {
//       toast.success("Artist saved successfully");
//       refetchArtists();
//       onClose();
//     },
//     onError: () => {
//       toast.error("Failed to save artist");
//     },
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setArtistData({ ...artistData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     saveArtist({ ...artistData, id: artistId! });
//   };

//   return (
//     <Dialog open={!!artistId} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogTitle>Update Artist</DialogTitle>
//         <div>
//           <Input
//             name="name"
//             value={artistData.name}
//             onChange={handleChange}
//             placeholder="Name"
//           />
//           <Input
//             name="dob"
//             value={artistData.dob}
//             onChange={handleChange}
//             placeholder="Date of Birth"
//           />
//           <Input
//             name="gender"
//             value={artistData.gender}
//             onChange={handleChange}
//             placeholder="Gender"
//           />
//           <Input
//             name="first_release_year"
//             value={artistData.first_release_year}
//             onChange={handleChange}
//             placeholder="First Release Year"
//           />
//           <Input
//             name="address"
//             value={artistData.address}
//             onChange={handleChange}
//             placeholder="Address"
//           />
//           <Input
//             name="no_of_albums_released"
//             value={artistData.no_of_albums_released}
//             onChange={handleChange}
//             placeholder="Number of Albums Released"
//           />
//           <Button onClick={handleSubmit}>Save</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ArtistUpdateModal;
