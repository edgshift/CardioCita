const express = require('express')
const { login, profile } = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/login', login)
router.get('/profile', protect, profile)

module.exports = router
