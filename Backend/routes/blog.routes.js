const express = require('express')
const router = express.Router()

const {
    createBlog, 
    getAllBlogs, 
    getBlogById, 
    updateBlog,
    deleteBlog
} = require('../controllers/blog.controller')
const upload = require('../middleware/upload')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/create', authMiddleware ,upload.single('image'), createBlog)

router.get('/blogs', getAllBlogs)
router.get('/blogs/:id', getBlogById);

router.put('/blogs/:id', authMiddleware, upload.single('image'), updateBlog)

router.delete('/:id', authMiddleware, deleteBlog)

module.exports = router 