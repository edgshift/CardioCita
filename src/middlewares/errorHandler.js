const notFound = (req, res) => {
    res.status(404).json({
        mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    })
}

const errorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            mensaje: 'Los datos enviados no son válidos',
            errores: Object.values(err.errors).map((error) => error.message)
        })
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            mensaje: `El identificador "${err.value}" no es válido`
        })
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0]

        return res.status(409).json({
            mensaje: field === 'cedula'
                ? 'Ya existe un paciente registrado con esa cédula'
                : `Ya existe un registro con ese ${field}`
        })
    }

    if (err.status && err.status < 500) {
        return res.status(err.status).json({ mensaje: err.message })
    }

    console.error(err)

    return res.status(500).json({
        mensaje: 'Error interno del servidor'
    })
}

module.exports = { notFound, errorHandler }
