import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Middleware Imports
import { errorHandler } from './middleware/errorMiddleware.js';
import ApiError from './utils/ApiError.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Secure headers
app.use(helmet({
  contentSecurityPolicy: false // Allows self-contained visualization wrappers if integrated
}));

// CORS setup
app.use(cors({
  origin: true, // Allow all origins for hackathon simplicity or configure specifically
  credentials: true
}));

// Request logger
app.use(morgan('dev'));

// Payload parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Base health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TravelMind AI Agent Backend'
  });
});

// Mounted Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/chat', chatRoutes);

// Catch-all route handler for undefined resources
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this server`));
});

// Centralized error handler
app.use(errorHandler);

export default app;