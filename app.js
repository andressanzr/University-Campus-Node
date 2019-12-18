var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

var ejs = require("ejs");

const mongoose = require("mongoose");
// connect to MongoDB
var url = "mongodb://localhost:27017/entregable";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.once("open", () => {
  console.log("connected");
});

var app = express();

//session set up
app.use(
  session({
    secret: "shtyo12poi",
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true }
  })
);

// view engine setup
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { errors: err });
});

module.exports = app;
