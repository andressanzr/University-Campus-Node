var express = require("express");
var router = express.Router();
const UserModel = require("..\\model\\User");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/users/insert", (req, res, next) => {
  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var pass = req.body.pass;
  var rol = req.body.rol;

  UserModel.createUser(nombre, apellido, email, pass, rol);
  res.redirect("/users/list");
});

router.get("/users/list", async (req,res,next)=>{
  var result =await UserModel.findUsers();
  var errors = result.length ? "" : "no users";
  res.render("listUsers", {users: result , err : errors});
});

router.post("/users/delete", (req, res, next) =>{
  UserModel.deleteUser(req.body.id);
  res.redirect("/users/list");
})

module.exports = router;
