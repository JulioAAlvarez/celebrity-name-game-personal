# Celebrity Name Chain — Solo Edition

A full-stack multiplayer party game where players chain celebrity names. Built with Express, Prisma 7, PostgreSQL, Ionic React, TanStack Query, React Hook Form, and Axios.

This is a solo continuation of a group project originally developed for the CityTech TTP 2026 Summer Bootcamp.

**Original Group Project:** [Venus347/celebrity-name-game1](https://github.com/Venus347/celebrity-name-game1)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Ionic React | UI components and mobile-ready design |
| **Frontend State** | TanStack Query | API state management and caching |
| **Forms** | React Hook Form | Form handling and validation |
| **API Client** | Axios | HTTP requests from frontend to backend |
| **Backend** | Express.js | REST API server |
| **Database ORM** | Prisma 7 | Database modeling and queries |
| **Database** | PostgreSQL | Persistent data storage |
| **Language** | TypeScript | Type-safe code |
| **Package Manager** | Yarn 4 | Dependency management |--

## 🧩 Project Status

| Component | Status |
|-----------|--------|
| Prisma Schema | ✅ Complete |
| Database Migration | ✅ Applied and tested |
| Backend Routes | ✅ Complete |
| Frontend (Ionic) | ✅ Complete |
| TanStack Query | ✅ Integrated |
| React Hook Form | ✅ Integrated |
| Axios | ✅ Integrated |
| Game Logic | ✅ Fully working |
| Win Condition | ✅ Working |
| Leaderboard | ✅ Working |
| Visual Turn Indicator | ⏳ Planned |
| Player Feedback (correct/incorrect) | ⏳ Planned |
| ngrok Multiplayer Support | 🔴 **High Priority** |
| Code Documentation | ⏳ In progress |

---

## 📋 Progress Tracker

| Step | Task | Status |
|------|------|--------|
| 1 | README + repo cleanup | ✅ Done |
| 2 | Backend: Create game + join game routes | ✅ Done |
| 3 | Backend: Start game + first player bonus | ✅ Done |
| 4 | Backend: Guess route (chain validation + scoring) | ✅ Done |
| 5 | Backend: GET /games/:roomCode route | ✅ Done |
| 6 | Frontend: Lobby UI (create + join) | ✅ Done |
| 7 | Frontend: Gameplay UI (display name + guess input) | ✅ Done |
| 8 | Frontend: TanStack Query + React Hook Form integration | ✅ Done |
| 9 | Frontend: Leaderboard + game over | ✅ Done |
| 10 | API connection fix (Axios + CORS) | ✅ Done |
| 11 | README documentation | 🔄 In progress |
| 12 | **ngrok setup and documentation** | 🔴 **Next** |
| 13 | **Visual turn indicator** (who's turn to guess) | ⏳ Planned |
| 14 | **Player feedback** (correct/incorrect animations) | ⏳ Planned |
| 15 | **Code documentation** for main files | ⏳ Planned |
| 16 | **npx prisma studio** setup for DB viewing | ⏳ Planned |

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/test` | Health check |
| POST | `/api/games` | Create a new game (host) |
| POST | `/api/games/:roomCode/join` | Join a game |
| GET | `/api/games/:roomCode` | Get game state |
| POST | `/api/games/:roomCode/start` | Start the game (host only) |
| POST | `/api/games/:roomCode/set-name` | Set the first name (starter only) |
| POST | `/api/games/:roomCode/guess` | Submit a guess |

---

## 🎮 Game Rules

1. **Create a Room** — Host creates a room with a unique code
2. **Join a Room** — Other players join using the room code
3. **Start the Game** — Host starts the game, a random starter is chosen
4. **Starter Bonus** — The starting player gets 250 bonus points
5. **Set the First Name** — The starter sets the first celebrity name
6. **Chain Rule** — Each new name must start with the **first letter** of the previous name's **last name**
   - Example: `Albert Einstein` → `Elizabeth Warren` (E → E)
7. **Scoring** — 1000 points for the first correct guess
8. **Win Condition** — First to reach 10,000 points wins

---

## 📁 Repository Structure

```
celebrity-name-game-personal/
├── api/                 # Express + Prisma + PostgreSQL game server
│   ├── prisma/
│   │   ├── schema.prisma       # Database models
│   │   └── migrations/         # Migration history
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   └── index.ts            # Server entry point
│   ├── .env.example            # Environment variables template
│   └── package.json            # Backend dependencies
├── client/              # Ionic React frontend
│   ├── src/
│   │   ├── pages/              # Home, Game, etc.
│   │   └── App.tsx             # Main app component
│   └── package.json            # Frontend dependencies
├── data/                # Database dumps
├── archive/             # Archived files
└── README.md            # This file
```

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** 22+ (use `nvm install 22`)
- **Yarn** 4 (run `corepack enable`)
- **PostgreSQL** 14+ (running locally)

### Backend (`api/`)

```bash
cd api
yarn install
cp .env.example .env
```

Edit `.env` and set your database URL:

```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/celebrity_db"
```

Apply the schema:

```bash
yarn prisma:generate
yarn prisma db push
```

Start the server:

```bash
yarn dev
```

The API will be available at `http://localhost:3000`.

### Frontend (`client/`)

```bash
cd client
yarn install
cp .env.example .env
```

Edit `.env` and set the API URL:

```
VITE_API_URL=http://localhost:3000/api
```

Start the app:

```bash
yarn dev
```

The app will be available at `http://localhost:5173`.
```

---

## 🧪 Database

### View Database with Prisma Studio

```bash
cd api
npx prisma studio
```

Open `http://localhost:5555` to view and edit your database tables.

### Reset Database (If Needed)

```bash
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS celebrity_db;"
psql -h localhost -U postgres -c "CREATE DATABASE celebrity_db;"
yarn prisma db push
yarn prisma:generate
```


---

## 🛠️ Troubleshooting

If you run into issues, check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for common problems and solutions.

---

## 🤖 AI Disclosure

This project was developed with the assistance of **DeepSeek (Des)** for:
- Code structure and architecture planning
- Backend route implementation and debugging
- Frontend component design and state management
- Code review and documentation

All final decisions, testing, and deployment were completed by me.

---

## 📌 Future Features

- [ ] **ngrok multiplayer** — Expose the API for remote play
- [ ] **Visual turn indicator** — Show which player's turn it is
- [ ] **Player feedback** — Visual/audio feedback for correct/incorrect guesses
- [ ] **5-second bonus** — 500 points for a correct guess within 5 seconds
- [ ] **Timer per turn** — Add a countdown timer for each turn
- [ ] **UI Polish** — Better visual feedback, animations, transitions
- [ ] **Sound effects** — Add sounds for correct/incorrect guesses
- [ ] **Persistent leaderboard** — Save high scores across games
- [ ] **Player elimination** — Remove players who fail to guess in time

---

## 📚 Resources

- [Professor's Sample Repo](https://github.com/jonathan-chin/citytech-ttpr-2026-summer-celebrity-name-chain)
- [Prisma 7 Docs](https://www.prisma.io/docs/orm)
- [Ionic React Docs](https://ionicframework.com/docs/react)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form Docs](https://react-hook-form.com/)

---

**Made with 💻 and ☕ by Julio A. Alvarez**