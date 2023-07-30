// Import required modules
const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Route for user registration
router.post('/register', async (req, res) => {
  // Destructure user input from request body
  const { name, dob, email, password } = req.body

  // Check if a user with the same email already exists in the database
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    // If the user exists, send an error response
    return res.status(400).json({ msg: 'User with this email already exists.' })
  }

  // Create a new user instance with the input data
  const newUser = new User({
    name,
    dob,
    email,
    password,
  })

  // Save the new user to the database
  const savedUser = await newUser.save()

  // Create and sign a new JSON web token with the user's id
  const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET)

  // Respond with the token and user data
  res.json({
    token,
    user: {
      id: savedUser._id,
      name: savedUser.name,
      dob: savedUser.dob,
      email: savedUser.email,
    },
  })
})

// Route for user login
router.post('/login', async (req, res) => {
  // Destructure user input from request body
  const { email, password } = req.body

  // Find the user in the database by email
  const user = await User.findOne({ email })
  if (!user) {
    // If no user found, send an error response
    return res
      .status(400)
      .json({ msg: 'No account with this email has been registered.' })
  }

  // Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    // If the passwords don't match, send an error response
    return res.status(400).json({ msg: 'Invalid credentials.' })
  }

  // If the passwords match, create and sign a new JSON web token with the user's id
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

  // Respond with the token and user data
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      dob: user.dob,
      email: user.email,
    },
  })
})

// Export the router to be used in other parts of the application
module.exports = router
