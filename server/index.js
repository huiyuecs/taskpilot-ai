const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const codeSummaryRoutes = require('./routes/codeSummary');
const githubRoutes = require('./routes/github');

// Load .env file from project root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5001;

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

// Root path handler
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve the React app
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // In development, show API info
    res.json({
      message: 'TaskPilot AI API Server',
      status: 'running',
      environment: process.env.NODE_ENV || 'development',
      frontend: 'Please access the frontend at http://localhost:3000',
      api: {
        health: '/api/health',
        codeSummary: '/api/code-summary',
        github: '/api/github',
        models: '/api/code-summary/models'
      }
    });
  }
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

