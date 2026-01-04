const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const codeSummaryRoutes = require('./routes/codeSummary');
const githubRoutes = require('./routes/github');

// Load .env file from project root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/code-summary', codeSummaryRoutes);
app.use('/api/github', githubRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskPilot AI Server is running' });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Function to find available port
const findAvailablePort = (port, maxAttempts = 10) => {
  // Ensure port is a number
  const portNum = typeof port === 'string' ? parseInt(port, 10) : port;
  
  return new Promise((resolve, reject) => {
    const server = require('net').createServer();
    server.listen(portNum, () => {
      const foundPort = server.address().port;
      server.close(() => resolve(foundPort));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        if (maxAttempts > 0) {
          // Ensure we're adding numbers, not concatenating strings
          findAvailablePort(Number(portNum) + 1, maxAttempts - 1).then(resolve).catch(reject);
        } else {
          reject(new Error('No available ports found'));
        }
      } else {
        reject(err);
      }
    });
  });
};

// Start server on available port
findAvailablePort(PORT)
  .then((availablePort) => {
    app.listen(availablePort, () => {
      console.log(`🚀 Server is running on port ${availablePort}`);
      if (availablePort !== PORT) {
        console.log(`⚠️  Port ${PORT} was in use, using port ${availablePort} instead`);
      }
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

