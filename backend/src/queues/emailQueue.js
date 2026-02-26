import Bull from 'bull';
import { sendEmail as sendEmailFn } from '../services/emailService.js';
import prisma from '../config/db.js';

// Create a Bull queue
export const emailQueue = new Bull('email', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times
    backoff: 5000, // Wait 5 seconds between retries
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 200, // Keep last 200 failed jobs
  },
});

// Process jobs
emailQueue.process(async (job) => {
  const { to, subject, text, html, notificationId } = job.data;

  try {
    // Send the email
    const messageId = await sendEmailFn(to, subject, text, html);

    // Update notification record if notificationId is provided
    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          isSent: true,
          providerMessageId: messageId,
        },
      });
    }
  } catch (error) {
    // Update notification as failed
    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          failureReason: error.message,
        },
      });
    }
    throw error; // Let Bull handle retry
  }
});
