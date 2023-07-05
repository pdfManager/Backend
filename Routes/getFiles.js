const express = require('express');
const router = express.Router();
const File = require('../Models/Files');
const User = require('../Models/User');
const authMiddleware = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

router.get('/getFiles', authMiddleware , async (req, res) => {
 
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
  const filePath = path.join(__dirname, '../uploads/', fileName); // Adjust the path as per your server setup
  res.sendFile(filePath);
});

router.delete('/deleteFile/:fileName', authMiddleware, async (req, res) => {
  const fileName = req.params.fileName;
  const userId = req.user;

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

    if (index === -1) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Remove the file from the array
    existingFile.file.splice(index, 1);

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
    // console.log("fileId" , fileId);
    // Store the fileId, fileName, and userId in your database or any persistent storage
    existingFile.shareableLinks.push({ id: fileId, fileName });
   
    await existingFile.save();

    // Generate the shareable link with the fileId
    const shareableLink = `http://localhost:5000/viewFile/${fileId}`;
    // console.log("Link" , shareableLink);
    res.json({  shareableLink  });
  
  } catch (error) {
    console.error('Error generating shareable link:', error);
    res.status(500).json({ error: 'An error occurred while generating the shareable link' });
  }
});


router.post('/share', authMiddleware, async (req, res) => {
const { email, fileName, senderEmail } = req.body;
  // console.log("Hello", email, fileName, senderEmail);

  try {
    const existingUser = await User.findOne({ email });
  //  console.log("Exisying user", existingUser);

    if (!existingUser) {
      return res.status(400).json({ error: 'Desired email not found' });
    }

    let existingFile = await File.findOne({ email });
    // console.log("Exisying filr", existingFile);
    if (existingFile) {
      existingFile.Recievedfiles.push({ senderEmail: senderEmail, files:fileName });
    } 
    else {
      existingFile = new File({
        email,
        Recievedfiles: [{ senderEmail: senderEmail, files:fileName  }],
      });
    }
    await existingFile.save();

    res.json({ message: 'File shared successfully' });
  } catch (error) {
    console.error('Error sharing file:', error);
    res.status(500).json({ error: 'An error occurred while sharing the file' });
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