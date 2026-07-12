// ============================================
// index.ts — Main Server File (Solo Version)
// ============================================
// This is the entry point for the Express server.
// It sets up middleware and mounts route handlers.

import "dotenv/config";
import express from "express";
import cors from 'cors';
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// Import route handlers
import gamesRouter from './routes/games.js';

// ============================================
// EXPRESS APP SETUP
// ============================================
const app = express();
const PORT = 3000;

// ============================================
// DATABASE SETUP (Prisma 7)
// ============================================
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
// ============================================
// ROUTES
// ============================================
// Mount the game routes at the /api prefix.
app.use('/api', gamesRouter);

// ============================================
// ROOT & HEALTH ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({ message: 'Celebrity Name Chain API is running' });
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ============================================
// EXPORTS
// ============================================
// Export prisma so other files can use the same database client instance.
export { prisma };