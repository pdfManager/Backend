
const express = require('express');
const multer = require('multer');
const router = express.Router();
const File = require('../Models/Files');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../Models/User');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }

});

// Multer file upload middleware
const upload = multer({ storage });

// Upload route
// Upload route
router.post('api/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const userId = req.user;
  const user = await User.findOne({ _id: userId });

  // console.log("user:", user);
  // console.log("file:", req.file);

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const { email } = user; // Access the email property of the user
  const { filename } = req.file;

  try {
    let existingFile = await File.findOne({ email });

    if (existingFile) {
      existingFile.file.push(filename);
    } else {
      existingFile = new File({
        email,
        file: [filename],
      });
     
    }

    await existingFile.save();

    // res.json({ message: 'File uploaded successfully' });
    res.json({filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'An error occurred during file upload' });
  }
});


module.exports = router;

