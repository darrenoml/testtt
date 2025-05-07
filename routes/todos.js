// routes/todos.js
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// POST create new todo
router.post('/', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const newTodo = await Todo.create({ title, description, completed });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create todo' });
  }
});

// PUT update existing todo
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.update({ title, description, completed });
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to update todo' });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.destroy();
      res.json({ message: 'Todo deleted' });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
