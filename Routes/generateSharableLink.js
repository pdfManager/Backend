const express = require('express');
const router = express.Router();
const File = require('../Models/Files');
const User = require('../Models/User');
const authMiddleware = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


router.post('/generateShareLink', authMiddleware, async (req, res) => {
    const fileName = req.body.fileName;
    const userId = req.user;
    //  console.log("FileName" , fileName);
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const { email } = user;
      const existingFile = await File.findOne({ email });
  
      if (!existingFile || !existingFile.file.includes(fileName)) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Generate a unique identifier or token for the file (you can use a library like uuid)
      const fileId = uuidv4();
      // Store the fileId, fileName, and userId in your database or any persistent storage
      existingFile.shareableLinks.push({ id: fileId, fileName });
     
      await existingFile.save();
  
      // Generate the shareable link with the fileId
      const shareableLink = `http://localhost:5000/api/viewFile/${fileId}`;
      // console.log("Link" , shareableLink);
      res.json({  shareableLink  });
    
    } catch (error) {
      console.error('Error generating shareable link:', error);
      res.status(500).json({ error: 'An error occurred while generating the shareable link' });
    }
  });
  
  
  
  
  router.get('/viewFile/:fileId', async (req, res) => {
    const fileId = req.params.fileId;
  
    try {
      const file = await File.findOne({ 'shareableLinks.id': fileId }).exec();
  
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      const fileName = file.shareableLinks.find(link => link.id === fileId)?.fileName;
  
      if (!fileName) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      const filePath = path.join(__dirname, '../uploads/', fileName);
      res.sendFile(filePath);
    } catch (error) {
      console.error('Error finding file:', error);
      res.status(500).json({ error: 'An error occurred while finding the file' });
    }
  
  });
  
  module.exports = router;  