const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel'); // Adjust the path as necessary

const router = express.Router();

// Register Admin
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, adminId } = req.body;

  try {
    // Check if adminId or email already exists
    const existingAdminByEmail = await Admin.findOne({ email });
    const existingAdminById = await Admin.findOne({ adminId });

    // Respond with appropriate error messages
    if (existingAdminByEmail && existingAdminById) {
      return res.status(400).json({ message: 'Email and Admin ID are already registered!' });
    }
    if (existingAdminByEmail) {
      return res.status(400).json({ message: 'Email is already registered!' });
    }
    if (existingAdminById) {
      return res.status(400).json({ message: 'Admin ID is already registered!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      adminId,
    });

    // Save the new admin to the database
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Admin Login
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email!' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id, email: admin.email }, 'your_jwt_secret', {
      expiresIn: '1h', // Token expiration time
    });

    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// Admin Reset 
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if the email and newPassword are provided
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required!' });
    }

    // Validate new password constraints
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character',
      });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin with this email does not exist!' });
    }

    // Hash the new password
    const trimmedPassword = newPassword.trim(); // Trim leading and trailing spaces
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    // Update the admin's password in the database
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: 'Password reset successful!' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


module.exports = router;
