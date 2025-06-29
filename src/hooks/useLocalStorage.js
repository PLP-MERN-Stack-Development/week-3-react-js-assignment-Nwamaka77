import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * Note: In Claude artifacts, localStorage is not available, so we use memory storage
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Initial value if no stored value exists
 * @returns {Array} [storedValue, setValue] - Current value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  // In a real application, you would use localStorage
  // For Claude artifacts, we use in-memory storage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // In real app: const item = window.localStorage.getItem(key);
      // For demo, just return initial value
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // In a real application, you would save to localStorage:
      // window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook specifically for managing tasks with localStorage
 * @returns {Object} Tasks management functions and state
 */
export const useLocalStorageTasks = () => {
  const [tasks, setTasks] = useLocalStorage('plp-tasks', []);

  // Add a new task
  const addTask = (text) => {
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Toggle task completion status
  const toggleTask = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
  };

  // Clear completed tasks
  const clearCompletedTasks = () => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  };

  // Get task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      completionRate,
    };
  };

  // Update a task's text
  const updateTask = (taskId, newText) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, text: newText.trim() } : task
      )
    );
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    clearAllTasks,
    clearCompletedTasks,
    getTaskStats,
  };
};