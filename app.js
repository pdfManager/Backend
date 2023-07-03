const express = require('express');
const mongoose = require('mongoose');
// const signupRouter = require('./Routes/signup');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(cors());
// const mongoURI = 'mongodb+srv://hariompatel127:patel786@cluster0.j6ptkee.mongodb.net/'; // Replace with your MongoDB connection string
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGO_URL, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  app.get('/', (req, res) => {
    res.send('hello world')
  })
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
app.use('/', require('./Routes/signup'));
app.use('/', require('./Routes/login'));
app.use('/', require('./Routes/upload'));
app.use('/', require('./Routes/getFiles'));
// app.use('/', require('./Routes/deleteFile'));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
