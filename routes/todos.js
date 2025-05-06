// routes/todos.js
const express = require('express');
const router = express.Router();
const db = require('../firebase');

const todosRef = db.collection('todos');

// GET all todos
router.get('/', async (req, res) => {
  const snapshot = await todosRef.get();
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(todos);
});

// POST new todo
router.post('/', async (req, res) => {
  const { title, completed } = req.body;
  const newTodo = await todosRef.add({ title, completed: completed || false });
  res.status(201).json({ id: newTodo.id });
});

// PUT update todo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  await todosRef.doc(id).update({ title, completed });
  res.json({ message: 'Todo updated' });
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await todosRef.doc(id).delete();
  res.json({ message: 'Todo deleted' });
});

module.exports = router;