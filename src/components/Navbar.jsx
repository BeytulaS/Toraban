import { HiMenu } from "react-icons/hi";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar({ user }) {
  return (
    <header className="flex bg-light text-dark dark:bg-dark dark:text-light">
      <nav className="w-full">
        <ul className="flex items-center justify-between mt-4 px-4 md:px-10 md:mt-6">
          <li className="text-2xl md:text-4xl w-[107px]">
            <ThemeSwitcher />
          </li>
          <li className="logo relative cursor-pointer">
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
          {user ? (
            <li className="text-2xl md:text-4xl">
              <HiMenu />
            </li>
          ) : (
            <li>
              <button
                type="button"
                className="px-2 py-1 bg-orange-500 dark:text-white rounded-sm text-lg "
              >
                Get started
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
