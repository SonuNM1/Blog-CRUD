const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const {signUp, loginUser} = require('../controllers/auth.controller')

router.post('/signup', upload.single('profileImage'), signUp)
router.post('/login', loginUser)

module.exports = router ; 