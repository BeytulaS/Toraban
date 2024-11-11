import { useEffect, useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import ThemeSwitcher from "./ThemeSwitcher";
import LoginModal from "./LoginModal";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../providers/userProvider";
import { supabase } from "../lib/supabase";
import NewBoardModal from "./NewBoardModal";
import IconMap from "./IconMap";
import { RiCloseFill } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";

export default function Navbar({ setUser }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const user = useUser();
  const navigate = useNavigate();

  return (
    <header className="flex bg-light text-dark dark:bg-dark dark:text-light">
      <nav className="w-full">
        <ul className="flex items-center justify-between mt-4 px-4 md:px-10 md:mt-6">
          <li className="text-2xl md:text-4xl">
            <ThemeSwitcher />
          </li>
          <li
            className="logo relative cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/images/logo-3.png"
              alt="Logo"
              className="absolute top-[-1px] left-[-20px] w-16 md:w-28 md:left-[-36px] md:top-[-7px] rotate-[-29deg] z-0"
            />
            <h1
              className=" text-4xl md:text-6xl text-dark dark:text-light z-10 relative font-semibold"
              aria-label="Home"
            >
              Toraban
            </h1>
          </li>
          {user.user ? (
            <li className="text-2xl md:text-4xl">
              <button
                type="button"
                onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                onMouseEnter={() => setIsSideMenuOpen(true)}
                className="cursor-pointer z-20"
              >
                <HiMenuAlt4 />
              </button>
              <SideMenu
                isOpen={isSideMenuOpen}
                setIsOpen={setIsSideMenuOpen}
                user={user}
              />
            </li>
          ) : (
            <li>
              <button
                type="button"
                className="px-2 py-1 bg-orange-500 dark:text-light font-semibold rounded-sm text-2xl md:text-4xl"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <FiLogIn />
              </button>
            </li>
          )}
        </ul>
      </nav>
      <LoginModal
        isOpen={isLoginModalOpen}
        setIsOpen={setIsLoginModalOpen}
        setUser={setUser}
      />
    </header>
  );
}

function SideMenu({ isOpen, setIsOpen, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBoards, setUserBoards] = useState(null);

  const navigate = useNavigate();

  async function handleLogOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    if (!user.user) return;

    //Get initial data
    const fetchUserBoards = async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("owner_id", user.user.id)
        .select("*");

      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        setUserBoards(data);
      }
    };

    fetchUserBoards();
  }, [user.user]);

  async function handleDeleteBoard(boardId) {
    console.log("Deleting board", boardId);
    setUserBoards(userBoards.filter((board) => board.id !== boardId));

    const { error } = await supabase.from("boards").delete().eq("id", boardId);
    if (error) {
      toast.error("An error occurred while deleting the board");
    }
  }

  if (!user.user) return null;

  return (
    <>
      <Toaster />
      <aside
        className={`fixed top-0 right-0 h-screen bg-light-200 md:bg-opacity-50 dark:bg-dark-300 md:max-w-sm backdrop-blur-md z-10 ${
          isOpen ? "w-screen md:w-1/4" : "w-0"
        } transition-all ease-in-out duration-300 flex flex-col justify-between whitespace-nowrap`}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="boards mt-4 mb-4 max-h-[80%]">
          <h2 className="text-center mb-4">My boards</h2>
          {userBoards && (
            <div className="flex flex-col gap-0.5 max-h-full overflow-y-scroll">
              {userBoards.map((board) => (
                <div
                  key={board.id}
                  className="group text-xl flex justify-between items-center mx-4 px-2 py-2 hover:bg-light-300 dark:hover:bg-dark transition-all ease-in-out duration-150 rounded-sm cursor-pointer"
                >
                  <Link
                    to={`/board/${board.id}`}
                    className="flex items-center w-full"
                  >
                    <IconMap icon={board.icon} />
                    <h3 className="ml-2">{board.board_title}</h3>
                  </Link>
                  <button
                    type="button"
                    className="hidden opacity-0 group-hover:block group-hover:opacity-60"
                    aria-label="Delete board"
                    onClick={() => handleDeleteBoard(board.id)}
                  >
                    <RiCloseFill className=" hover:text-red hover:scale-105 transition-all duration-150 ease-in-out" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-4">
          <button
            type="button"
            className="text-[20px] w-full mt-8 hover:bg-light-300 dark:hover:bg-dark rounded-sm transition-all ease-in-out duration-150"
            onClick={() => setIsModalOpen(true)}
          >
            +Add a new board
          </button>
          <div className="user whitespace-nowrap flex justify-between items-center py-4 px-4 text-[18px]">
            <p className=" flex items-center gap-1">
              <FaUserCircle />
              {user.user?.email}
            </p>
            <button
              type="button"
              onClick={() => handleLogOut()}
              className="hover:bg-light-300 dark:hover:bg-dark rounded-sm transition-all ease-in-out duration-150 p-2"
              aria-label="Log out"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>
      <NewBoardModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
}
