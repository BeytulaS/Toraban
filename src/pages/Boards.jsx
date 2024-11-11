import { useEffect, useState } from "react";
import { useUser } from "../providers/userProvider";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function BoardsPage() {
  const user = useUser().user;
  const [userBoards, setUserBoards] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserBoards = async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*, tasks:board_id (count)")
        .eq("owner_id", user.id);

      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        setUserBoards(data);
      }
    };
    fetchUserBoards();
  }, []);

  return (
    <section className="text-center">
      {userBoards ? (
        userBoards.map((board) => <Board key={board.id} board={board} />)
      ) : (
        <>
          <h1>Looks like you don't have any boards!</h1>
          <h2>Start by creating your first board</h2>
          <Link to={"/"} className="">
            New board
          </Link>
        </>
      )}
    </section>
  );
}

function Board({ board }) {
  return (
    <article>
      <h1>{board.board_title}</h1>
    </article>
  );
}
