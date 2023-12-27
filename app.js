const express = require("express");
const path = require("path");
const session = require("express-session");
const nocache = require("nocache");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const dotEnv = require("dotenv");

const adminRouter = require("./routes/adminRoute");
const userRouter = require("./routes/userRoute");

dotEnv.config();

const app = express();
require('./utilities/connection')(app)


// session middleware
app.use(session({
  // using secret key from environment variable
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'strict',
    secure: false,
    httpOnly: true
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.use('/uploads', express.static('public/uploads'));


app.set("view engine", "ejs");

// place nocache middleware here so that it affects all routes
app.use(nocache());

// route entry
app.use("/", userRouter);
app.use("/", adminRouter);