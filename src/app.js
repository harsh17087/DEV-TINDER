const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("responsing from test route");
});
app.use("/home", (req, res) => {
  res.send("Responding from home route");
});
app.use("/", (req, res) => {
  res.send("Responding from root route");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
