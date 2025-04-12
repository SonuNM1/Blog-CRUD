const express = require('express')
const router = express.Router()

const {createBlog} = require('../controllers/blog.controller')
const upload = require('../middleware/upload')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/create', authMiddleware ,upload.single('image'), createBlog)

module.exports = router 