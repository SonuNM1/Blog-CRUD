const express = require('express')
const router = express.Router()

const {createBlog, getAllBlogs, getBlogById } = require('../controllers/blog.controller')
const upload = require('../middleware/upload')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/create', authMiddleware ,upload.single('image'), createBlog)

router.get('/blogs', getAllBlogs)
router.get('/blogs/:id', getBlogById);

module.exports = router 