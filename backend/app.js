const cookieParser = require('cookie-parser');
const express = require('express');
const errorMiddleware = require('./middlewares/error');
const app = express();

// Route imports
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orderRoutes);

// Error handler
app.use(errorMiddleware);

module.exports = app;
