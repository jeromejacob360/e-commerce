const express = require('express');
const errorMiddleware = require('./middlewares/error');
const app = express();

app.use(express.json());

// Route imports
const productRoutes = require('./routes/productRoutes');
app.use('/api/v1', productRoutes);

// Error handler
app.use(errorMiddleware);

module.exports = app;
