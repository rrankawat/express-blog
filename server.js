const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const path = require('path');

// Load env vars & db
dotenv.config({ path: './config/config.env' });
const connectDB = require('./config/db');

// Connect to db
connectDB();

// Route files
const posts = require('./routes/posts');
const comments = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());

// File upload
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.get('/', (req, res) => {
  res.send('Welcome to blog api');
});

app.use('/api/v1/posts', posts);
app.use('/api/v1/comments', comments);

app.listen(
  PORT
  // console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close server & exit process
  server.close(() => process.exit(1));
});
