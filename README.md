# Celebrity Name Chain — Solo Edition

A full-stack multiplayer party game where players chain celebrity names. Built with Express, Prisma 7, PostgreSQL, Ionic React, TanStack Query, and React Hook Form.

This is a solo continuation of a group project originally developed for the CityTech TTP 2026 Summer Bootcamp.

The original group repo can be found [here](https://github.com/Venus347/celebrity-name-game1).

---

## 🧩 Project Status

| Component | Status |
|-----------|--------|
| Prisma Schema | ✅ Complete (`Game`, `Player`, `Celebrity`) |
| Database Migration | ✅ Applied and tested |
| Backend Routes | 🔄 In progress |
| Frontend (Ionic) | 🔄 In progress |
| TanStack Query | ⏳ Planned |
| React Hook Form | ⏳ Planned |

---

## 📋 Progress Tracker

| Step | Task | Status |
|------|------|--------|
| 1 | README + repo cleanup | ✅ Done |
| 2 | Backend: Create game + join game routes | ⏳ Next |
| 3 | Backend: Start game + first player bonus | ⏳ Pending |
| 4 | Backend: Guess route (chain validation + scoring) | ⏳ Pending |
| 5 | Frontend: Lobby UI (create + join) | ⏳ Pending |
| 6 | Frontend: Gameplay UI (display name + guess input) | ⏳ Pending |
| 7 | Frontend: TanStack Query + React Hook Form | ⏳ Pending |
| 8 | Frontend: Leaderboard + game over | ⏳ Pending |

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

Create a `.env` and inside set your database URL to:

```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/celebrity_db"
```
(There is a '.env.example' file with a capy paste ready for you!)

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

Create an `.env` and set the API URL:

```
VITE_API_URL=http://localhost:3000
```
(Just like above, there is a '.env.example' file with a capy paste ready for you )

Start the app:

```bash
yarn dev
```

The app will be available at `http://localhost:5173`.

---

## 🧪 Database

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

## 📚 Resources

- [Professor's Sample Repo](https://github.com/jonathan-chin/citytech-ttpr-2026-summer-celebrity-name-chain)
- [Prisma 7 Docs](https://www.prisma.io/docs/orm)
- [Ionic React Docs](https://ionicframework.com/docs/react)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form Docs](https://react-hook-form.com/)

---

## 📌 Next Steps

- [x] README + repo cleanup
- [ ] Backend: Create game + join game routes
- [ ] Backend: Start game + first player bonus
- [ ] Backend: Guess route (chain validation + scoring)
- [ ] Frontend: Lobby UI
- [ ] Frontend: Gameplay UI
- [ ] Frontend: TanStack Query + React Hook Form
- [ ] Frontend: Leaderboard + game over

---

**Made with 💻 and ☕ by Julio A. Alvarez**