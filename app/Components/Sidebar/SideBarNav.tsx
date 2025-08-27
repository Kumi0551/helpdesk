"use client";

import { SafeUser } from "@/types";
import { useSidebar } from "../SidebarContext";
import ProfileSettings from "./ProfileSettings";
import UserNavItems from "./UserNavItems";
import SuperAdminNav from "./SuperAdminNav";
import BackDrop from "../BackDrop";

interface SideBarProps {
  currentUser: SafeUser | null;
}

const SideBar: React.FC<SideBarProps> = ({ currentUser }) => {
  const { isOpen, toggleSidebar } = useSidebar();

  const handleItemClick = () => {
    if (isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && <BackDrop onClick={toggleSidebar} />}
      <aside
        className={`bg-white border-r pt-20 border-gray-200 text-gray-800 w-60 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        inert={!isOpen}
      >
        <nav className="h-full flex flex-col justify-between">
          <div className="pl-4 xl:pl-8 py-4 space-y-8">
            <UserNavItems onItemClick={handleItemClick} />

            <div>
              {currentUser?.role === "SUPER_ADMIN" && (
                <SuperAdminNav onItemClick={handleItemClick} />
              )}
            </div>
          </div>

          {currentUser && (
            <div className="p-4 border-t border-gray-200">
              <ProfileSettings onItemClick={handleItemClick} />
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
