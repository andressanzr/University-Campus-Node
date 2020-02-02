const express = require("express");
const session = require("express-session");

var router = express.Router();

var fs = require("fs");

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
});

router.post("/editForward", async (req, res, next) => {
  var id = req.body.id;
  console.log(req.session.userSession.rol);
  // editar asignaturas admin
  if (req.session.userSession.rol == 1) {
    var subjectEditSearch = await SubjectModel.findSubjectByIdPopulateUsers(id);
    var allStudents = await UserModel.findUsersByRol(3);
    var allTeachers = await UserModel.findUsersByRol(2);

    res.render("editSubjectAdmin", {
      subjectEdit: subjectEditSearch,
      todosAlumnos: allStudents,
      todosProfesores: allTeachers,
      ficheros: files
    });
  } else if (req.session.userSession.rol == 2) {
    var files = null;
    console.log("f" + files);
    if (fs.existsSync(`./files/subjectFiles/${id}`)) {
      files = fs.readdirSync(`./files/subjectFiles/${id}`);
    }

    // render teachers edit subject
    var subjectEditSearch = await SubjectModel.findSubjectByIdPopulateUsers(id);
    res.render("editSubjectProfe", {
      subjectEdit: subjectEditSearch,
      ficheros: files,
      route: `/files/subjectFiles/${id}/`
    });
  } else {
    noPrivileges(res);
  }
});
router.post("/edit", async (req, res, next) => {
  var id = req.body.id;

  if (req.session.userSession.rol == 1) {
    var listaProfesores = req.body.listaProfesores;
    var listaAlumnos = req.body.listaAlumnos;
    var tipoAsig = req.body.tipoAsig;

    await SubjectModel.updateTeachersStudentsById(
      id,
      tipoAsig,
      listaProfesores,
      listaAlumnos
    );
    res.redirect("/administrarAsignaturas");
  } else if (req.session.userSession.rol == 2) {
    var nombre = req.body.nombre;
    var infoInsta = req.body.infoInstalar;
    var enlaces = req.body.enlace;

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
