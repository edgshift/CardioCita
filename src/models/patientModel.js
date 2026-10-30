const mongoose = require('mongoose')

const SEXES = ['Femenino', 'Masculino']

const DISEASE_TYPES = [
    'Hipertension arterial',
    'Enfermedad arterial coronaria',
    'Infarto agudo de miocardio',
    'Insuficiencia cardiaca',
    'Arritmia cardiaca',
    'Fibrilacion auricular',
    'Enfermedad cerebrovascular (ACV)',
    'Enfermedad valvular cardiaca',
    'Enfermedad arterial periferica',
    'Miocardiopatia'
]

const patientSchema = new mongoose.Schema(
    {
        nombres: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },
        apellidos: {
            type: String,
            required: [true, 'El apellido es obligatorio'],
            trim: true
        },
        edad: {
            type: Number,
            required: [true, 'La edad es obligatoria'],
            min: [0, 'La edad no puede ser negativa'],
            max: [120, 'La edad no puede ser mayor a 120 años'],
            validate: {
                validator: Number.isInteger,
                message: 'La edad debe ser un número entero'
            }
        },
        cedula: {
            type: String,
            trim: true,
            required: [true, 'La cédula es obligatoria'],
            match: [/^\d{11}$/, 'La cédula debe contener 11 dígitos sin espacios'],
            unique: true
        },
        fechaNacimiento: {
            type: Date
        },
        sexo: {
            type: String,
            required: [true, 'El sexo es obligatorio'],
            enum: {
                values: SEXES,
                message: `El sexo debe ser uno de: ${SEXES.join(', ')}`
            }
        },
        tipoEnfermedad: {
            type: String,
            required: [true, 'El tipo de enfermedad es obligatorio'],
            enum: {
                values: DISEASE_TYPES,
                message: 'El tipo de enfermedad no está registrado'
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

patientSchema.index({ createdAt: -1 })

const Patient = mongoose.model('Paciente', patientSchema)

module.exports = { Patient, SEXES, DISEASE_TYPES }
