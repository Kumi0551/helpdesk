"use client";

import { useSidebar } from "../SidebarContext";
import { Button } from "@relume_io/relume-ui";
import { BiMenu, BiX } from "react-icons/bi";

const ToggleSideBar = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 md:mr-4 lg:hidden p-2 hover:bg-cyan-50"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <BiX className="h-8 w-8" /> : <BiMenu className="h-8 w-8" />}
      </Button>
    </>
  );
};

export default ToggleSideBar;
