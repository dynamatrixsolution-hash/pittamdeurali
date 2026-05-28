import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all client connections in development
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure public/uploads exists to serve images locally
const localUploadsDir = path.resolve('public/uploads');
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

// Expose local upload folder publicly
app.use('/uploads', express.static(localUploadsDir));

// Register API Routes
app.use('/api', apiRoutes);

// Simple diagnostic route
app.get('/', (req, res) => {
  res.json({ message: 'Sanctum Retreat Pokhara CMS API is running.' });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
