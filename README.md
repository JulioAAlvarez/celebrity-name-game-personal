> **Personal Fork:** This is a personal continuation of the group project originally developed with [Justice] and [Jacob] for the CityTech TTP 2026 Summer Bootcamp. Original repo: [Venus347/celebrity-name-game1](https://github.com/Venus347/celebrity-name-game1).

# Celebrity Name Chain

A full-stack multiplayer party game where players chain celebrity names. Built with Express, Prisma 7, PostgreSQL, and Ionic React.

---

## 🧩 Project Status

| Component | Status |
|-----------|--------|
| Prisma Schema | ✅ Complete (`Game`, `Player`, `Celebrity`) |
| Database Migration | ✅ Applied and tested |
| SQL Dump | ✅ Generated and committed |
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
│   ├── src/             # TypeScript source code
│   ├── .env.example     # Environment variables template
│   └── package.json     # Dependencies and scripts
├── client/              # Ionic React frontend
├── data/                # Database dump (dump.sql)
└── README.md            # Main documentation
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
yarn prisma:migrate dev
```

Start the server:

```bash
yarn dev
```

Test: `GET http://localhost:3000/health` → `{ "ok": true }`

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

The app will be available at `http://localhost:8100`.

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

---

## 🤖 AI Disclosure

This project was developed with the assistance of AI tools. Each team member's usage is disclosed below:

| Team Member | AI Tool Used | Role |
|-------------|--------------|------|
| Julio A. Alvarez | DeepSeek (Des) | Prisma schema design, debugging support, documentation, and README structure |
| Jake | None | Built backend and API integration independently |
| Justice Kirton | Copilot | Frontend UI components and form handling |

All final decisions, code implementation, and testing were completed by the project team. AI was used as a learning and productivity aid.

---

## 📝 Team Members

| Name | GitHub | Role |
|------|--------|------|
| Jake | `Venus347` | Team Lead / Backend / Express API |
| Justice Kirton | `Justicekirton` | Frontend / Ionic |
| Julio A. Alvarez | `JulioAAlvarez` | Database / Prisma Schema |

---

## 📚 Resources

- [Professor's Sample Repo](https://github.com/jonathan-chin/citytech-ttpr-2026-summer-celebrity-name-chain)
- [Prisma 7 Docs](https://www.prisma.io/docs/orm)
- [Ionic React Docs](https://ionicframework.com/docs/react)

---

## 📌 Next Steps

- [ ] Merge `merge/backend-frontend` to `main`
- [ ] Connect frontend to backend (axios/fetch)
- [ ] Add remaining game routes (`POST /players`, `GET /games`)
- [ ] Implement real game logic (turn management, score tracking)
- [ ] Deploy or present final product

---

**Made with 💻 and ☕ by the Celebrity Name Chain team.**