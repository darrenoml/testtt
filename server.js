// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const sequelize = require('./config/database'); // Sequelize instance
const Todo = require('./models/Todo'); // Sequelize model
const todoRoutes = require('./routes/todos'); // Routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect and sync database
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to SQLite database');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ Database synced');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

// Load Swagger JSON
const swaggerDocument = JSON.parse(
  fs.readFileSync('./swagger/swagger.json', 'utf8')
);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust to match frontend port
}));
app.use(express.json());

// Routes
app.use('/todos', todoRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
