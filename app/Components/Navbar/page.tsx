/* import { Button } from "@relume_io/relume-ui";
import Image from "next/image";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import UserMenu from "../UserMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
import ToggleSideBar from "./ToggleSideBar";

const Navbar = async () => {
  const currentUser = await getCurrentUser();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 xl:px-8 py-4 lg:py-6">
        <div className="flex items-center">
          <ToggleSideBar />
          <Link href="/" className="items-center hidden lg:block">
            <Image
              src={"/loyalty-logo-.png"}
              alt="logo"
              className="xl:w-64 xl:h-8"
              width={184}
              height={64}
            />
          </Link>
        </div>
        <div className="flex gap-5 items-center justify-end text-xl lg:text-3xl text-purple-800">
          <Button className="border-none">
            <FaBell className="h-8 w-8" />
          </Button>

          <UserMenu currentUser={currentUser} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
 */

//import { Button } from "@relume_io/relume-ui";
import Link from "next/link";
import UserMenu from "../UserMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
import ToggleSideBar from "./ToggleSideBar";
import Notifications from "../Notifications";

const Navbar = async () => {
  const currentUser = await getCurrentUser();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-6 xl:px-8 py-4">
        <div className="flex items-center">
          <ToggleSideBar />
          <Link href="/dashboard" className="items-center hidden lg:block">
            <span className="text-purple-800 font-bold text-2xl">HelpDesk</span>
          </Link>
        </div>
        <div className="flex gap-5 items-center justify-end text-xl lg:text-3xl text-purple-800">
          <Notifications />
          <UserMenu currentUser={currentUser} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
