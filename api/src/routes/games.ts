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
router.post('/games', async (req, res) => {
  console.log('📥 Received request to create game:', req.body);

  const { roomCode, username } = req.body;

  if (!roomCode || !username) {
    console.log('❌ Missing roomCode or username:', { roomCode, username });
    return res.status(400).json({ error: 'roomCode and username are required' });
  }

  try {
    console.log(`🔍 Checking if room code "${roomCode}" exists...`);
    const existingGame = await prisma.game.findUnique({
      where: { roomCode }
    });

    if (existingGame) {
      console.log(`⚠️ Room code "${roomCode}" already exists.`);
      return res.status(409).json({ error: 'Room code already in use' });
    }

    console.log(`✅ Creating game with room code "${roomCode}" for user "${username}"`);
    const game = await prisma.game.create({
      data: {
        roomCode,
        currentName: null,
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

    console.log(`🎉 Game created successfully:`, game.id);
    res.status(201).json(game);
  } catch (error) {
    console.error('❌ Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// ============================================
// POST /api/games/:roomCode/join — Join a game
// ============================================
router.post('/games/:roomCode/join', async (req, res) => {
  console.log('📥 Received request to join game:', req.params, req.body);

  const { roomCode } = req.params;
  const { username } = req.body;

  if (!username) {
    console.log('❌ Missing username');
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    console.log(`🔍 Finding game with room code "${roomCode}"...`);
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      console.log(`❌ Game with room code "${roomCode}" not found.`);
      return res.status(404).json({ error: 'Game not found' });
    }

    const existingPlayer = game.players.find(p => p.username === username);
    if (existingPlayer) {
      console.log(`⚠️ Username "${username}" already taken in game "${roomCode}".`);
      return res.status(409).json({ error: 'Username already taken in this game' });
    }

    if (game.hasStarted) {
      console.log(`⚠️ Game "${roomCode}" has already started.`);
      return res.status(400).json({ error: 'Game has already started' });
    }

    console.log(`✅ Adding player "${username}" to game "${roomCode}"`);
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

    console.log(`🎉 Player "${username}" joined game "${roomCode}"`);
    res.status(201).json(updatedGame);
  } catch (error) {
    console.error('❌ Error joining game:', error);
    res.status(500).json({ error: 'Failed to join game' });
  }
});

// ============================================
// GET /api/games/:roomCode — Get game state
// ============================================
router.get('/games/:roomCode', async (req, res) => {
  console.log(`📥 Received request to get game state for room: ${req.params.roomCode}`);

  const { roomCode } = req.params;

  try {
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      console.log(`❌ Game with room code "${roomCode}" not found.`);
      return res.status(404).json({ error: 'Game not found' });
    }

    console.log(`✅ Game state fetched for room "${roomCode}"`);
    res.json(game);
  } catch (error) {
    console.error('❌ Error fetching game state:', error);
    res.status(500).json({ error: 'Failed to fetch game state' });
  }
});

// ============================================
// POST /api/games/:roomCode/start — Start the game
// ============================================
router.post('/games/:roomCode/start', async (req, res) => {
  console.log('📥 Received request to start game:', req.params, req.body);

  const { roomCode } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.hasStarted) {
      return res.status(400).json({ error: 'Game has already started' });
    }

    const hostPlayer = game.players.find(p => p.isHost === true);
    if (!hostPlayer) {
      return res.status(404).json({ error: 'Host not found' });
    }

    if (hostPlayer.username !== username) {
      return res.status(403).json({ error: 'Only the host can start the game' });
    }

    const randomIndex = Math.floor(Math.random() * game.players.length);
    const startingPlayer = game.players[randomIndex];

    await prisma.game.update({
      where: { roomCode },
      data: {
        hasStarted: true,
      },
      include: { players: true }
    });

    await prisma.player.update({
      where: { id: startingPlayer.id },
      data: {
        score: startingPlayer.score + 250
      }
    });

    const finalGame = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    console.log(`🎮 Game "${roomCode}" started! Starter: ${startingPlayer.username}`);
    res.status(200).json({
      game: finalGame,
      startingPlayer: startingPlayer.username,
      bonus: 250,
      message: `Game started! ${startingPlayer.username} gets 250 bonus points and will set the first name.`
    });
  } catch (error) {
    console.error('❌ Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// ============================================
// POST /api/games/:roomCode/set-name — Set the first name
// ============================================
router.post('/games/:roomCode/set-name', async (req, res) => {
  console.log('📥 Received request to set name:', req.params, req.body);

  const { roomCode } = req.params;
  const { username, name } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: 'username and name are required' });
  }

  try {
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (!game.hasStarted) {
      return res.status(400).json({ error: 'Game has not started yet' });
    }

    if (game.currentName) {
      return res.status(400).json({ error: 'Current name already set. Use guess route to chain.' });
    }

    const player = game.players.find(p => p.username === username);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const updatedGame = await prisma.game.update({
      where: { roomCode },
      data: {
        currentName: name.trim()
      },
      include: { players: true }
    });

    console.log(`📝 Name set to "${name.trim()}" by ${username}`);
    res.status(200).json({
      message: `Name set to "${name.trim()}" by ${username}. Chain begins!`,
      game: updatedGame
    });
  } catch (error) {
    console.error('❌ Error setting name:', error);
    res.status(500).json({ error: 'Failed to set name' });
  }
});

// ============================================
// POST /api/games/:roomCode/guess — Submit a guess
// ============================================
router.post('/games/:roomCode/guess', async (req, res) => {
  console.log('📥 Received guess:', req.params, req.body);

  const { roomCode } = req.params;
  const { username, guess } = req.body;

  if (!username || !guess) {
    return res.status(400).json({ error: 'username and guess are required' });
  }

  try {
    const game = await prisma.game.findUnique({
      where: { roomCode },
      include: { players: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (!game.hasStarted) {
      return res.status(400).json({ error: 'Game has not started yet' });
    }

    if (!game.currentName) {
      return res.status(400).json({ error: 'No current name set. Please set the first name first.' });
    }

    const player = game.players.find(p => p.username === username);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Validate chain rule
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

    if (player.score >= 10000) {
      return res.status(400).json({ error: 'You already won! Game over.' });
    }

    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        score: player.score + 1000
      }
    });

    const updatedGame = await prisma.game.update({
      where: { roomCode },
      data: {
        currentName: guess.trim()
      },
      include: { players: true }
    });

    console.log(`✅ Correct guess by ${username}! New name: "${guess.trim()}"`);

    const winner = updatedGame.players.find(p => p.score >= 10000);

    if (winner) {
      console.log(`🏆 ${winner.username} wins the game with ${winner.score} points!`);
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
    console.error('❌ Error processing guess:', error);
    res.status(500).json({ error: 'Failed to process guess' });
  }
});

export default router;