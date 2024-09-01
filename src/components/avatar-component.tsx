import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarProps {
  firstName: string;
  lastName: string;
}

export function AvatarComponent({ firstName, lastName }: AvatarProps) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <Avatar>
      <AvatarFallback className="bg-sky-300">{initials}</AvatarFallback>
    </Avatar>
  );
}
