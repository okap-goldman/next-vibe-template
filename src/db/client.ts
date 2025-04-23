import { PrismaClient } from '@prisma/client';

console.error('DATABASE_URL:', process.env['DATABASE_URL']);
export const db = new PrismaClient();
