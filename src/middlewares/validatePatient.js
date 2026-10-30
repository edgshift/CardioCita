const EDITABLE_FIELDS = [
    'nombres',
    'apellidos',
    'edad',
    'cedula',
    'fechaNacimiento',
    'sexo',
    'tipoEnfermedad'
]

const REQUIRED_FIELDS = [
    'nombres',
    'apellidos',
    'edad',
    'cedula',
    'sexo',
    'tipoEnfermedad'
]

function isEmpty(value) {
    return value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
}

function validateAge(age) {
    if (typeof age === 'string' && !/^\d+$/.test(age.trim())) {
        return 'La edad debe ser un número entero no negativo'
    }

    const value = Number(age)

    if (!Number.isInteger(value) || value < 0) {
        return 'La edad debe ser un número entero no negativo'
    }

    if (value > 120) {
        return 'La edad no puede ser mayor a 120 años'
    }

    return null
}

function validateBirthDate(date) {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return 'La fecha de nacimiento no es válida'
    }

    if (parsedDate > new Date()) {
        return 'La fecha de nacimiento no puede ser futura'
    }

    return null
}

function validateBody(body, isCreate) {
    const errors = []

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return ['El cuerpo de la petición debe ser un objeto JSON']
    }

    if (isCreate) {
        for (const field of REQUIRED_FIELDS) {
            if (isEmpty(body[field])) {
                errors.push(`El campo ${field} es obligatorio`)
            }
        }
    } else if (!EDITABLE_FIELDS.some((field) => body[field] !== undefined)) {
        errors.push(`Debes enviar al menos uno de estos campos: ${EDITABLE_FIELDS.join(', ')}`)
    }

    if (body.edad !== undefined && !isEmpty(body.edad)) {
        const ageError = validateAge(body.edad)
        if (ageError) errors.push(ageError)
    }

    if (body.fechaNacimiento !== undefined && !isEmpty(body.fechaNacimiento)) {
        const birthDateError = validateBirthDate(body.fechaNacimiento)
        if (birthDateError) errors.push(birthDateError)
    }

    if (body.nombres !== undefined && typeof body.nombres !== 'string') {
        errors.push('El nombre debe ser texto')
    }

    if (body.apellidos !== undefined && typeof body.apellidos !== 'string') {
        errors.push('El apellido debe ser texto')
    }

    return errors
}

function respondWithErrors(res, errors) {
    return res.status(400).json({
        mensaje: 'Los datos enviados no son válidos',
        errores: errors
    })
}

function validatePatient(req, res, next) {
    const errors = validateBody(req.body, true)

    if (errors.length > 0) {
        return respondWithErrors(res, errors)
    }

    next()
}

function validatePatientUpdate(req, res, next) {
    const errors = validateBody(req.body, false)

    if (errors.length > 0) {
        return respondWithErrors(res, errors)
    }

    next()
}

module.exports = {
    EDITABLE_FIELDS,
    validatePatient,
    validatePatientUpdate
}
