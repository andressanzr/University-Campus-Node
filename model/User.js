const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Cryptr = require("cryptr");
const cryptr = new Cryptr("t45AS45asf");

/* ROLES
  1 - Administrador
  2 - Profesor
  3 - Alumno
*/
const userSchema = Schema(
  {
    nombre: { type: String, required: true },
    apellido: String,
    email: { type: String, required: true },
    pass: { type: String, required: true },
    rol: Number
  },
  { collection: "users", versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  createUser: (nombre, apellido, email, pass, rol) => {
    var userCreate = new User({
      nombre: nombre,
      apellido: apellido,
      email: email,
      pass: pass,
      rol: rol
    });

    userCreate.save();
  },
  checkRepeatedEmail: async emailSearch => {
    var result;
    await User.find({ email: emailSearch }, (err, res) => {
      if (err) console.log(err);
      console.log(res.length > 0);
      result = res.length > 0 ? true : false;
    });
    return result;
  },
  findUsers: async () => {
    return await User.find();
  },
  loginUser: async (email, pass) => {
    var findedUser;
    await User.findOne({ email: email }, (err, user) => {
      findedUser = user;
    });
    if (findedUser != null) {
      var passDecrypted = cryptr.decrypt(findedUser.pass);
    }
    if (pass === passDecrypted) {
      return findedUser;
    } else {
      return null;
    }
  },
  deleteUser: async email => {
    await User.deleteOne({ email: email }, err => {
      console.log("error" + err);
    });
    console.log("item deleted");
  }
};
