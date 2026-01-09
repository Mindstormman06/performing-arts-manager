import express from 'express';
import cors from 'cors';

import { expressConfig } from './src/config/index.js';
import sequelize from './src/services/db.service.js';
import models from './src/models/index.js';

const app = express();
app.use(cors());
app.use(express.json());

sequelize.sync({ alter: true })
  .then(() => console.log('Database & tables created!'))
  .catch((err) => console.error('Error syncing database:', err));

app.get('/server-up', (res) => {
    res.json({ message: 'ok' });
});


app.post('/api/users', async (req, res) => {
    try {
        const newUser = await models.User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.use((req, res, next) => {
    next({
        statusCode: 404,
        message: "Route Not Found"
    })
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  console.error(err);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });

  return;
});

app.listen(expressConfig.port, () => {
  console.log(`Server is running on http://localhost:${expressConfig.port}`);
});