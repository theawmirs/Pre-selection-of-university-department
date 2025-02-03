// Constants for localStorage keys
const STORAGE_KEY = "todos";

// Get todos from localStorage
export const getTodos = () => {
  const todos = localStorage.getItem(STORAGE_KEY);
  return todos ? JSON.parse(todos) : [];
};

// Save todos to localStorage
export const saveTodos = (todos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

// Add a single todo to localStorage
export const addTodo = (todo) => {
  const todos = getTodos();
  todos.push(todo);
  saveTodos(todos);
};

// Remove a todo from localStorage
export const removeTodo = (id) => {
  const todos = getTodos();
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  saveTodos(filteredTodos);
};

// Update a todo in localStorage
export const updateTodo = (updatedTodo) => {
  const todos = getTodos();
  const updatedTodos = todos.map((todo) =>
    todo.id === updatedTodo.id ? updatedTodo : todo
  );
  saveTodos(updatedTodos);
};

// Clear all todos from localStorage
export const clearTodos = () => {
  localStorage.removeItem(STORAGE_KEY);
};
