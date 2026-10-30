process.env.JWT_SECRET = 'test-secret'
process.env.JWT_EXPIRES_IN = '1h'

const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')

const app = require('../src/server')
const User = require('../src/models/userModel')

let mongo
let token
let patientId

const validPatient = {
    nombres: 'Ana María',
    apellidos: 'Pérez Gómez',
    edad: 45,
    cedula: '12345678901',
    fechaNacimiento: '1980-05-12',
    sexo: 'Femenino',
    tipoEnfermedad: 'Hipertension arterial'
}

before(async () => {
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
    await User.create({ usuario: 'doctor', password: 'secreto123' })
})

after(async () => {
    await mongoose.disconnect()
    await mongo.stop()
})

test('H1: rejects invalid credentials', async () => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({ usuario: 'doctor', password: 'wrong' })

    assert.equal(response.status, 401)
    assert.equal(response.body.mensaje, 'Usuario o contraseña incorrectos')
})

test('H1: logs in with valid credentials and returns a token', async () => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({ usuario: 'DOCTOR', password: 'secreto123' })

    assert.equal(response.status, 200)
    assert.ok(response.body.token)

    token = response.body.token
})

test('H1: blocks patient routes without a token', async () => {
    const response = await request(app).get('/api/patients')

    assert.equal(response.status, 401)
})

test('HU1: rejects a negative age', async () => {
    const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...validPatient, edad: -5 })

    assert.equal(response.status, 400)
    assert.ok(response.body.errores.includes('La edad debe ser un número entero no negativo'))
})

test('HU1: rejects a decimal age', async () => {
    const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...validPatient, edad: 45.5 })

    assert.equal(response.status, 400)
})

test('HU1: requires first name, last name and age', async () => {
    const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({})

    assert.equal(response.status, 400)
    assert.equal(response.body.errores.length, 6)
})

test('HU1: creates a valid patient', async () => {
    const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(validPatient)

    assert.equal(response.status, 201)
    assert.equal(response.body.mensaje, 'Paciente registrado correctamente')
    assert.equal(response.body.paciente.nombres, 'Ana María')

    patientId = response.body.paciente._id
})

test('HU1: does not allow two patients with the same national id', async () => {
    const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(validPatient)

    assert.equal(response.status, 409)
})

test('HU4: lists the registered patients', async () => {
    const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 200)
    assert.equal(response.body.length, 1)
    assert.equal(response.body[0].nombres, 'Ana María')
})

test('HU2: updates the patient data', async () => {
    const response = await request(app)
        .put(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ edad: 46, tipoEnfermedad: 'Arritmia cardiaca' })

    assert.equal(response.status, 200)
    assert.equal(response.body.paciente.edad, 46)
    assert.equal(response.body.paciente.tipoEnfermedad, 'Arritmia cardiaca')
    assert.equal(response.body.paciente.nombres, 'Ana María')
})

test('HU2: does not save invalid data on update', async () => {
    const response = await request(app)
        .put(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ edad: -1 })

    assert.equal(response.status, 400)
})

test('HU3: deletes the patient record', async () => {
    const response = await request(app)
        .delete(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 200)
})

test('HU3: returns 404 when the patient no longer exists', async () => {
    const response = await request(app)
        .delete(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 404)
})
