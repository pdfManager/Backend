const express = require('express');
const router = express.Router();
const File = require('../Models/Files');
const User = require('../Models/User');
const authMiddleware = require('../middleware/authMiddleware');
const path = require('path');

router.get('/getFiles', authMiddleware , async (req, res) => {
  
 console.log("Haan me chalra hu getfiles");
  const userId = req.user;
  const user = await User.findOne({ _id: userId });
  const { email } = user;

  try {
    const files = await File.find({ email });
    const Recievedfiles = await File.find({ email });
    res.json({ files, Recievedfiles });
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'An error occurred while fetching files' });
    }
  });

router.get('/upload/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../uploads/', fileName); // Adjust the path as per your 
  res.sendFile(filePath);
});

module.exports = router;