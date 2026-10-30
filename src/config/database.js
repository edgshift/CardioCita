const path = require('path')
const mongoose = require('mongoose')

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env'),
    quiet: true
})

async function connectDB() {
    const uri = process.env.MONGO_URI

    if (!uri) {
        throw new Error('Falta la variable MONGO_URI en el archivo .env')
    }

    await mongoose.connect(uri)
    console.log(`MongoDB conectado (base de datos: ${mongoose.connection.name})`)
}

module.exports = connectDB
