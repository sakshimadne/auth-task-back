const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  const { name, dob, email, password } = req.body

  // Check if email already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ msg: 'User with this email already exists.' })
  }

  const newUser = new User({
    name,
    dob,
    email,
    password,
  })

  const savedUser = await newUser.save()

  // Create and assign a token
  const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET)

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res
      .status(400)
      .json({ msg: 'No account with this email has been registered.' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid credentials.' })
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

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

module.exports = router
