import { PrismaClient } from "@prisma/client";

// Vercel Supabase integration sudah inject POSTGRES_PRISMA_URL + POSTGRES_URL_NON_POOLING
// Jika pakai Supabase manual (DATABASE_URL / Supabase dashboard), alias-kan ke var yg Prisma baca
if (!process.env.POSTGRES_PRISMA_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_PRISMA_URL = process.env.DATABASE_URL;
}
if (!process.env.POSTGRES_URL_NON_POOLING && process.env.DIRECT_URL) {
  process.env.POSTGRES_URL_NON_POOLING = process.env.DIRECT_URL;
}
// fallback: POSTGRES_URL (Supabase) -> POSTGRES_PRISMA_URL
if (!process.env.POSTGRES_PRISMA_URL && process.env.POSTGRES_URL) {
  process.env.POSTGRES_PRISMA_URL = process.env.POSTGRES_URL;
}

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

export const isDatabaseConfigured = !!process.env.POSTGRES_PRISMA_URL || !!process.env.POSTGRES_URL_NON_POOLING || !!process.env.DATABASE_URL || !!process.env.POSTGRES_URL || !!process.env.DIRECT_URL;
