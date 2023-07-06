// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();
// const port = process.env.PORT || 5000;
// const path = require('path');
// require('dotenv').config();



// // CORS configuration
// // app.use(cors());

// // CORS options
// // const corsOptions = {
// //   origin: '*',
// //   methods: 'GET, POST, OPTIONS',
// //   allowedHeaders: 'origin ,Origin, Content-Type, authorization , Authorization',
// // };
// const corsOptions = {
//   origin: ['https://main--glistening-frangollo-6a2746.netlify.app' ],
//   methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'authorization','origin','Origin']
// }

// // Enable CORS for all routes
// app.use(cors(corsOptions));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // MongoDB connection
// const MONGO_URL = 'mongodb+srv://hariompatel127:patel786@cluster0.j6ptkee.mongodb.net/';
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// mongoose.connect(MONGO_URL, options)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });

// // Routes
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// app.use('/api', require('./Routes/signup'));
// app.use('/api', require('./Routes/login'));
// app.use('/api', require('./Routes/upload'));
// app.use('/api', require('./Routes/getFiles'));

// // Serve static files
// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
// app.use(cors());
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// MongoDB connection
const MONGO_URL = 'mongodb+srv://hariompatel127:patel786@cluster0.j6ptkee.mongodb.net/';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGO_URL, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api', require('./Routes/signup'));
app.use('/api', require('./Routes/login'));
app.use('/api', require('./Routes/upload'));
app.use('/api', require('./Routes/getFiles'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
