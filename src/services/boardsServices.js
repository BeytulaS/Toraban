import { supabase } from "../lib/supabase";

async function addNewBoard(board, user) {
  const { data: boardData, error: boardError } = await supabase
    .from("boards")
    .insert([
      {
        board_title: board.title,
        color_scheme: board.color,
        icon: board.icon,
        owner_id: user,
      },
    ])
    .select("id");

  if (boardError) {
    throw new Error(boardError.message);
  }

  return {
    boardInfo: boardData,
  };
}

async function getBoardById(id) {
  const { data: boardData, error: boardError } = await supabase
    .from("boards")
    .select()
    .eq("id", id)
    .single();

  return { boardData, boardError };
}

async function getListsForBoard(boardId) {
  const { data, error } = await supabase
    .from("lists")
    .select()
    .eq("board_id", boardId);

  return { data, error };
}

async function addTaskToBoard(task, userId, boardId) {
  const { data, error } = await supabase.from("tasks").insert([
    {
      title: task.title,
      status: task.status,
      position: task.position,
      board_id: boardId,
      owner_id: userId,
      steps: [],
    },
  ]);

  return { data, error };
}

async function deleteTaskById(id) {
  const { data, error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) console.log("error", error);
  else console.log("task deleted");
  return { data, error };
}

export {
  addNewBoard,
  getBoardById,
  getListsForBoard,
  deleteTaskById,
  addTaskToBoard,
};
