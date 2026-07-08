# Troubleshooting — Celebrity Name Chain

Common issues and how to fix them.

---

## Backend Issues

### `Error: Cannot find module './generated/prisma/client.js'`

**Solution:**
```bash
cd api
yarn prisma:generate
```

### `Error: P3006` or `P3018` (Migration conflicts)

**Solution:**
```bash
# Drop and recreate the database
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS celebrity_db;"
psql -h localhost -U postgres -c "CREATE DATABASE celebrity_db;"

# Push the schema instead of migrating
yarn prisma db push
yarn prisma:generate
```

### `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:** Another process is using port 3000. Find and kill it:
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### `Cannot GET /` or `Cannot GET /api/games`

The server is running, but the route doesn't exist. Check:
- Are the routes defined in `api/src/index.ts`?
- Is the router imported and mounted? (`app.use('/api', gamesRouter);`)

---

## Frontend Issues

### `Error: Couldn't find the node_modules state file`

**Solution:**
```bash
cd client
yarn install
```

### `Error: VITE_API_URL is not defined`

**Solution:** Create a `.env` file in `client/`:
```
VITE_API_URL=http://localhost:3000
```

---

## Database Issues

### `Password authentication failed for user "postgres"`

**Solution:** Reset your PostgreSQL password:
```bash
sudo -u postgres psql
ALTER USER postgres PASSWORD 'your_password';
\q
```
Then update your `.env` file with the new password.

### `Database "celebrity_db" does not exist`

**Solution:** Create the database:
```bash
psql -h localhost -U postgres -c "CREATE DATABASE celebrity_db;"
```

---

## General Issues

### `yarn: command not found`

**Solution:** Enable Corepack:
```bash
corepack enable
```

### `bash or zsh: command not found: <command>`

**Solution:** The command isn't installed or not in your PATH. Try:
```bash
# Check if the command exists
which <command>

# If using Python packages
export PATH="$HOME/.local/bin:$PATH"
```

---

If you encounter an issue not listed here, check the logs and search the error message online.

