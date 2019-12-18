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

router.post("/insert", (req, res, next) => {
  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var pass = cryptr.encrypt(req.body.pass);
  var rol = req.body.rol;

  UserModel.createUser(nombre, apellido, email, pass, rol);
  res.redirect("/user/list");
});

router.post("/delete", (req, res, next) => {
  UserModel.deleteUser(req.body.id);
  res.redirect("/user/list");
});

router.post("/login", async (req, res, next) => {
  var email = req.body.email;
  var pass = req.body.pass;
  var userLogin = await UserModel.loginUser(email, pass);
  if (userLogin) {
    var sess = req.session;
    var userSession = {
        email:userLogin.email,
        nombre:userLogin.nombre,
        apellido:userLogin.apellido,
        rol:userLogin.rol
    }
    sess.userSession = userSession;
    if(userSession.rol == 1){
        res.render("panelControlAdmin", { user:req.session.userSession })
    }
    
  } else {
    res.send("usuario noexiste");
  }
});

module.exports = router;
