import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  try {
    return new PrismaClient();
  } catch (e) {
    console.error("[prisma] Failed to create PrismaClient:", e);
    return null as unknown as PrismaClient;
  }
}

export const prisma = (globalForPrisma.prisma ?? createPrismaClient()) as PrismaClient | null;

if (process.env.NODE_ENV !== "production" && prisma) globalForPrisma.prisma = prisma as PrismaClient;

export const isDatabaseConfigured = !!process.env.POSTGRES_PRISMA_URL || !!process.env.DATABASE_URL || !!process.env.POSTGRES_URL;
