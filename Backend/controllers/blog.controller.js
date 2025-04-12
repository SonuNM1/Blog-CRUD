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

module.exports = { createBlog, getAllBlogs, getBlogById }