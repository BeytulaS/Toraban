import { useState } from "react";
import IconMap from "./IconMap";
import { addNewBoard } from "../services/boardsServices";
import { useUser } from "../providers/userProvider";
import { useNavigate } from "react-router-dom";

export default function NewBoardModal({ isOpen, setIsOpen }) {
  const user = useUser().user;
  const [board, setBoard] = useState({
    title: "",
    color: "orange",
    icon: "board",
  });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const navigate = useNavigate();

  const handleModalClose = (e) => {
    if (e.target.classList.contains("modal-container")) setIsOpen(false);
    return;
  };

  const handleColorChange = (color) => {
    setBoard({ ...board, color: color });
  };

  const handleIconChange = (icon) => {
    setBoard({ ...board, icon: icon });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let boardId;

    if (!user) throw new Error("User not logged in");

    const { boardInfo } = await addNewBoard(board, user.id);

    if (boardInfo !== null && boardInfo !== undefined && boardInfo.length > 0) {
      boardId = boardInfo[0].id;
      navigate(`/board/${boardId}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="overlay fixed top-0 left-0 w-screen h-screen bg-black opacity-70 z-10"></div>
          <div
            onClick={(e) => handleModalClose(e)}
            className="modal-container fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-20"
          >
            <div className="modal w-[95%] overflow-hidden md:max-w-lg bg-light dark:bg-dark rounded-sm  py-8">
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="w-3/4 mx-auto mt-8 flex flex-col"
              >
                <div className="input-box relative text-lg">
                  <input
                    type="text"
                    id="board-title"
                    required
                    className="w-full peer bg-transparent placeholder-transparent text-dark dark:text-light border-b-2 border-b-dark dark:border-b-light focus:border-b-2 dark:focus:border-b-orange focus:outline-none focus:border-b-orange py-0.5"
                    placeholder="Board title"
                    value={board.title}
                    onChange={(e) =>
                      setBoard({ ...board, title: e.target.value })
                    }
                  />
                  <label
                    htmlFor="board-title"
                    className="absolute font-semibold -top-6 left-0 text-dark dark:text-light peer-placeholder-shown:top-0 peer-focus:h-6 peer-focus:text-orange peer-focus:-top-6 transition-all"
                  >
                    Board title
                  </label>
                </div>
                <div className="text-lg font-semibold mt-8 flex justify-between gap-2">
                  <div className="flex gap-3 items-baseline cursor-pointer">
                    <label htmlFor="color-picker">Color Scheme</label>
                    <div
                      id="color-picker"
                      className="aspect-square w-6 rounded-sm p-0.5 border-2 border-dark dark:border-light"
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                    >
                      <div
                        className={`bg-${board.color} aspect-square rounded-sm`}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center cursor-pointer whitespace-nowrap">
                    <label htmlFor="icon-picker">Board Icon</label>
                    <div
                      id="icon-picker"
                      className="aspect-square h-6 rounded-sm p-0.5 border-2 text-center border-dark dark:border-light"
                      onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                    >
                      <div className={`aspect-square rounded-sm`}>
                        <IconMap icon={board.icon} />
                      </div>
                    </div>
                  </div>
                </div>
                {isColorPickerOpen && (
                  <ColorPicker setColor={handleColorChange} />
                )}
                {isIconPickerOpen && <IconPicker setIcon={handleIconChange} />}

                <button
                  type="submit"
                  className="w-full  text-white bg-orange  p-1 rounded-sm text-lg font-semibold mt-8 hover:bg-orange-600 transition-all ease-in-out duration-150 "
                >
                  Create board
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ColorPicker({ setColor }) {
  const colors = [
    "red",
    "orange",
    "lime",
    "green",
    "cyan",
    "blue",
    "purple",
    "pink",
  ];

  return (
    <div className="bg bg-light-300 dark:bg-dark-200 mt-2 w-full flex justify-evenly py-2 rounded-sm shadow-md cursor-pointer">
      {colors.map((color) => (
        <div
          id="color-picker"
          className="aspect-square w-6 rounded-sm p-0.5 border-2 border-dark dark:border-light"
          onClick={() => setColor(color)}
          key={color}
        >
          <div className={`bg-${color} aspect-square rounded-sm`}></div>
        </div>
      ))}
    </div>
  );
}

function IconPicker({ setIcon }) {
  const icons = [
    "board",
    "keyboard",
    "gamepad",
    "file",
    "code",
    "contract",
    "word",
  ];

  return (
    <div className="bg bg-light-300 dark:bg-dark-200 mt-2 w-full text-3xl flex justify-evenly py-2 rounded-sm shadow-md cursor-pointer">
      {icons.map((icon) => (
        <div
          className={`aspect-square rounded-sm`}
          onClick={() => setIcon(icon)}
          key={icon}
        >
          <IconMap icon={icon} />
        </div>
      ))}
    </div>
  );
}
