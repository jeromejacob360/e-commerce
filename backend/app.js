const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

// In heroku, we will set NODE_ENV
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({ path: './backend/config/config.env' });
}

const errorMiddleware = require('./middlewares/error');
const app = express();

// Route imports
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(fileUpload());

app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api', paymentRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../frontend/build/index.html')),
);

// Error handler
app.use(errorMiddleware);

module.exports = app;
