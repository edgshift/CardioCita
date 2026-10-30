require('dotenv').config({ quiet: true })

const mongoose = require('mongoose')
const connectDB = require('../config/database')
const User = require('../models/userModel')

const username = process.env.DOCTOR_USER || 'doctor'
const password = process.env.DOCTOR_PASSWORD || 'CardioCita123'

async function main() {
    await connectDB()

    const existingUser = await User.findOne({ usuario: username.toLowerCase() })

    if (existingUser) {
        console.log(`El usuario "${username}" ya existe, no se creó de nuevo`)
        return
    }

    await User.create({ usuario: username, password })
    console.log(`Usuario "${username}" creado correctamente`)
}

main()
    .catch((error) => {
        console.error('No se pudo crear el usuario:', error.message)
        process.exitCode = 1
    })
    .finally(() => mongoose.disconnect())
