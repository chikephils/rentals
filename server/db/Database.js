const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.MONGO_URL, {}).then((data) => {
    console.log(
      `mongoose connected to server: ${data.mongoose.connection.host}`
    );
  });
};

module.exports = connectDatabase;
