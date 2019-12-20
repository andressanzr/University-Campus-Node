const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserModel = require("./User");

const subjectSchema = new Schema(
  {
    nombre: { type: String, required: true },
    infoInstalar: { type: String, required: true },
    enlaces: Array,
    profResponsables: [{ type: Schema.Types.ObjectId, ref: "User" }],
    alumnos: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { collection: "subjects", versionKey: false }
);

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
      console.log(res);
    });
  },
  findSubjects: async () => {
    var subj = await Subject.find();
    console.log(subj);
  },
  findSubjectsPopulateUsers: async () => {
    var subjectList = await Subject.find().populate({
      path: "alumnos profResponsables"
    });
    return subjectList;
  },
  findSubjectById: async id => {
    return await Subject.findById(id);
  },
  findSubjectByIdPopulateUsers: async id => {
    return await Subject.findById(id).populate({
      path: "alumnos profResponsables"
    });
  },
  updateTeachersStudentsById: async (id, listTeachers, listStudents) => {
    await Subject.findByIdAndUpdate(
      id,
      { profResponsables: listTeachers, alumnos: listStudents },
      (err, res) => {
        console.log("error " + err);
        console.log("result " + res);
      }
    );
  },
  deleteSubjectById: async id => {
    console.log(id);
    await Subject.findByIdAndDelete(id, (err, res) => {
      console.log("error " + err);
      console.log("result " + res);
    });
  }
};
