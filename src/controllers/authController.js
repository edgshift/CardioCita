const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

async function login(req, res) {
    const { usuario, password } = req.body || {}

    if (!usuario || !password) {
        return res.status(400).json({
            mensaje: 'Usuario y contraseña son obligatorios'
        })
    }

    const user = await User.findOne({
        usuario: String(usuario).trim().toLowerCase()
    }).select('+password')

    if (!user) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' })
    }

    const passwordMatches = await user.comparePassword(String(password))

    if (!passwordMatches) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' })
    }

    const token = jwt.sign(
        { id: user._id, usuario: user.usuario },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    )

    res.status(200).json({
        mensaje: 'Sesión iniciada correctamente',
        token,
        usuario: {
            id: user._id,
            usuario: user.usuario
        }
    })
}

async function profile(req, res) {
    res.status(200).json({ usuario: req.user })
}

module.exports = { login, profile }
