const Blog = require('../models/blog.model')

const createBlog = async (req, res) => {
    try{
        const {title, description} = req.body ; 
        const image = req.file ? req.file.filename : null ; 

        if(!title || !description || !image){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const blog = new Blog({
            title, 
            image, 
            description,
            author: req.user.id
        })

        await blog.save()

        res.status(200).json({
            message: 'Blog created successfully', 
            blog
        })

    }catch(error){
        console.log('Create blog error: ', error)

        res.status(500).json({
            message: 'Server Error', 
            error: true , 
            success: false 
        })
    }
}

module.exports = { createBlog }