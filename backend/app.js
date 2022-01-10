const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const dotenv = require('dotenv');
dotenv.config({ path: '../backend/config/config.env' });

const errorMiddleware = require('./middlewares/error');
const app = express();

// Route imports
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', cartRoutes);
app.use('/api/v1', paymentRoutes);

// Error handler
app.use(errorMiddleware);

module.exports = app;
