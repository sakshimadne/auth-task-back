// Importing required modules
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Defining the User schema for the MongoDB database
// This defines the structure of the User data that will be saved in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String, // name will be a string
    required: true, // name is required
  },
  dob: {
    type: Date, // date of birth will be a Date object
    required: true, // date of birth is required
  },
  email: {
    type: String, // email will be a string
    required: true, // email is required
    unique: true, // email must be unique (not shared by any other user)
  },
  password: {
    type: String, // password will be a string
    required: true, // password is required
  },
})

// Before saving the user data to the database, this function will run
userSchema.pre('save', async function (next) {
  // If the password was changed
  if (this.isModified('password')) {
    // Hash the password using bcrypt
    // This ensures the password is not saved in plaintext in the database
    this.password = await bcrypt.hash(this.password, 10)
  }
  // Continue to the next middleware or save function
  next()
})

// Define the User model using the User schema
const User = mongoose.model('User', userSchema)

// Export the User model so it can be used in other parts of the application
module.exports = User
