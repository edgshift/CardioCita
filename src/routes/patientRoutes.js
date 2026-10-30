const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const {
    validatePatient,
    validatePatientUpdate
} = require('../middlewares/validatePatient')
const {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
} = require('../controllers/patientController')

const router = express.Router()

router.use(protect)

router.route('/')
    .get(getPatients)
    .post(validatePatient, createPatient)

router.route('/:id')
    .get(getPatientById)
    .put(validatePatientUpdate, updatePatient)
    .delete(deletePatient)

module.exports = router
