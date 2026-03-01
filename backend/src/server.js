import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import authRoutes from './modules/auth/authRoutes.js';
import cors from 'cors';
// Load environment variables from .env
config();

if (process.env.ENABLE_EMAIL_QUEUE === 'true') {
  await import('./queues/emailQueue.js');
}

connectDB();

const app = express();
// Middleware
app.use(cors());
// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const port = process.env.PORT || 5001;
const port = 5001;
app.use('/auth', authRoutes);
let server = null;
server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown helper
const shutdown = async (code = 0) => {
  try {
    await disconnectDB();
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  } finally {
    process.exit(code);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);

  if (server) {
    server.close(() => {
      shutdown(1);
    });
  } else {
    shutdown(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);

  if (server) {
    server.close(() => {
      shutdown(1);
    });
  } else {
    shutdown(1);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');

  if (server) {
    server.close(() => {
      shutdown(0);
    });
  } else {
    shutdown(0);
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  if (server) {
    server.close(() => {
      shutdown(0);
    });
  } else {
    shutdown(0);
  }
});
