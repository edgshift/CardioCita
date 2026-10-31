
const mongoose = require('mongoose')

const APPOINTMENT_STATUSES = [
    'Pendiente',
    'Confirmada',
    'Completada',
    'Cancelada'
]

const appointmentSchema = new mongoose.Schema(
    {
        paciente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Paciente',
            required: [true, 'Debe seleccionar un paciente']
        },
        fecha: {
            type: Date,
            required: [true, 'La fecha de la cita es obligatoria']
        },
        hora: {
            type: String,
            required: [true, 'La hora de la cita es obligatoria'],
            match: [
                /^([01]\d|2[0-3]):[0-5]\d$/,
                'La hora debe tener el formato HH:mm'
            ]
        },
        motivo: {
            type: String,
            required: [true, 'El motivo de la consulta es obligatorio'],
            trim: true,
            maxlength: [300, 'El motivo no puede superar los 300 caracteres']
        },
        estado: {
            type: String,
            enum: {
                values: APPOINTMENT_STATUSES,
                message: 'El estado de la cita no es válido'
            },
            default: 'Pendiente'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

appointmentSchema.index({ fecha: 1, hora: 1 })
appointmentSchema.index({ paciente: 1 })

const Appointment = mongoose.model('Cita', appointmentSchema)

module.exports = { Appointment, APPOINTMENT_STATUSES }
