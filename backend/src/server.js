import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import superAdminRoutes from './modules/superAdmin/superAdmin.routes.js';
// import superAdminRoutes from './modules/superAdmin/superAdminRoutes.js';
import authRoutes from './modules/auth/auth.routes.js';
import colors from 'colors';
import cors from 'cors';
import  errorHandler  from "./errors/errorHandler.js";

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
const port = process.env.PORT || 5001;
// const port = 5001;
// Routes

app.use('/auth', authRoutes);
app.use('/super-admin', superAdminRoutes);
// app.use('/subcity-admin', subcityAdminRoutes);

//error handling middleware
app.use(errorHandler);

let server = null;
server = app.listen(port, () => {
  console.log(colors.green(`Server is running on port ${port}`));
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
