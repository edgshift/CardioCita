const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    nombres:{
        type:String, 
        required:true,
    },
    apellidos:{
        type:String,
        required:true
    },
    edad:{
        type:Number,
        required:true
    },
    cedula:{
        type:String,
        trim:true,
        required:[true, "Insertar cedula sin espacio."],
        match: [/^\d{11}$/, "La cédula debe contener 11 dígitos sin espacios"]
    },
    sexo:{
        type:String, 
        required:true,
        enum:["Femenino", "Masculino"]
    },
    tipoEnfermedad: {
    type: String,
    required: true,
    enum: [
        "Hipertension arterial",
        "Enfermedad arterial coronaria",
        "Infarto agudo de miocardio",
        "Insuficiencia cardiaca",
        "Arritmia cardiaca",
        "Fibrilacion auricular",
        "Enfermedad cerebrovascular (ACV)",
        "Enfermedad valvular cardiaca",
        "Enfermedad arterial periferica",
        "Miocardiopatia"
    ]
    }
}, 
{
    timestamps: true
})

const paciente = Mongoose.Model(
    'Paciente', patientSchema
)

module.exports = paciente