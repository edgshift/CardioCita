const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    nombre:{
        type:String, 
        require:true
    },
    apellido:{
        type:String,
        require:true
    },
    edad:{
        type:Number,
        require:true
    },
    cedula:{
        type:String,
        require:true,
    }
}, 
{
    timestamps: true
})

const paciente = Mongoose.Model(
    'Paciente', patientSchema
)

module.exports = paciente