const mongoose = require("mongoose");
console.log(process.env.DB_URI, "db");
const connectDB = async () => {
  await mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`database connected at : ${data.connection.host} `);
  });
};

module.exports = connectDB;
// if you change the internet connection then you have to change the proxy to check go
