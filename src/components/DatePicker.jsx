import { FaCalendar } from "react-icons/fa";

export default function DatePicker() {
  return (
    <div className="flex">
      <FaCalendar />
      <input
        type="text"
        name=""
        id=""
        placeholder="dd/mm/yyyy"
        className="bg-white dark:bg-dark-200 w-full resize-none text-lg font-semibold focus:outline-none border-b-2 border-dark-100 dark:border-dark-300 focus:border-orange dark:focus:border-orange"
      />
    </div>
  );
}
