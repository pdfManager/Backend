const express = require('express');
const router = express.Router();
const File = require('../Models/Files');
const User = require('../Models/User');
const authMiddleware = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');




router.delete('/deleteFile/:fileName', authMiddleware, async (req, res) => {
    const fileName = req.params.fileName;
    const userId = req.user;
    recievedFileName = fileName;
  
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const { email } = user;
      const existingFile = await File.findOne({ email });
  
      if (!existingFile) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Find the index of the file in the array
      const index = existingFile.file.indexOf(fileName);
  
      const recievedFileIndex = existingFile.Recievedfiles.findIndex(
        (existingFile) => existingFile.files === recievedFileName
      );
  console.log("index",recievedFileIndex , index);
  
      if (index === -1 && recievedFileIndex === -1) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Remove the file from the array
      if(index != -1){
        existingFile.file.splice(index, 1);
      }
      else{
        existingFile.Recievedfiles.splice(recievedFileIndex, 1);
      }
      // Save the updated user document
      await existingFile.save();
  
      // Delete the file from the uploads directory
      const filePath = path.join(__dirname, '../uploads/', fileName);
      fs.unlinkSync(filePath);
  
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'An error occurred while deleting the file' });
    }
  });

  module.exports = router;