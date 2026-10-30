const jwt = require('jsonwebtoken')

function protect(req, res, next) {
    const header = req.headers.authorization || ''

    if (!header.startsWith('Bearer ')) {
        return res.status(401).json({
            mensaje: 'No autorizado: debes iniciar sesión'
        })
    }

    const token = header.slice(7).trim()

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        return res.status(401).json({
            mensaje: 'No autorizado: la sesión expiró o el token no es válido'
        })
    }
}

module.exports = { protect }
