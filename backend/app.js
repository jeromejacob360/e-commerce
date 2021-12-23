const cookieParser = require('cookie-parser');
const express = require('express');
const errorMiddleware = require('./middlewares/error');
const app = express();

app.use(express.json());
app.use(cookieParser());

// Route imports
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);

// Error handler
app.use(errorMiddleware);

module.exports = app;
