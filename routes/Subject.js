const express = require("express");
const session = require("express-session");

var router = express.Router();

const UserModel = require("../model/User");
const SubjectModel = require("../model/Subject");

router.get("/insert", async (req, res, next) => {
  /*
  var alumno1 = await UserModel.findUserByEmail("alumno1@c.com");
  var alumno2 = await UserModel.findUserByEmail("alumno2@c.com");

  var prof1 = await UserModel.findUserByEmail("profe1@e.com");
  var prof2 = await UserModel.findUserByEmail("profe2@e.com");
  
  await SubjectModel.createSubject(
    "Android",
    "Android studio",
    ["jetbrains", "android.developers"],
    [alumno1],
    [prof1]
  );
  /*
  await SubjectModel.createSubject(
    "Acceso a datos",
    "instalar mongo",
    ["mongodb.es", "asd"],
    [alumno1, alumno2],
    [prof1, prof2]
  );
  */
});

module.exports = router;
