import { useUser } from "../providers/userProvider";
import { IoMdCheckmark } from "react-icons/io";

export default function HomePage({ setUser }) {
  return (
    <>
      <section className="hero max-w-7xl w-full md:h-[85dvh] px-8 md:px-16 flex flex-col justify-between items-center">
        <div className="text-center py-24 w-3/4 flex flex-col items-center gap-8 ">
          <h1 className="text-3xl md:text-5xl">Plan. Organize. Execute.</h1>
          <p className="text-lg md:text-xl">
            A simple and straightforward kanban board to help you declutter your
            mind, organize your tasks, and get things done.
          </p>
          <button
            type="button"
            className=" bg-orange text-white px-4 py-2 text-2xl shadow-md rounded-sm"
          >
            Get started
          </button>
        </div>

        <div className="hidden w-full boards md:flex justify between gap-8">
          <ExampleBoard title={"To Do"} />
          <ExampleBoard title={"In Progress"} />
          <ExampleBoard title={"Completed"} />
        </div>
      </section>
      <Notice />

      <section className="h-96 w-full bg-light-200 dark:bg-dark-300 px-16">
        <h2 className="text-3xl md:text-5xl text-center py-12">
          What is a kanban board?
        </h2>
      </section>
    </>
  );
}

function ExampleBoard({ title }) {
  return (
    <div className="w-full bg-light-200 dark:bg-dark-300 shadow-md rounded-sm">
      <h2 className="relative text-lg font-bold py-2 bg-white dark:bg-dark-200 text-center flex items-center justify-center">
        {title}
      </h2>
      <div className="tasks h-48 p-4 flex flex-col gap-4">
        <div className="task bg-white dark:bg-dark-200 p-4 rounded-sm shadow-sm">
          <div className="flex gap-1 items-center">
            {title === "Completed" ? (
              <IoMdCheckmark className="text-green " />
            ) : (
              <IoMdCheckmark className="rounded-full scale-90 outline outline-2 outline-dark-200 dark:outline-light-200 opacity-50  text-transparent hover:opacity-100 hover:text-green dark:hover:bg-light-200  font-bold transition-all ease-in-out duration-150" />
            )}
            <p className="text-lg">
              {title === "To Do"
                ? "Plan"
                : title === "In Progress"
                ? "Organize"
                : "Execute"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Notice() {
  return (
    <section className="bg-light-200 dark:bg-dark-300 w-full flex flex-col p-10 justify-center items-center border-y-2 border-orange-600">
      <h2 className="text-3xl md:text-5xl text-center">Notice</h2>
      <p className="max-w-lg mt-8 text-lg">
        Hello there! Thank you for checking out toraban. This app was made as a
        passion project of mine and it's purpose is to make task management
        simpler. Please note that you the app is still in early stages and you
        might encounter bugs and issues. If you do, please shoot me a message
        with the description of the issue and I will try to fix it ASAP.
      </p>
    </section>
  );
}
