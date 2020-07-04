const express = require('express');
const dotenv = require('dotenv');

// Route files
const posts = require('./routes/posts');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Mount routes
app.get('/', (req, res) => {
  res.send('Welcome to blog api');
});

app.use('/api/v1/posts', posts);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
