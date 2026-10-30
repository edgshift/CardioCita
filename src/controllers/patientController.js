const { Patient } = require('../models/patientModel')
const { EDITABLE_FIELDS } = require('../middlewares/validatePatient')

function pickFields(body) {
    return Object.fromEntries(
        Object.entries(body).filter(([field]) => EDITABLE_FIELDS.includes(field))
    )
}

async function getPatients(req, res) {
    const patients = await Patient.find().sort({ createdAt: -1 })

    res.status(200).json(patients)
}

async function getPatientById(req, res) {
    const patient = await Patient.findById(req.params.id)

    if (!patient) {
        return res.status(404).json({ mensaje: 'Paciente no encontrado' })
    }

    res.status(200).json(patient)
}

async function createPatient(req, res) {
    const patient = await Patient.create(pickFields(req.body))

    res.status(201).json({
        mensaje: 'Paciente registrado correctamente',
        paciente: patient
    })
}

async function updatePatient(req, res) {
    const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        pickFields(req.body),
        { returnDocument: 'after', runValidators: true }
    )

    if (!patient) {
        return res.status(404).json({ mensaje: 'Paciente no encontrado' })
    }

    res.status(200).json({
        mensaje: 'Paciente actualizado correctamente',
        paciente: patient
    })
}

async function deletePatient(req, res) {
    const patient = await Patient.findByIdAndDelete(req.params.id)

    if (!patient) {
        return res.status(404).json({ mensaje: 'Paciente no encontrado' })
    }

    res.status(200).json({
        mensaje: `El paciente ${patient.nombres} ${patient.apellidos} fue eliminado`
    })
}

module.exports = {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
}
