const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
  deleteUser: (id) =>{
    User.deleteOne({_id:id}, (err)=>{
      console.log(err);
    });
    console.log("item deleted")
  }
};
