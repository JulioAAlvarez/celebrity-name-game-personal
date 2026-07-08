# Classmate README — Celebrity Name Chain

**Purpose:** This document is a log of everything that happened on **July 6, 2026** — what the professor did, what we fixed, and what you need to do to get back up to speed.

---

## 📅 Today's Timeline

### Morning (Before Class)

- Branches existed: `jacob_branch`, `justice_branch`, `JulioAAlvarez/express-testing`
- `merge/backend-frontend` was created as a staging branch
- A `prod` folder was created locally to test merges safely

### During Class (Professor's Involvement)

- The professor took over one of the laptops to **clean up branches**
- He attempted to merge `jacob_branch` into `main` but encountered issues
- Some branches were deleted or became out of sync
- The remote `merge/backend-frontend` branch was temporarily removed

### After Class (What We Fixed)

We restored order by:

1. **Recreating the `merge/backend-frontend` branch** from the `prod` folder
2. **Pushing it back to GitHub**
3. **Pulling it into the original repo**
4. **Fixing the folder structure** (removed nested `api/` folders)
5. **Adding missing files**:
   - `api/src/routes/games.ts` (route handler)
   - `api/src/celeb_names1.csv` (celebrity dataset)
6. **Regenerating the Prisma client**
7. **Testing the backend** — `POST /api/games` now returns a mock response
8. **Testing the frontend** — `yarn dev` runs without errors

---

## 🛠️ What We Fixed / Cleaned Up

| Issue | Fix |
|-------|-----|
| Nested `api/` folder | Moved `routes/` and `celeb_names1.csv` to the correct location |
| Missing `routes/` folder | Recreated `routes/` and added `games.ts` |
| Missing CSV file | Created `celeb_names1.csv` with sample celebrity names |
| Prisma client missing | Ran `yarn prisma:generate` |
| Port conflicts | Killed processes using `sudo lsof -i :3000` |
| Branch confusion | Re-established `merge/backend-frontend` as the staging branch |

---

## 🧭 What You Need to Do

### Step 1: Pull the Latest Changes

```bash
cd ~/Documents/code/TTRP2026/celebrity-name-game1
git checkout merge/backend-frontend
git pull origin merge/backend-frontend
```

### Step 2: Set Up the Backend

```bash
cd api
cp .env.example .env
# Edit .env and set your DATABASE_URL
yarn install
yarn prisma:generate
yarn prisma db push
yarn dev
```

### Step 3: Set Up the Frontend

```bash
cd ../client
yarn install
yarn dev
```

### Step 4: Test the Connection

- Backend: `http://localhost:3000/api/test` → `{"message":"Router is working!"}`
- Frontend: `http://localhost:5173` → should load the Ionic app

---

## ✅ Current Working State

| Component | Status |
|-----------|--------|
| Backend server | ✅ Running on `http://localhost:3000` |
| `POST /api/games` | ✅ Returns mock response |
| Frontend server | ✅ Running on `http://localhost:5173` |
| Prisma client | ✅ Generated |
| CSV loading | ✅ Works (celebrity names loaded) |

---

## 📌 Next Steps for the Team

1. **Test the frontend and backend together**
2. **Connect the frontend to the backend** using `axios` or `fetch`
3. **Add remaining routes** (`GET /games`, `POST /players`)
4. **Merge `merge/backend-frontend` to `main`**
5. **Deploy or present the final product**

---

## 🙏 Acknowledgment

This cleanup was possible because we kept a **safe copy (`prod` folder)** and worked through each issue step by step. Going forward, always:
- Keep a local backup of working code
- Test merges in a separate branch before pushing to `main`
- Communicate with teammates before deleting branches

---

**Made with 💻 and ☕ by the Celebrity Name Chain team.**

*Document generated on July 6, 2026.*

---

## What's Next (My Suggestions)

Now that the foundation is solid, here's what I'd prioritize:

### 1. Connect Frontend to Backend (Highest Priority)
- Use `axios` or `fetch` to call your API from the Ionic app
- Display real data from the backend (not mock responses)
- Test the full flow: frontend → backend → database

### 2. Replace Mock Responses with Real Database Logic
- Update `POST /api/games` to actually save to the database using Prisma
- Add `GET /games` to fetch all games from the database

### 3. Add Remaining Game Routes
- `POST /players` — join a game
- `POST /moves` — submit a celebrity name
- `GET /game/:id` — get current game state

### 4. Implement Game Logic
- Turn management (whose turn is it?)
- Validation (does the name start with the correct letter?)
- Score tracking

### 5. Polish & Deploy
- Add error handling and loading states in the frontend
- Test with ngrok so teammates can play together
- Final review and presentation prep

---

## Quick Start for Next Session

```bash
# Pull the latest
cd ~/<Whereever your code is saved at>
git checkout main
git pull origin main

# Start the backend
cd api
yarn dev

# Start the frontend (new terminal)
cd ../client
yarn dev
```

