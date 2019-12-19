const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  nombre: String,
  infoInstalar: String,
  enlaces: Array,
  profResponsables: [{ type: Schema.Types.ObjectId, ref: "User" }],
  alumnos: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { collection: "subjects", versionKey: false });

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = {
  createSubject: (nombre, infoInstalar, enlaces, profResponsables, alumnos) => {
    var subjectCreate = new Subject({
      nombre: nombre,
      infoInstalar: infoInstalar,
      enlaces: enlaces,
      profResponsables: profResponsables,
      alumnos: alumnos
    });

    subjectCreate.save((err, res) => {
      err ? console.log(err) : "";
      console.log("res" + res)
    });
  }
}