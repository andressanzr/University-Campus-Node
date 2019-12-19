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
      result = res.length > 0 ? true : false;
    });
    return result;
  },
  findUsers: async () => {
    return await User.find();
  },
  findUserIdByEmail: async (emailSearch) => {
    var idUserFinded;
    await User.findOne({ email: emailSearch }, (err, res) => {
      if (err) console.log(err);
      idUserFinded = res._id;
    });
    return idUserFinded;
  },
  findUserByEmail: async (emailSearch) => {
    var userFinded;
    await User.findOne({ email: emailSearch }, (err, res) => {
      if (err) console.log(err);
      userFinded = res;
    });
    return userFinded;
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
  deleteUserByEmail: async email => {
    console.log(email)
    await User.deleteOne({ email: email }, err => {
      console.log(err);
    });
    console.log( email+"deleted");
  },
  updateUserById: async (id, userUpdate) => {
    await User.findOneAndUpdate({ _id: id }, userUpdate, (err, res) => {
      err ? console.log(err) : "";
      console.log("result update" + res);
    })
  }
};
