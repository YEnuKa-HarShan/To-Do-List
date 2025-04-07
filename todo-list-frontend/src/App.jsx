import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // Edit mode එකේ task ID එක ගබඩා කරනවා
  const [editText, setEditText] = useState(""); // Edit කරන text එක ගබඩා කරනවා

  const API_URL = "http://localhost:8080/api/tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

  // Backend එකෙන් සියලුම tasks ලබාගන්න
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Tasks fetch කරන්න බැරි වුණා:", error);
    }
  };

  // නව task එකක් backend එකට එකතු කරනවා
  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      const response = await axios.post(API_URL, {
        text: newTask,
        completed: false,
      });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Task එකතු කරන්න බැරි වුණා:", error);
    }
  };

  // Task එකක් backend එකෙන් මකනවා
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Task මකන්න බැරි වුණා:", error);
    }
  };

  // Task එකක් completed ලෙස toggle කරනවා
  const toggleComplete = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask = {
      id: taskToUpdate.id,
      text: taskToUpdate.text,
      completed: !taskToUpdate.completed,
    };

    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTask);
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error("Task update කරන්න බැරි වුණා:", error.response ? error.response.data : error.message);
    }
  };

  // Task එකක් edit mode එකට යවනවා
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditText(task.text); // Current text එක edit field එකට දානවා
  };

  // Edited task එක save කරනවා
  const saveEdit = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate || editText.trim() === "") return;

    const updatedTask = {
      id: taskToUpdate.id,
      text: editText, // වෙනස් කරපු text එක යවනවා
      completed: taskToUpdate.completed,
    };

    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTask);
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      setEditingTaskId(null); // Edit mode එකෙන් එළියට එනවා
      setEditText("");
    } catch (error) {
      console.error("Task edit කරන්න බැරි වුණා:", error.response ? error.response.data : error.message);
    }
  };

  // Enter key press කලාම task එක එකතු කරනවා
  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  // Edit mode එකේදී Enter press කලාම save කරනවා
  const handleEditKeyPress = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
  };

  return (
    <div classLees="max-w-md mx-auto mt-10 p-5 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-5">To-Do List</h1>

      {/* Task එකක් ඇතුලත් කරන input field එක */}
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          placeholder="නව කාර්යයක් එක් කරන්න"
        />
        <button
          onClick={addTask}
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          එකතු කරන්න
        </button>
      </div>

      {/* Tasks ලැයිස්තුව පෙන්වනවා */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-2 bg-white rounded-lg"
          >
            {editingTaskId === task.id ? (
              // Edit mode එකේදී input field එක පෙන්වනවා
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                className="flex-1 p-1 border rounded focus:outline-none"
              />
            ) : (
              // Normal mode එකේදී task text එක පෙන්වනවා
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.text}
              </span>
            )}
            <div className="flex space-x-2">
              {editingTaskId === task.id ? (
                // Edit mode එකේදී Save button එක පෙන්වනවා
                <button
                  onClick={() => saveEdit(task.id)}
                  className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  සුරකින්න
                </button>
              ) : (
                <>
                  {/* Complete/Uncomplete button එක */}
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`p-1 text-white rounded ${
                      task.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {task.completed ? "නැවත" : "සම්පූර්ණයි"}
                  </button>
                  {/* Edit button එක එකතු කරනවා */}
                  <button
                    onClick={() => startEditing(task)}
                    className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    සංස්කරණය
                  </button>
                </>
              )}
              {/* Delete button එක */}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                මකන්න
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;