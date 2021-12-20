const app = require('./app');
const dotenv = require('dotenv');
const connectToDb = require('./config/database');

dotenv.config({ path: 'backend/config/config.env' });

// Connect to MongoDB
connectToDb();

app.listen(process.env.PORT, () => {
  console.log('Server started at port ' + process.env.PORT);
});
