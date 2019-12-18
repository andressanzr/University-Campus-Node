var express = require("express");
var session = require("express-session");

var router = express.Router();

var session;

/* GET home page. */
router.get("/", function(req, res, next) {
  session = req.session;
  res.render("index");
});

router.get("/login", (req,res,next)=> {
  res.render("login");
});

router.get("/signup", (req,res,next)=> {
  res.render("signUp");
});

module.exports = router;
