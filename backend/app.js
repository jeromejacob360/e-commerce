const express = require('express');
const app = express();

app.use(express.json());

// Route imports
const productRoutes = require('./routes/productRoutes');
app.use('/api/v1', productRoutes);

module.exports = app;
