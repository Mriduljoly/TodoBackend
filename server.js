const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;
const TodoModel = require('./Model/Todo')

const path = require('path')

app.use(express.static(path.join(__dirname,'/build')));

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Mridul:Mridul123@cluster0.2khlvfl.mongodb.net/NewTdAppDb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

  app.get('/api/alltodos', async (req, res) => {
    try {
      const todos = await TodoModel.find();
      console.log(todos);
      res.json(todos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.post('/api/addtodos', async (req, res) => {
    try {
      const todo = await TodoModel.create(req.body);
      console.log(todo);
      res.status(201).json(todo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.put('/api/updatetodos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      await TodoModel.findByIdAndUpdate(id, { completed });
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.delete('/api/deletetodos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await TodoModel.findByIdAndDelete(id);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.get('/*', function(req, res) { 
    res.sendFile(path.join(__dirname ,'/build/index.html')); });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });