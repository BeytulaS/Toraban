import { useState } from "react";
import GuestView from "./components/GuestView";
import Navbar from "./components/Navbar";
import UserView from "./components/UserView";

function App() {
  const [user, setUser] = useState(false);

  return (
    <>
      <Navbar user={user} />
      <main className="flex flex-col items-center justify-center bg-light dark:bg-dark dark:text-light">
        {user ? (
          <UserView setUser={setUser} />
        ) : (
          <GuestView setUser={setUser} />
        )}
      </main>
    </>
  );
}

export default App;
