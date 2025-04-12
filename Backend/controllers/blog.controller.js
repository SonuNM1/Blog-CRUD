const Blog = require('../models/blog.model')
const path = require('path')
const fs = require('fs')

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

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'name');
        res.status(200).json({ blogs });
    } catch (error) {
        console.error("Fetch blogs error:", error);
        res.status(500).json({
            message: 'Server Error', 
            error: true , 
            success: false 
        });
    }
};

const getBlogById = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id); 
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.json({ blog });
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ message: 'Server Error', error });
    }
};

const updateBlog = async (req, res) => {
    try{
        const blogId = req.params.id ; 
        const {title, description} = req.body ; 
        const image = req.file ; 

        const blog = await Blog.findById(blogId)

        if(!blog){
            return res.status(404).json({
                message: 'Blog not found'
            })
        }

        // deleting the old image, if the new one has been uploaded

        if(image){
            const oldImagePath = path.join(__dirname, '..', 'uploads', blog.image)

            if(fs.existsSync(oldImagePath)){
                fs.unlinkSync(oldImagePath)
            }
            blog.image = image.filename ; 
        }

        // updating the title and description of blog 

        blog.title = title ; 
        blog.description = description 

        await blog.save() 
        
        console.log('Received PUT request to update blog');

        console.log('Params ID:', req.params.id);
        console.log('Body:', req.body);
        console.log('File:', req.file);


        res.status(200).json({
            message: 'Blog updated successfully', 
            blog
        })

        navigate('/')
    }catch(error){
        console.log('Error in updating the blog: ', error) ; 

        res.status(500).json({
            message: 'Internal Server Error', 
            error: true , 
            success: false 
        })
    }
}

const deleteBlog = async (req, res) => {
    try{
        const blogId = req.params.id ; 
        const blog = await Blog.findById(blogId)

        if(!blog){
            return res.status(404).json({
                message: 'Blog not found'
            })
        }

        // deleting the image from the folder as well 

        const imagePath = path.join(__dirname, '..', 'uploads', blog.image)

        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath) ; 
        }

        await Blog.findByIdAndDelete(blogId)

        res.status(200).json({
            message: 'Blog deleted successfully', 
            success: true , 
            error: false 
        })

    }catch(error){
        console.log('Error deleting the blog', error)

        res.status(500).json({
            message: 'Internal Server Error', 
            success: false
        })
    }
}

module.exports = {
    createBlog, 
    getAllBlogs, 
    getBlogById, 
    updateBlog,
    deleteBlog
}