const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    try{
        const {email, password} = req.body ; 

        const profileImage = req.file ? req.file.filename : null ; 

        if(!email || !password || !profileImage){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email, 
            password: hashedPassword, 
            profileImage
        })

        await newUser.save() ; 

        res.status(201).json({
            message: 'User registered', 
            user: newUser
        })

    }catch(error){
        res.status(500).json({
            message: 'Server error', 
            error: error || error.message 
        })
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body ; 

    try{

        // checking if the user exists 

        const user = await User.findOne({email}) ; 

        if(!user){
            return res.status(404).json({
                message: 'User does not exist'
            })
        }

        // comparing password 

        const isMatch = await bcrypt.compare(password, user.password) ; 

        if(!isMatch){
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        // Generating JWT Token 

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '6h'
        })

        res.status(200).json({
            message: 'Login successful', 
            token, 
            user: {
                id: user._id, 
                email: user.email, 
                profileImage: user.profileImage
            }
        })

    }catch(error){
        console.error(error) ; 
        res.status(500).json({
            message: 'Server error',
            error: true , 
            success: false 
        })
    }
}

module.exports = {
    signUp, 
    loginUser
}