import { supabase } from "../lib/supabase";

async function updateTaskStatus(taskId, status) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);

  return { data, error };
}

export { updateTaskStatus };
