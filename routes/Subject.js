const express = require("express");
const session = require("express-session");

var router = express.Router();

const UserModel = require("../model/User");
const SubjectModel = require("../model/Subject");

router.post("/insert", async (req, res, next) => {
  if (req.session.userSession.rol == 1) {
    var nombre = req.body.nombre;
    var infoInstalar = req.body.infoInstalar;
    var enlaces = req.body.enlace;
    var profResponsables = req.body.listaProfesores;
    var alumnos = req.body.listaAlumnos;

    await SubjectModel.createSubject(
      nombre,
      infoInstalar,
      enlaces,
      profResponsables,
      alumnos
    );
    res.redirect("/administrarAsignaturas");
  } else {
    noPrivileges(res);
  }
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
    var subjectEditSearch = await SubjectModel.findSubjectByIdPopulateUsers(id);
    res.render("editSubjectProfe", { subjectEdit: subjectEditSearch });
  } else {
    noPrivileges(res);
  }
});
router.post("/edit", async (req, res, next) => {
  var id = req.body.id;

  if (req.session.userSession.rol == 1) {
    var listaProfesores = req.body.listaProfesores;
    var listaAlumnos = req.body.listaAlumnos;

    await SubjectModel.updateTeachersStudentsById(
      id,
      listaProfesores,
      listaAlumnos
    );
    res.redirect("/administrarAsignaturas");
  } else if (req.session.userSession.rol == 2) {
    var nombre = req.body.nombre;
    var infoInsta = req.body.infoInstalar;
    var enlaces = req.body.enlaces;

    await SubjectModel.updateNombreInfoEnlacesById(
      id,
      nombre,
      infoInsta,
      enlaces
    );
    res.redirect("/administrarAsignaturasProfesor");
  }
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
