import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  IoMdArrowDropdownCircle,
  IoMdCheckmark,
  IoIosAddCircle,
} from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { useUser } from "../providers/userProvider";
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateTaskStatus } from "../services/taskServices";
import toast, { Toaster } from "react-hot-toast";

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

const lists = [
  {
    id: "to-do",
    title: "To Do",
    status: "to-do",
  },
  {
    id: "in-progress",
    title: "In progress",
    status: "in-progress",
  },
  {
    id: "completed",
    title: "Completed",
    status: "completed",
  },
];

export default function BoardPage() {
  const { id } = useParams();
  const user = useUser().user;
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    const fetchBoard = async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("id", id)
        .single();
      if (error) setErrors(error);
      if (data) setBoard(data);
    };
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("board_id", id);
      if (error) setErrors(error);
      if (data) setTasks(data);
    };
    fetchBoard();
    fetchTasks();
  }, [id]);

  const handleMoveTaskToNext = async (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    const newTasks = [...tasks];
    if (task.status === "to-do") {
      const { data, error } = await updateTaskStatus(taskId, "in-progress");
      if (error) {
        toast.error("Error updating task status");
        return;
      }
      newTasks[taskIndex].status = "in-progress";
      newTasks[taskIndex].position = tasks.filter(
        (task) => task.status === "in-progress"
      ).length;
    } else if (task.status === "in-progress") {
      const { data, error } = await updateTaskStatus(taskId, "completed");
      if (error) {
        toast.error("Error updating task status");
        return;
      }
      newTasks[taskIndex].status = "completed";
      newTasks[taskIndex].position = tasks.filter(
        (task) => task.status === "completed"
      ).length;
    }
    setTasks(newTasks);
    return true;
  };

  const handleDeleteTask = async (taskId) => {
    //Find the task status
    const selectedTask = tasks.find((task) => task.id === taskId);
    const newTasks = [...tasks];

    //Delete the task from the array
    newTasks.splice(
      tasks.findIndex((task) => task.id === taskId),
      1
    );

    //Update the position of the tasks in the same status
    newTasks
      .filter((task) => task.status === selectedTask.status)
      .forEach((task, index) => {
        task.position = index + 1;
      });

    setTasks(newTasks);

    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) console.log(error);
    if (data) console.log(data);
  };

  const handleAddTask = async (task) => {
    const { data: newTaskId, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: task.title,
          status: task.status,
          position: task.position,
          board_id: board.id,
          owner_id: user.id,
        },
      ])
      .select("id");

    if (error) console.log(error);
    if (newTaskId) {
      const newTasks = [...tasks];
      newTasks.push({
        id: newTaskId[0].id,
        ...task,
      });
      setTasks(newTasks);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeTask = tasks.find((task) => task.id === active.id);
      const overTask = tasks.find((task) => task.id === over.id);
      const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);
      const overTaskIndex = tasks.findIndex((task) => task.id === over.id);
      const newTasks = [...tasks];

      //Move the active task to the position of the over task
      newTasks.splice(activeTaskIndex, 1);
      newTasks.splice(overTaskIndex, 0, activeTask);

      //Update the position of the tasks in the same status
      newTasks
        .filter((task) => task.status === activeTask.status)
        .forEach((task, index) => {
          task.position = index + 1;
        });

      //Update the position of the tasks in the same status
      newTasks
        .filter((task) => task.status === overTask.status)
        .forEach((task, index) => {
          task.position = index + 1;
        });

      setTasks(newTasks);

      //Update the position of the tasks in the database
      newTasks.forEach(async (task) => {
        const { data, error } = await supabase
          .from("tasks")
          .update({ position: task.position })
          .eq("id", task.id);

        if (error) console.log(error);
        if (data) console.log(data);
      });
    }
  };

  const handleAddStep = async (step, taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            steps: [...task.steps, { title: step, is_completed: false }],
          };
        }
        return task;
      })
    );

    const { data, error } = await supabase
      .from("tasks")
      .update({
        steps: [
          ...tasks.find((task) => task.id === taskId).steps,
          { title: step, is_completed: false },
        ],
      })
      .eq("id", taskId);

    if (error) console.log(error);
    if (data) console.log(data);
  };

  const changeStepStatus = async (taskId, stepIndex) => {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newSteps = task.steps.map((step, index) => {
          if (index === stepIndex) {
            step.is_completed = !step.is_completed;
          }
          return step;
        });
        return { ...task, steps: newSteps };
      }
      return task;
    });
    setTasks(newTasks);

    const { data, error } = await supabase
      .from("tasks")
      .update({ steps: newTasks.find((task) => task.id === taskId).steps })
      .eq("id", taskId);

    if (error) toast.error("Error updating step status");
  };

  if (!board) return <p>Loading...</p>;
  if (errors) return <p>{errors.message}</p>;

  return (
    <>
      <Toaster />
      <h1 className="text-3xl logo font-semibold">{board.board_title}</h1>
      <section className="lists-container max-w-7xl w-full h-[75dvh] max-h-[75dvh] grid grid-cols-1 md:grid-cols-3 py-4 px-10 gap-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          {lists.map((list) => (
            <List
              key={list.id}
              list={list}
              tasksInList={tasks
                .filter((task) => task.status === list.status)
                .sort((a, b) => a.position - b.position)}
              addTask={handleAddTask}
              deleteTask={handleDeleteTask}
              moveTask={handleMoveTaskToNext}
              addStep={handleAddStep}
              toggleStepStatus={changeStepStatus}
            />
          ))}
        </DndContext>
      </section>
    </>
  );
}

function List({
  list,
  tasksInList,
  addTask,
  deleteTask,
  moveTask,
  addStep,
  toggleStepStatus,
}) {
  const [addTaskMode, setAddTaskMode] = useState(false);

  const toggleAddTask = () => {
    setAddTaskMode(!addTaskMode);
  };

  return (
    <div className="list-container bg-light-200 dark:bg-dark-300 shadow-md flex flex-col md:h-[70dvh] md:max-h-[70dvh] rounded-sm">
      <h2 className="relative text-lg font-bold py-2 bg-white dark:bg-dark-200 text-center flex items-center justify-center">
        {list.title}
        <span className="text-base text-dark-200 absolute left-0 ml-5 rounded-full px-2 bg-light-200">
          {tasksInList.length}
        </span>
      </h2>
      <ul className="tasks-list mt-2 py-2 px-4 h-full overflow-y-scroll overflow-x-clip flex flex-col gap-3">
        <SortableContext
          items={tasksInList.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasksInList.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              moveTask={moveTask}
              addStep={addStep}
              toggleStepStatus={toggleStepStatus}
            />
          ))}
        </SortableContext>
      </ul>
      {addTaskMode ? (
        <NewTask
          addTask={addTask}
          toggleAddTask={toggleAddTask}
          status={list.id}
          position={tasksInList.length + 1}
        />
      ) : (
        <button
          type="button"
          onClick={toggleAddTask}
          className="mx-4 my-4 bg-white dark:bg-dark-200 flex items-center gap-1 p-2 rounded-sm shadow-sm text-lg font-semibold hover:outline hover:outline-2 hover:outline-orange"
        >
          <IoIosAddCircle className="text-orange text-xl" />
          New task
        </button>
      )}
    </div>
  );
}

function SortableTask({
  task,
  deleteTask,
  moveTask,
  addStep,
  toggleStepStatus,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isAddingStep, setIsAddingStep] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      position: task.position,
    },
  });

  const style = {
    touchAction: "none",
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteTask = async () => {
    setIsExpanded(false);
    await timeout(250);
    setIsDeleting(true);
    await timeout(250);
    deleteTask(task.id);
    setIsDeleting(false);
  };

  const handleMoveTaskToNext = async (taskId) => {
    setIsExpanded(false);
    setIsMoving(true);
    const success = await moveTask(taskId);
    if (success) setIsMoving(false);
  };

  if (isDragging) {
    return (
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white dark:bg-dark-200 px-2 py-2 rounded-sm shadow-2xl hover:outline hover:outline-2 hover:outline-orange-600 
          z-10`}
      >
        <div className="task-header flex justify-between items-center">
          <h3 className="text-lg font-semibold">{task.title}</h3>
        </div>
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-dark-200 px-2 py-2 rounded-sm shadow-sm hover:outline hover:outline-2 hover:outline-orange-600 ${
        isDeleting ? "delete-animation" : ""
      } ${isMoving ? "move-animation" : ""}`}
    >
      <div className="task-header flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {task.status === "completed" ? (
            <IoMdCheckmark />
          ) : (
            <button type="button" onClick={() => handleMoveTaskToNext(task.id)}>
              <IoMdCheckmark className="rounded-full scale-90 outline outline-2 outline-dark-200 dark:outline-light-200 opacity-50  text-transparent hover:opacity-100 hover:text-dark-200 dark:hover:bg-light-200  font-bold transition-all ease-in-out duration-150" />
            </button>
          )}

          <h3 className="text-lg font-semibold">{task.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => handleExpand()}
          className="shrink-0"
        >
          <IoMdArrowDropdownCircle
            className={`text-2xl text-orange hover:text-orange-600 dark:hover:bg-light-100 rounded-full transition-all ease-in-out duration-150 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <div
        className={`more-info  ${
          isExpanded ? "max-h-64" : "max-h-0 "
        } transition-all overflow-hidden ease-in-out duration-300`}
      >
        <div className="mt-2 text-base">
          {task.steps &&
            task.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 mt-1">
                {step.is_completed ? (
                  <button
                    type="button"
                    onClick={() => toggleStepStatus(task.id, index)}
                  >
                    <IoMdCheckmark />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleStepStatus(task.id, index)}
                  >
                    <IoMdCheckmark className="rounded-full text-sm scale-90 outline outline-2 outline-dark-200 dark:outline-light-200 opacity-50  text-transparent hover:opacity-100 hover:text-dark-200 dark:hover:bg-light-200  font-bold transition-all ease-in-out duration-150" />
                  </button>
                )}
                <p>
                  {step.title} {step.is_completed}
                </p>
              </div>
            ))}

          <NewStep
            isOpen={isAddingStep}
            setIsOpen={setIsAddingStep}
            taskId={task.id}
            addStep={addStep}
          />
          <button
            type="button"
            className="py-0.5 hover:bg-light-300 dark:hover:bg-dark-100 rounded-sm transition-all ease-in-out duration-150"
            onClick={() => setIsAddingStep(true)}
          >
            + Add step
          </button>
        </div>
        <div className="controls w-full flex justify-end gap-1.5 px-1 text-lg">
          <button
            type="button"
            className="hover:scale-[1.15] hover:text-red focus:text-red transform transition-all ease-in-out duration-150"
            title="Delete"
            onClick={handleDeleteTask}
          >
            <AiFillDelete />
          </button>
        </div>
      </div>
    </li>
  );
}

function NewStep({ isOpen, setIsOpen, addStep, taskId }) {
  const [step, setStep] = useState("");

  const handleClose = (e) => {
    setStep("");
    setIsOpen(false);
  };

  const handleAddStep = () => {
    if (step.length < 3) {
      console.error("Step must be at least 3 characters long");
      return;
    }
    if (!taskId) {
      console.error("Task id is required");
      return;
    }
    if (step.length > 256) {
      console.error("Step must be at most 256 characters long");
      return;
    }

    addStep(step, taskId);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="flex gap-1" onBlur={(e) => handleClose(e)}>
      <input
        type="text"
        autoFocus
        value={step}
        onChange={(e) => setStep(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddStep();
          if (e.key === "Escape") handleClose(e);
        }}
        className="bg-white dark:bg-dark-200 w-full resize-none text-lg font-semibold focus:outline-none border-b-2 border-dark-100 dark:border-dark-300 focus:border-orange dark:focus:border-orange"
      />
      <button type="button" onClick={handleAddStep} className="mr-1">
        <IoMdCheckmark />
      </button>
    </div>
  );
}

function NewTask({ addTask, toggleAddTask, status, position }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: status,
    position: position,
    steps: [],
  });

  const handleAddTask = async () => {
    if (task.title.length < 3) return;
    toggleAddTask();
    addTask(task);
  };

  const handleToggleAddTask = (e) => {
    if (e.relatedTarget) return;
    toggleAddTask();
  };

  return (
    <div
      onBlur={(e) => handleToggleAddTask(e)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleAddTask();
        if (e.key === "Escape") toggleAddTask();
      }}
      className="new-task mx-4 my-4 bg-white dark:bg-dark-200 px-2 py-2 rounded-sm shadow-sm hover:outline hover:outline-2 hover:outline-orange-600 
        "
    >
      <div className="task-header flex justify-between items-center">
        <div className="w-full flex gap-3 items-center">
          <input
            type="text"
            className="bg-white dark:bg-dark-200 w-full resize-none text-lg font-semibold focus:outline-none border-b-2 border-dark-100 dark:border-dark-300 focus:border-orange dark:focus:border-orange"
            maxLength={128}
            autoFocus
            value={task.title}
            placeholder="New task"
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <button
            type="button"
            className="shrink-0 text-lime disabled:text-dark-200 disabled:dark:text-light-400 disabled:opacity-50"
            disabled={task.title.length < 3}
            onClick={handleAddTask}
          >
            <IoMdCheckmark className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
