import { PrismaClient } from '@prisma/client';

// Create a single Prisma instance to be used across the app
// Note: In Prisma 7+, datasourceUrl is configured in prisma.config.ts, not in constructor
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
