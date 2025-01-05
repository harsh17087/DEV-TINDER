const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")
// once database is connected, then only listen to the requests.

connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

app.post("/signup",async(req,res)=>{

  // Creating new instance of User Model
  const user = new User({
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "virat.kohli@gmail.com",
    password: "12345678",
    age: 35,
    gender: "Male",
  })
  try {
    await user.save()
    res.send("User created successfully")
  }catch(err){
    res.status(400).send("Error while creating user",+ err.message)
  }
})