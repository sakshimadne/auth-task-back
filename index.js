// Import and configure dotenv to handle environment variables
require('dotenv').config()

// Import required modules
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// Import user router
const userRouter = require('./routes/userRouter')

// Create an Express application
const app = express()

// Connect to MongoDB using the connection string in environment variables
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Use new URL parser to avoid deprecation warnings
    useUnifiedTopology: true, // Use new server discovery and monitoring engine to avoid deprecation warnings
  })
  .then(() => {
    // If connection is successful, log it to the console
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    // If there's an error during connection, log it to the console
    console.error('Failed to connect to MongoDB', err)
  })

// Enable all CORS requests
app.use(cors())

// Parse incoming requests with JSON payloads
app.use(express.json())

// Use the user router for requests to /api/users
app.use('/api/users', userRouter)

// Start the server on the port specified in environment variables
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
