const express = require("express");

const router = express.Router();

const User = require("../model/User");
const Subject = require("../model/Subject");

const csv = require("csv-parser");
const fs = require("fs");
const result = [];

router.post("/users", (req, res) => {
  var fileUsers = req.files.file;

  console.log(fileUsers.mimetype);
  fileUsers.mv(`./files/users/${fileUsers.name}`, err => {
    if (err) return res.status(500).send({ message: err });
    readCsvFile(`./files/users/${fileUsers.name}`, 1);
    return res.redirect("/administrarUsuarios");
  });
});

router.post("/subjects", (req, res) => {
  var fileSubjects = req.files.file;

  fileSubjects.mv(`./files/subjects/${fileSubjects.name}`, err => {
    if (err)
      return res.render("error", {
        errors: err
      });
    readCsvFile(`./files/subjects/${fileSubjects.name}`, 2);
    return res.redirect("/administrarAsignaturas");
  });
});

router.post("/subjectFiles", (req, res) => {
  console.log(req.files);
  var fileSubject = req.files.file;
  // crea directorio si no existe
  if (!fs.existsSync(`./files/subjectFiles/${req.body.idSubject}`)) {
    fs.mkdirSync(`./files/subjectFiles/${req.body.idSubject}`);
  }

  fileSubject.mv(
    `./files/subjectFiles/${req.body.idSubject}/${fileSubject.name}`,
    err => {
      if (err)
        return res.render("error", {
          errors: err
        });

      return res.redirect("/administrarAsignaturasProfesor");
    }
  );
});

router.post("/deleteFile", (req, res) => {
  deleteFile("." + req.body.ruta);
  res.redirect("/administrarAsignaturasProfesor");
});

const readCsvFile = async (fileName, type) => {
  await fs
    .createReadStream(fileName)
    .pipe(csv({ separator: "," }))
    .on("data", data => result.push(data))
    .on("end", () => {
      //deleteFile(fileName);
      console.log(result);
      if (type == 1) {
        result.map(user => {
          User.createUser(
            user.nombre,
            user.apellido,
            user.email,
            user.pass,
            user.rol
          );
        });
      } else if (type == 2) {
        result.map(subject => {
          Subject.createSubject(
            subject.tipoPlanEstudio,
            subject.nombre,
            subject.infoInstalar,
            subject.enlaces,
            null,
            null
          );
        });
      }
    });
  //.on('close', () => deleteFile(fileName))
};

const deleteFile = fileRoute => {
  fs.unlink(fileRoute, err => console.log(err));
};

module.exports = router;
