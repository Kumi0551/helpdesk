"use client";

import { Button } from "@relume_io/relume-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileSettingsProps {
  onItemClick: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onItemClick }) => {
  const pathname = usePathname();
  return (
    <>
      <Link href="/settings/profile" passHref onClick={onItemClick}>
        <Button
          variant={pathname === "/settings/profile" ? "secondary" : "ghost"}
          className={`w-full justify-start p-2 mb-3 ${
            pathname === "/settings/profile"
              ? "bg-cyan-400 text-white border-none "
              : "text-gray-800 border-gray-300 hover:bg-gray-200 border-none "
          }`}
        >
          <div className="flex items-center">
            <span className="text-base">Settings</span>
          </div>
        </Button>
      </Link>
    </>
  );
};

export default ProfileSettings;
