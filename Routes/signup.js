const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../Models/User');

router.post('api/signup', [
  // Validate name (minimum length: 5 characters)
  body('name').trim().isLength({ min: 5 }).withMessage('Name must be at least 5 characters long'),

  // Validate email
  body('email').trim().isEmail().withMessage('Invalid email'),

  // Validate password (minimum length: 5 characters)
  body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], async (req, res) => {
  const { name, email, password } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating user' });
  }
});

module.exports = router;
