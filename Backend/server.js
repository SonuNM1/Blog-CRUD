const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const authRoutes = require('./routes/auth.routes')
const blogRoutes = require('./routes/blog.routes')
require('dotenv').config()
const connectDB = require('./config/database')

const app = express() ; 

connectDB() ; 

// middleware 

app.use(cors())
app.use(express.json())

// static images 

app.use('/uploads', express.static('uploads'))

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes 

app.get('/', (req, res) => {
    res.send('API running ...')
})

app.use('/api/auth', authRoutes)
app.use('/api/blog', blogRoutes)

const PORT = process.env.PORT || 8080 ; 

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
