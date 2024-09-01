"use client";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { RootState } from "@/slices/store";
import { logout } from "@/slices/auth-slice";
import { AvatarComponent } from "./avatar-component";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./theme-toggle";

export function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {user && (
        <div className="flex items-center justify-between w-full  ">
          <ModeToggle />
          <h1 className="text-xl text-center font-medium">
            Artist Management System
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center">
              <div className="flex items-center">
                {user?.first_name + ""}

                {user?.last_name}
              </div>
              <AvatarComponent
                firstName={user.first_name}
                lastName={user.last_name}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
}
