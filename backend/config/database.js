const mongoose = require('mongoose');

const connectToDb = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log('Connected to MongoDB at ', process.env.MONGO_URI);
      console.log(`data.connection.host`, data.connection.host);
    });
};
module.exports = connectToDb;
