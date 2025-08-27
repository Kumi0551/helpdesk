import { getCurrentUser } from "@/actions/getCurrentUser";
import SideBar from "./SideBarNav";

const SideBarNav = async () => {
  const currentUser = await getCurrentUser();
  return (
    <>
      <SideBar currentUser={currentUser} />
    </>
  );
};

export default SideBarNav;
