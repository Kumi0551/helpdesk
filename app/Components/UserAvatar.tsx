import Image from "next/image";
import { FaCircleUser } from "react-icons/fa6";

interface UserAvatarProps {
  src?: string | null | undefined;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src }) => {
  if (src) {
    return (
      <Image
        src={src}
        alt="user avatar"
        className="rounded-full"
        height={30}
        width={30}
      />
    );
  }
  return <FaCircleUser size={24} />;
};

export default UserAvatar;
