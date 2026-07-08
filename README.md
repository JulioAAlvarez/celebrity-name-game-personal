# Celebrity Name Chain — Personal Edition

A full-stack multiplayer party game where players chain celebrity names. Built with Express, Prisma 7, PostgreSQL, and Ionic React.

This is a personal continuation of a group project originally developed for the CityTech TTP 2026 Summer Bootcamp. The original group repo can be found [here](https://github.com/Venus347/celebrity-name-game1).

---

## 🧩 Project Status

| Component | Status |
|-----------|--------|
| Prisma Schema | ✅ Complete (`Game`, `Player`, `Celebrity`) |
| Database Migration | ✅ Applied and tested |
| Express Routes | ✅ `POST /api/games` working |
| Frontend (Ionic) | ✅ Running |
| Full-Stack Connection | 🔄 In progress |

---

## 📁 Repository Structure

```
celebrity-name-game1/
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
├── archive/             # Archived files (e.g., CLASSMATE_README.md)
└── README.md            # This file
```

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** 22+ (use `nvm install 22`)
- **Yarn** 4 (run `corepack enable`)
- **PostgreSQL** 14+ (running locally)

> For detailed setup instructions per operating system, see the [Prerequisites](#prerequisites) section.

---

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

**Test the routes:**
- `GET http://localhost:3000/api/test` → Router test
- `POST http://localhost:3000/api/games` → Create a game

---

### Frontend (`client/`)

```bash
cd client
yarn install
cp .env.example .env
```

Edit `.env` and set the API URL:

```
VITE_API_URL=http://localhost:3000
```

Start the app:

```bash
yarn dev
```

The app will be available at `http://localhost:8100` (or `http://localhost:5173` depending on your Vite config).

---

### Play Together (ngrok)

Expose the API so others can test:

```bash
ngrok http 3000
```

Share the `https://...ngrok.io` URL.

> ⚠️ **Never expose your database directly.** Only share the API via ngrok.

---

## 🧪 Database

### Restore from Dump

```bash
createdb celebrity_db
psql -d celebrity_db < data/dump.sql
```

### Generate a Fresh Dump

```bash
pg_dump -h localhost -U postgres -W -d celebrity_db > data/dump.sql
```

### Reset Database (If Needed)

If you run into migration issues:

```bash
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS celebrity_db;"
psql -h localhost -U postgres -c "CREATE DATABASE celebrity_db;"
yarn prisma db push
yarn prisma:generate
```

---

## 🤖 AI Disclosure

This project was developed with assistance from:

| Tool | Role |
|------|------|
| **DeepSeek (Des)** | Prisma schema design, debugging support, documentation, and README structure |

All final decisions, code implementation, and testing were completed by me.

---

## 📚 Resources

- [Professor's Sample Repo](https://github.com/jonathan-chin/citytech-ttpr-2026-summer-celebrity-name-chain)
- [Prisma 7 Docs](https://www.prisma.io/docs/orm)
- [Ionic React Docs](https://ionicframework.com/docs/react)

---

## 📌 Next Steps

- [ ] Connect frontend to backend (axios/fetch)
- [ ] Add remaining game routes (`GET /api/games`, `POST /api/players`)
- [ ] Implement real game logic (turn management, score tracking)

---

## 🛠️ Troubleshooting

If you run into issues, check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for common problems and solutions.

---

**Made with 💻 and ☕ by Julio A. Alvarez**
