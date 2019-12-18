const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Cryptr = require("cryptr");
const cryptr = new Cryptr("t45AS45asf");

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
  findUsers: async () => {
    return await User.find();
  },
  loginUser: async (email, pass) => {
    var findedUser;
    await User.findOne({ email: email }, (err, user) => {
      findedUser = user;
    });
    if(findedUser!=null){
      var passDecrypted = cryptr.decrypt(findedUser.pass);
    }
    if(pass === passDecrypted){
      return findedUser;
    }else{
      return null;
    }
    
  },
  deleteUser: id => {
    User.deleteOne({ _id: id }, err => {
      console.log(err);
    });
    console.log("item deleted");
  }
};
