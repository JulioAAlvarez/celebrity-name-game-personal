import "dotenv/config";
import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from 'fs';
import gamesRouter from './routes/games.js';

//Imports celebrity names from a json file and maps them onto an array
const filePath: string = 'celeb_names.json';
const a = fs.readFileSync(filePath, 'utf8');
interface celeb{
  name: string;
}
const data: celeb = JSON.parse(a);
const output = Object.values(data).map(x => x);
const names: string[] = output.map(x => x.name);
console.log(names[0]);


const app = express(); 
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({adapter});
app.use(express.json());
const PORT = 3000;


function getRoomCode() {
  let roomID = "Room_";
  for (let i = 0; i < 7;i++){
    roomID += String(Math.floor(Math.random()*10));
  }
  return roomID;
}

function getPlayerID(){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let playerID = "";
  for (let i = 0; i<7; i++){
    playerID += chars[Math.floor(Math.random() * chars.length)];
  }
  return playerID;
}
function getCelebName() {
  return names[Math.floor(Math.random() * names.length)];
};

app.use('/api', gamesRouter);

app.post('/games', async (req, res) => {
  try{
    const player_id = getPlayerID();
    const room_code = getRoomCode();
    const celeb_name = getCelebName();
    let players : string[] = [];
    players.push(player_id)

    const game = await prisma.game.create({
      data: {
        roomCode: room_code,
        currentName: celeb_name,
        players: players
      }
    })
    return res.json(game);
  } catch(error){
    if (error instanceof Error){
      console.log(error.message);
    }
    return res.status(500).json({
      message: "Error: failed to start game.",
    })
  }
});

app.get('/games/join/:room_id', async (req, res) => {
  const room = String(req.params.room_id);
  
});


app.listen(PORT, () => {
  console.log('server has started');
})


