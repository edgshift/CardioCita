require('dotenv').config({ quiet: true })

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const patientRoutes = require('./routes/patientRoutes')
const { notFound, errorHandler } = require('./middlewares/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API CardioCita funcionando',
        rutas: {
            login: 'POST /api/auth/login',
            perfil: 'GET /api/auth/profile',
            pacientes: 'GET|POST /api/patients',
            paciente: 'GET|PUT|DELETE /api/patients/:id'
        }
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

async function start() {
    if (!process.env.JWT_SECRET) {
        throw new Error('Falta la variable JWT_SECRET en el archivo .env')
    }

    await connectDB()

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`)
    })
}

if (require.main === module) {
    start().catch((error) => {
        console.error('No se pudo iniciar el servidor:', error.message)
        process.exit(1)
    })
}

module.exports = app
