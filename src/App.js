import { useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import BoardsPage from "./pages/Boards";
import BoardPage from "./pages/Board";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(false);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <main className="flex flex-col items-center justify-center bg-light dark:bg-dark text-dark dark:text-light-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/boards"
            element={
              <ProtectedRoute>
                <BoardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/board/:id"
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
