import {
  FaKeyboard,
  FaGamepad,
  FaFileAlt,
  FaFileCode,
  FaFileContract,
  FaFileWord,
  FaListAlt,
} from "react-icons/fa";

export default function IconMap({ icon }) {
  switch (icon) {
    case "board":
      return <FaListAlt />;
    case "keyboard":
      return <FaKeyboard />;
    case "gamepad":
      return <FaGamepad />;
    case "file":
      return <FaFileAlt />;
    case "code":
      return <FaFileCode />;
    case "contract":
      return <FaFileContract />;
    case "word":
      return <FaFileWord />;

    default:
      break;
  }
}
