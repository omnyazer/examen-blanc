import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import TaskForm from "../components/TaskForm";

const Tasks = ({ onAuthExpired }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [pendingTaskId, setPendingTaskId] = useState(null);
  const navigate = useNavigate();

  const handleAuthExpired = useCallback(() => {
    localStorage.removeItem("token");
    if (onAuthExpired) {
      onAuthExpired();
    }
    navigate("/login");
  }, [navigate, onAuthExpired]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleAuthExpired();
      return;
    }

    const fetchTasks = async () => {
      try {
        setError("");
        const res = await api.get("/tasks", {
          headers: { "x-auth-token": token },
        });
        setTasks(res.data);
      } catch (err) {
        setError("Impossible de charger les taches.");
        if (err.response?.status === 401) {
          handleAuthExpired();
        }
      }
    };

    fetchTasks();
  }, [handleAuthExpired]);

  const addTask = (task) => {
    setTasks((currentTasks) => [task, ...currentTasks]);
  };

  const deleteTask = async (id) => {
    try {
      setError("");
      setPendingTaskId(id);
      const token = localStorage.getItem("token");
      await api.delete(`/tasks/${id}`, {
        headers: { "x-auth-token": token },
      });
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      );
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthExpired();
        return;
      }

      setError("La suppression a echoue.");
    } finally {
      setPendingTaskId(null);
    }
  };

  const toggleTask = async (taskToUpdate) => {
    try {
      setError("");
      setPendingTaskId(taskToUpdate._id);
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/tasks/${taskToUpdate._id}`,
        { isCompleted: !taskToUpdate.isCompleted },
        {
          headers: { "x-auth-token": token },
        }
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskToUpdate._id ? res.data : task
        )
      );
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthExpired();
        return;
      }

      setError("La mise a jour a echoue.");
    } finally {
      setPendingTaskId(null);
    }
  };

  return (
    <div className="container">
      <h1>Mes Taches</h1>
      {error && <p>{error}</p>}
      <TaskForm addTask={addTask} onAuthExpired={handleAuthExpired} />
      {tasks.length === 0 && <p>Aucune tache pour le moment.</p>}
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`task-item ${task.isCompleted ? "completed" : ""}`}
          >
            <span>{task.title}</span>
            <div className="task-actions">
              <button
                type="button"
                className="task-toggle"
                onClick={() => toggleTask(task)}
                disabled={pendingTaskId === task._id}
              >
                {task.isCompleted ? "Rouvrir" : "Terminer"}
              </button>
              <button
                type="button"
                className="task-delete"
                onClick={() => deleteTask(task._id)}
                disabled={pendingTaskId === task._id}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
