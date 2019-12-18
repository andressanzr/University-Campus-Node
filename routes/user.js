var express = require("express");
var session = require("express-session");

var router = express.Router();
const UserModel = require("..\\model\\User");

const Cryptr = require("cryptr");
const cryptr = new Cryptr("t45AS45asf");

router.get("/list", async (req, res, next) => {
  var result = await UserModel.findUsers();
  var errors = result.length ? "" : "no users";
  res.render("listUsers", { users: result, err: errors });
});

router.post("/insert", async (req, res, next) => {
  var repeatedEmail = await UserModel.checkRepeatedEmail(req.body.email);

  if (repeatedEmail) {
    req.flash("info", "Email repetido!");
    res.redirect("/signup");
  } else {
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    var email = req.body.email;
    var pass = cryptr.encrypt(req.body.pass);
    var rol = req.body.rol;
    UserModel.createUser(nombre, apellido, email, pass, rol);
    res.render("login", {
      registroOK: "¡Registro completado satisfactoriamente!",
      message: ""
    });
  }
});

router.post("/delete", (req, res, next) => {
  UserModel.deleteUser(req.body.email);
  res.redirect("/login");
});

router.post("/login", async (req, res, next) => {
  // TODO MIRAR PORQUE LOS PARAMETROS DEL POST SE QUEDAN GUARDADOS
  var email = req.body.email;
  var pass = req.body.pass;
  var userLogin = await UserModel.loginUser(email, pass);
  if (userLogin) {
    var sess = req.session;
    var userSession = {
      email: userLogin.email,
      nombre: userLogin.nombre,
      apellido: userLogin.apellido,
      rol: userLogin.rol
    };
    sess.userSession = userSession;
    if (userSession.rol == 1) {
      var usersList = await UserModel.findUsers();
      res.render("administrarUsuarios", {
        userSession: req.session.userSession,
        usersList: usersList
      });
    }
  } else {
    req.flash("info", "Email y/o contraseña incorrectos");
    res.redirect("/login");
  }
});

router.post("/editForward", (req, res, next) => {
  var userEditForward = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    pass: req.body.pass,
    rol: req.body.rol
  };
  res.render("editUser", { userEdit: userEditForward });
});

module.exports = router;
