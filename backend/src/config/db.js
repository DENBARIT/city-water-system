import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

  export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(colors.cyan.bold('✔ Database connected successfully'));
  } catch (error) {
    console.error(colors.red.bold('✖ Database connection failed'));
    console.error(error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log(colors.yellow('Database disconnected'));
  } catch (error) {
    console.error('Error disconnecting database:', error.message);
  }
};