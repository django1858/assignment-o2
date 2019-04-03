const express = require("express");
const app = express();
const login = require("./API/authController");
const userdetails = require("./API/usersController");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/users", login);
app.use("/api/users", userdetails);
app.listen(5000, () => console.log("Server Running..."));

