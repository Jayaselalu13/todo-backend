const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for todos (replace with DB later)
let todos = [
  {
    id: 1,
    title: 'Sample Todo 1',
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Sample Todo 2',
    completed: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Sample Todo 3',
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Sample Todo 4',
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Sample Todo 5',
    completed: true,
    created_at: new Date().toISOString(),
  },
];

let nextId = 6;

// GET /todos - Fetch all todos (limit 5 for demo)
app.get('/todos', (req, res) => {
  const limit = parseInt(req.query._limit) || 5;
  res.json(todos.slice(0, limit));
});

// POST /todos - Add new todo
app.post('/todos', (req, res) => {
  const { title, completed = false, userId = 1 } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const newTodo = {
    id: nextId++,
    title,
    completed,
    created_at: new Date().toISOString(),
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH /todos/:id - Toggle completed
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  todo.completed = !todo.completed;
  res.json(todo);
});

// DELETE /todos/:id - Delete todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Todo API server running on port ${PORT}`);
});
