
const { Appointment } = require('../models/appointmentModel')
const { Patient } = require('../models/patientModel')

// Validar que la fecha sea correcta y no esté en el pasado.
const validateAppointmentDate = (fecha) => {
    const appointmentDate = new Date(fecha)

    if (Number.isNaN(appointmentDate.getTime())) {
        return {
            error: 'La fecha de la cita no es válida.'
        }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (appointmentDate < today) {
        return {
            error: 'No se pueden registrar citas en fechas pasadas.'
        }
    }

    return { appointmentDate }
}

// Comprobar si el horario ya está ocupado.
const checkDuplicateAppointment = async (fecha, hora, excludeId = null) => {
    const start = new Date(fecha)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    const query = {
        fecha: { $gte: start, $lt: end },
        hora,
        estado: { $ne: 'Cancelada' }
    }

    if (excludeId) {
        query._id = { $ne: excludeId }
    }

    return Appointment.findOne(query)
}

// Obtener todas las citas.
const getAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find()
            .populate('paciente', 'nombres apellidos cedula')
            .sort({ fecha: 1, hora: 1 })

        res.json(appointments)
    } catch (error) {
        next(error)
    }
}

// Obtener una cita por ID.
const getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('paciente', 'nombres apellidos cedula')

        if (!appointment) {
            return res.status(404).json({
                mensaje: 'La cita no fue encontrada.'
            })
        }

        res.json(appointment)
    } catch (error) {
        next(error)
    }
}

// Registrar una cita.
const createAppointment = async (req, res, next) => {
    try {
        const { paciente, fecha, hora, motivo } = req.body

        const existingPatient = await Patient.findById(paciente)

        if (!existingPatient) {
            return res.status(404).json({
                mensaje: 'El paciente seleccionado no existe.'
            })
        }

        const dateValidation = validateAppointmentDate(fecha)

        if (dateValidation.error) {
            return res.status(400).json({
                mensaje: dateValidation.error
            })
        }

        const duplicate = await checkDuplicateAppointment(
            dateValidation.appointmentDate,
            hora
        )

        if (duplicate) {
            return res.status(409).json({
                mensaje: 'Ya existe una cita para ese día y horario.'
            })
        }

        const appointment = await Appointment.create({
            paciente,
            fecha: dateValidation.appointmentDate,
            hora,
            motivo
        })

        await appointment.populate('paciente', 'nombres apellidos cedula')

        res.status(201).json({
            mensaje: 'Cita registrada correctamente.',
            cita: appointment
        })
    } catch (error) {
        next(error)
    }
}

// Actualizar una cita.
const updateAppointment = async (req, res, next) => {
    try {
        const { paciente, fecha, hora, motivo, estado } = req.body

        const appointment = await Appointment.findById(req.params.id)

        if (!appointment) {
            return res.status(404).json({
                mensaje: 'La cita no fue encontrada.'
            })
        }

        if (paciente !== undefined) {
            const existingPatient = await Patient.findById(paciente)

            if (!existingPatient) {
                return res.status(404).json({
                    mensaje: 'El paciente seleccionado no existe.'
                })
            }

            appointment.paciente = paciente
        }

        if (fecha !== undefined) {
            const dateValidation = validateAppointmentDate(fecha)

            if (dateValidation.error) {
                return res.status(400).json({
                    mensaje: dateValidation.error
                })
            }

            appointment.fecha = dateValidation.appointmentDate
        }

        if (hora !== undefined) {
            appointment.hora = hora
        }

        if (motivo !== undefined) {
            appointment.motivo = motivo
        }

        if (estado !== undefined) {
            appointment.estado = estado
        }

        // No permitir horarios duplicados.
        if (appointment.estado !== 'Cancelada') {
            const duplicate = await checkDuplicateAppointment(
                appointment.fecha,
                appointment.hora,
                appointment._id
            )

            if (duplicate) {
                return res.status(409).json({
                    mensaje: 'Ya existe una cita para ese día y horario.'
                })
            }
        }

        await appointment.save()
        await appointment.populate('paciente', 'nombres apellidos cedula')

        res.json({
            mensaje: 'Cita actualizada correctamente.',
            cita: appointment
        })
    } catch (error) {
        next(error)
    }
}

// Cancelar una cita.
const cancelAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)

        if (!appointment) {
            return res.status(404).json({
                mensaje: 'La cita no fue encontrada.'
            })
        }

        appointment.estado = 'Cancelada'
        await appointment.save()

        res.json({
            mensaje: 'Cita cancelada correctamente.',
            cita: appointment
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    cancelAppointment
}
