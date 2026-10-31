
const express = require('express')
const { protect } = require('../middlewares/authMiddleware')

const {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    cancelAppointment
} = require('../controllers/appointmentController')

const router = express.Router()

// Todas las rutas requieren autenticación
router.use(protect)

router.route('/')
    .get(getAppointments)
    .post(createAppointment)

router.route('/:id')
    .get(getAppointmentById)
    .put(updateAppointment)
    .delete(cancelAppointment)

module.exports = router
