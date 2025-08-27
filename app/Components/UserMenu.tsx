"use client";

import { useCallback, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import MenuItem from "./MenuItem";
import Link from "next/link";
import BackDrop from "./BackDrop";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/types";
import UserAvatar from "./UserAvatar";

interface UserMenuProps {
  currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      <div className="relative z-30" onClick={toggleOpen}>
        <div className="py-2 px-3 border-[1px] border-purple-800 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-purple-800">
          <UserAvatar src={currentUser?.image} />{" "}
          <IoIosArrowDown className="size-4 h-4 w-4 text-purple-800" />
        </div>
        {isOpen && (
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer font-semibold">
            {currentUser ? (
              <MenuItem
                onClick={() => {
                  toggleOpen();
                  signOut({ callbackUrl: "/" });
                }}
              >
                Sign Out
              </MenuItem>
            ) : (
              <Link href={"/signin"}>
                <MenuItem onClick={toggleOpen}>Log In</MenuItem>
              </Link>
            )}
          </div>
        )}
      </div>

      {isOpen ? <BackDrop onClick={toggleOpen} /> : null}
    </>
  );
};

export default UserMenu;
