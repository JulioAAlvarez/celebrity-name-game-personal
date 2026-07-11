// ============================================
// games.ts — Game Routes (Solo Version)
// ============================================
// This file handles all routes related to game rooms.
// Uses the shared Prisma client from index.ts.

import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// ============================================
// GET /api/test — Simple test route
// ============================================
router.get('/test', (req, res) => {
  res.json({ message: 'Router is working!' });
});

// ============================================
// POST /api/games — Create a new game (host)
// ============================================
// Purpose: Creates a new game room with a unique room code.
// The host is automatically added as the first player.
// Expects: { "roomCode": "TEST01", "username": "host" }
// Returns: The created game object with the host player.
router.post('/games', async (req, res) => {
  const { roomCode, username } = req.body;

  if (!roomCode || !username) {
    return res.status(400).json({ error: 'roomCode and username are required' });
  }

  try {
    // Check if room code already exists
    const existingGame = await prisma.game.findUnique({
      where: { roomCode }
    });

    if (existingGame) {
      return res.status(409).json({ error: 'Room code already in use' });
    }

    // Create the game with the host as the first player
    const game = await prisma.game.create({
      data: {
        roomCode,
        currentName: null, // No initial name — the starter will set it
        players: {
          create: {
            username,
            score: 0,
            isHost: true,
            isReady: false
          }
        }
      },
      include: {
        players: true
      }
    });

    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// ============================================
// POST /api/games/:roomCode/join — Join a game
// ============================================
// Purpose: Adds a player to an existing game.
// Expects: { "username": "sam" } in the request body
// Returns: The updated game object with the new player.
router.post('/games/:roomCode/join', async (req, res) => {
  const { roomCode } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    // Find the game
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if username is already taken in this game
    const existingPlayer = game.players.find(p => p.username === username);
    if (existingPlayer) {
      return res.status(409).json({ error: 'Username already taken in this game' });
    }

    // Check if game has already started
    if (game.hasStarted) {
      return res.status(400).json({ error: 'Game has already started' });
    }

    // Add the player
    const updatedGame = await prisma.game.update({
      where: { roomCode },
      data: {
        players: {
          create: {
            username,
            score: 0,
            isHost: false,
            isReady: false
          }
        }
      },
      include: {
        players: true
      }
    });

    res.status(201).json(updatedGame);
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ error: 'Failed to join game' });
  }
});

export default router;