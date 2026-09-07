const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const castingRoutes = require('./routes/casting.routes');
const childRoutes = require('./routes/child.routes');
const applicationRoutes = require('./routes/application.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Spotly Kids API is running smoothly' });
});

app.use('/api/auth', authRoutes);
app.use('/api/casting-calls', castingRoutes);
app.use('/api/children', childRoutes);
app.use('/api/applications', applicationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});
