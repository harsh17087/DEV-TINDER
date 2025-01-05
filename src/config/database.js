const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastenodejs:ky9BC8qgTm7cLx8Z@cluster0.pg22zrc.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
  // devTinder is Database
  // user is collection
  // one object is one document inside user collection

  
// connectDB()
//   .then(() => {
//     console.log("Connected to the database");
//   })
//   .catch((err) => {
//     console.log("Error connecting to the database", err);
//   });
