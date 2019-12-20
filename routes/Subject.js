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

router.post("/editForward", async (req, res, next) => {
  var id = req.body.id;
  /*
  var subjectEditForward = {
    id: req.body.id,
    nombre: req.body.nombre,
    infoInstalar: req.body.apellido,
    enlaces: req.body.email,
    profResponsables: req.body.pass,
    alumnos: req.body.rol
  };
  */
  // editar asignaturas admin
  if (req.session.userSession.rol == 1) {
    var subjectEditSearch = await SubjectModel.findSubjectByIdPopulateUsers(id);
    var allStudents = await UserModel.findUsersByRol(3);
    var allTeachers = await UserModel.findUsersByRol(2);
    res.render("editSubjectAdmin", {
      subjectEdit: subjectEditSearch,
      todosAlumnos: allStudents,
      todosProfesores: allTeachers
    });
  } else if (req.session.userSession.rol == 2) {
    // render teachers edit subject
  } else {
    noPrivileges(res);
  }
});
router.post("/edit", async (req, res, next) => {
  var id = req.body.id;
  var listaProfesores = req.body.listaProfesores;
  var listaAlumnos = req.body.listaAlumnos;

  await SubjectModel.updateTeachersStudentsById(
    id,
    listaProfesores,
    listaAlumnos
  );
  res.redirect("/administrarAsignaturas");
});

router.post("/delete", (req, res, next) => {
  var id = req.body.id;
  SubjectModel.deleteSubjectById(id);
  res.redirect("/administrarAsignaturas");
});

const noPrivileges = res => {
  res.render("error", {
    errors: "You don´t have enough privileges<a href='/login'>Login</a>"
  });
};
module.exports = router;
