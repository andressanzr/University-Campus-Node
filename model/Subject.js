const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  _id: Schema.Types.ObjectId,
  nommbre: String,
  infoInstalar: String,
  profResponsables: [{ type: Schema.Types.ObjectId, ref: "User" }],
  alumnos: [{ type: Schema.Types.ObjectId, ref: "User" }]
});
