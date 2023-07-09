const express = require('express');
const router = express.Router();
const File = require('../Models/Files');
const User = require('../Models/User');
const authMiddleware = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');
const multer = require('multer');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'recievedFiles/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  
  });
  const upload = multer({ storage });

router.post('/share', upload.single('file'), authMiddleware, async (req, res) => {
    const { email, fileName, senderEmail } = req.body;
    const sharedFileName =   '-' + fileName;
  
    const sharedFilePath = path.join(__dirname, '../uploads/', sharedFileName);
    const filePath = `C:/Users/hario/OneDrive/Desktop/pdfmanager2/backend/uploads/${fileName}`
    console.log("hy",sharedFilePath);
    console.log("body",req.body);
    try {
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
        return res.status(400).json({ error: 'Desired email not found' });
      }
  
      let existingFile = await File.findOne({ email });
  
      if (existingFile) {
        existingFile.Recievedfiles.push({ senderEmail: senderEmail, files: sharedFileName });
      } else {
        existingFile = new File({
          email,
          Recievedfiles: [{ senderEmail: senderEmail, files: sharedFileName }],
        });
      }
  
      await existingFile.save();
  
      // Move the uploaded file to the uploads folder
      fs.copyFileSync(filePath, sharedFilePath);
  
      res.json({ message: 'File shared successfully' });
    } catch (error) {
      console.error('Error sharing file:', error);
      res.status(500).json({ error: 'An error occurred while sharing the file' });
    }
  });

  module.exports = router;