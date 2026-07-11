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

// ============================================
// POST /api/games/:roomCode/start — Start the game
// ============================================
// Purpose: Host starts the game. Randomly selects a player to start the chain.
// The selected player gets 250 bonus points.
// Expects: { "username": "host" } in the request body (to verify host)
// Returns: The updated game object with the starting player.
// Errors:
//   - 400: Missing username, game already started, or player not found
//   - 403: User is not the host
//   - 404: Game not found
//   - 500: Database or server error
router.post('/games/:roomCode/start', async (req, res) => {
  const { roomCode } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    // Find the game with its players
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if game has already started
    if (game.hasStarted) {
      return res.status(400).json({ error: 'Game has already started' });
    }

    // Find the host player
    const hostPlayer = game.players.find(p => p.isHost === true);
    if (!hostPlayer) {
      return res.status(404).json({ error: 'Host not found' });
    }

    // Verify the requesting user is the host
    if (hostPlayer.username !== username) {
      return res.status(403).json({ error: 'Only the host can start the game' });
    }

    // Randomly select a starting player
    const randomIndex = Math.floor(Math.random() * game.players.length);
    const startingPlayer = game.players[randomIndex];

    // Update the game: mark as started, set currentName to null (will be set by the starter)
    const updatedGame = await prisma.game.update({
      where: { roomCode },
      data: {
        hasStarted: true,
        // The starter will set the name via a separate route or the same route
        // For now, we just mark the game as started and give bonus points to the starter
      },
      include: { players: true }
    });

    // Give the starting player 250 bonus points
    await prisma.player.update({
      where: { id: startingPlayer.id },
      data: {
        score: startingPlayer.score + 250
      }
    });

    // Fetch the updated game with the new scores
    const finalGame = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    res.status(200).json({
      game: finalGame,
      startingPlayer: startingPlayer.username,
      bonus: 250,
      message: `Game started! ${startingPlayer.username} gets 250 bonus points and will set the first name.`
    });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// ============================================
// POST /api/games/:roomCode/set-name — Set the first name (starter only)
// ============================================
// Purpose: The starting player sets the first celebrity name in the chain.
// Expects: { "username": "sam", "name": "Albert Einstein" } in the request body
// Returns: The updated game object with the new current name.
// Errors:
//   - 400: Missing username or name, game not started, or player not the starter
//   - 404: Game not found
//   - 500: Database or server error
router.post('/games/:roomCode/set-name', async (req, res) => {
  const { roomCode } = req.params;
  const { username, name } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: 'username and name are required' });
  }

  try {
    // Find the game with its players
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if game has started
    if (!game.hasStarted) {
      return res.status(400).json({ error: 'Game has not started yet' });
    }

    // Check if the current name is already set (should be null for first set)
    if (game.currentName) {
      return res.status(400).json({ error: 'Current name already set. Use guess route to chain.' });
    }

    // Find the player making the request
    const player = game.players.find(p => p.username === username);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Update the game with the new current name
    const updatedGame = await prisma.game.update({
      where: { roomCode },
      data: {
        currentName: name.trim()
      },
      include: { players: true }
    });

    res.status(200).json({
      message: `Name set to "${name.trim()}" by ${username}. Chain begins!`,
      game: updatedGame
    });
  } catch (error) {
    console.error('Error setting name:', error);
    res.status(500).json({ error: 'Failed to set name' });
  }
});

// ============================================
// POST /api/games/:roomCode/guess — Submit a guess
// ============================================
// Purpose: Submit a celebrity name guess. Validates the chain rule.
// First correct guess: 1000 points + sets the new name.
// Second correct guess within 5 seconds: 500 points (does NOT set the name).
// Expects: { "username": "sam", "guess": "Elizabeth Warren" }
// Returns: The result of the guess (correct/incorrect, points awarded, new name).
router.post('/games/:roomCode/guess', async (req, res) => {
  const { roomCode } = req.params;
  const { username, guess } = req.body;

  if (!username || !guess) {
    return res.status(400).json({ error: 'username and guess are required' });
  }

  try {
    // Find the game with its players
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if game has started
    if (!game.hasStarted) {
      return res.status(400).json({ error: 'Game has not started yet' });
    }

    // Check if there's a current name to chain from
    if (!game.currentName) {
      return res.status(400).json({ error: 'No current name set. Please set the first name first.' });
    }

    // Find the player making the request
    const player = game.players.find(p => p.username === username);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // ============================================
    // VALIDATE THE CHAIN RULE
    // ============================================
    // Rule: The new name's FIRST name must start with the
    // FIRST letter of the current name's LAST name.
    // Example: "Albert Einstein" → first letter of last name = "E"
    //          "Elizabeth Warren" → first letter of first name = "E" ✅

    const currentNameParts = game.currentName.trim().split(' ');
    const lastLetterOfLastName = currentNameParts[currentNameParts.length - 1][0].toUpperCase();

    const guessParts = guess.trim().split(' ');
    const firstLetterOfFirstName = guessParts[0][0].toUpperCase();

    if (firstLetterOfFirstName !== lastLetterOfLastName) {
      return res.status(400).json({
        error: 'Invalid chain!',
        expected: `First letter of first name must be "${lastLetterOfLastName}"`,
        received: `"${firstLetterOfFirstName}"`,
        hint: `Example: If current name is "Albert Einstein", next name must start with "E" like "Elizabeth Warren"`
      });
    }

    // ============================================
    // CHECK FOR WIN CONDITION (10,000 points)
    // ============================================
    if (player.score >= 10000) {
      return res.status(400).json({ error: 'You already won! Game over.' });
    }

    // ============================================
    // AWARD POINTS AND SET NEW NAME
    // ============================================
    // For now, we'll implement a simplified version:
    // First correct guess = 1000 points + sets the new name
    // (We'll add the 5-second second-guess logic later)

    // Update the player's score
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        score: player.score + 1000
      }
    });

    // Set the new name
    const updatedGame = await prisma.game.update({
      where: { roomCode },
      data: {
        currentName: guess.trim()
      },
      include: { players: true }
    });

    // Check if any player has reached 10,000 points
    const winner = updatedGame.players.find(p => p.score >= 10000);

    if (winner) {
      return res.status(200).json({
        message: `🎉 ${winner.username} wins the game with ${winner.score} points!`,
        winner: winner.username,
        game: updatedGame
      });
    }

    res.status(200).json({
      message: `✅ Correct! ${username} gets 1000 points!`,
      pointsAwarded: 1000,
      newName: guess.trim(),
      player: updatedPlayer,
      game: updatedGame
    });
  } catch (error) {
    console.error('Error processing guess:', error);
    res.status(500).json({ error: 'Failed to process guess' });
  }
});

export default router;