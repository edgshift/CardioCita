const express = require('express')
const controller = require('../Controllers/pacienteController')
const router = express.Router()

app.get('/:id', controller.getPacienteById)
app.get('/', controller.getPacientes)

app.update('/:id', controller.updatePaciente)
app.delete('/:id', controller.deletePaciente)

app.post('/', controller.postPaciente)

module.exports = router