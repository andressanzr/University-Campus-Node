const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserModel = require("./User");

const sugerenciaSchema = new Schema({
    nombre: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, required: true}
},
  { collection: "suggestions", versionKey: false }
);

const Sugerencia = mongoose.model("suggestions", sugerenciaSchema);

module.exports = {
    createSugerencia : (nombre, text) => {
        var suggestionCreate = new Sugerencia({
            nombre: nombre,
            text: text,
            date: new Date()
        });
        suggestionCreate.save((err, res) => {
            err ? console.log(err) : "";
            console.log("suggestion saved: " + res);
        });
    },
    findSugerencias: async () =>{
        return await Sugerencia.find();
    }
}