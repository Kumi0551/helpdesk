// Components/Toggle.tsx
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Toggle = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />;
};

export default Toggle;
