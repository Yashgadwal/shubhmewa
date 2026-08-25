import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const isDatabaseConfigured = !!(
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL
);

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * Checks if the server environment has database credentials configured.
 */
export function isDbActive(): boolean {
  return isDatabaseConfigured;
}
