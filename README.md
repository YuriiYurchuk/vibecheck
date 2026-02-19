# VibeCheck

VibeCheck is a web app for analyzing your Spotify listening habits. It collects and stores your listening history, analyzes audio features via the Spotify API and ReccoBeats API, and displays detailed stats through interactive charts.

![VibeCheck Demo](./docs/demo.gif)

## Features

- **Overview** - total listening time, plays, unique artists and tracks, top tracks and artists by day / week / month
- **Listening History** - yearly activity calendar and hourly activity distribution
- **Mood Analysis** - tempo, loudness, instrumentalness, musical keys, mood quadrants, audio features profile, musical pulse
- **Insights** - monthly recap: most active day, peak listening hours, musical mood, listening streaks
- **Recent Plays** - full list of recently played tracks with search
- **UI/UX** - fully responsive design, Dark/Light mode, and English/Ukrainian localization (i18n)

## Tech Stack

- Next.js 16, React 19, TypeScript
- Prisma 7, PostgreSQL 18
- Better-Auth (Spotify OAuth)
- Spotify API, ReccoBeats API
- TanStack Query, Recharts, shadcn/ui, Tailwind CSS 4
- Biome, Husky
- Docker, Caddy

---

## Table of Contents

- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Server Deployment](#server-deployment)
- [Cron Setup](#cron-setup)
- [Useful Commands](#useful-commands)

---

## Requirements

- Node.js 24+
- pnpm
- Docker + Docker Compose

---

## Environment Variables

All variables are required — the project won't start without them.

### `DATABASE_URL`

PostgreSQL connection string.

- Local: `postgresql://postgres:postgres@localhost:5433/vibecheck`
- Server (Docker): `postgresql://postgres:postgres@postgres:5432/vibecheck`

> Port `5433` is used locally to avoid conflicts with a locally installed PostgreSQL which typically runs on `5432`.

### `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`

Get these from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):

1. Create a new app
2. Find `Client ID` and `Client Secret` in the settings
3. Add a Redirect URI (details below)

### `BETTER_AUTH_SECRET`

A secret string used to sign sessions. Generate one:

```bash
openssl rand -hex 32
```

Do not change this after users have started signing up - all sessions will be invalidated.

### `BETTER_AUTH_URL`

The public URL of the app. Must match the Redirect URI in the Spotify Dashboard.

- Local: `http://127.0.0.1:3000`
- Server: `https://<IP>.nip.io` or `https://yourdomain.com`

### `NEXT_PUBLIC_HIDE_LOGIN`

Hides the login button in the UI. Value: `true` or `false`.

### `CRON_SECRET`

A secret token to protect the cron endpoint that syncs listening history. Generate one:

```bash
openssl rand -hex 32
```

### `SERVER_IP`

The public IP of your server. Used by Caddy to automatically get an SSL certificate via `nip.io`.

- Example: `44.201.86.95`
- Local: leave empty

> `nip.io` is a free service that maps IPs to domains. For example, `44.201.86.95.nip.io` resolves to `44.201.86.95`. Caddy automatically obtains a real SSL certificate from Let's Encrypt for this domain.

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/YuriiYurchuk/vibecheck.git
cd vibecheck
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/vibecheck"
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
BETTER_AUTH_SECRET="generated_secret"
BETTER_AUTH_URL="http://127.0.0.1:3000"
NEXT_PUBLIC_HIDE_LOGIN="false"
CRON_SECRET="generated_secret"
SERVER_IP=""
```

### 4. Set up Spotify

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create or open an existing app
3. In settings, add a Redirect URI: `http://127.0.0.1:3000/api/auth/callback/spotify`
4. Copy `Client ID` and `Client Secret` into `.env`

### 5. Start the database

```bash
docker compose up postgres -d
```

The `vibecheck` database is created automatically on first run.

### 6. Run migrations

```bash
pnpm db:migrate
```

### 7. Start the app

```bash
pnpm dev
```

The app will be available at `http://127.0.0.1:3000`

### Alternative - full local Docker build

To run a full production build locally:

```bash
docker compose up --build -d
```

> Builds the image locally and starts postgres + app. No Caddy or SSL - the app will be available at `http://127.0.0.1:3000`.

---

## Server Deployment

Works on any VPS running Ubuntu/Debian - DigitalOcean, Hetzner, AWS EC2, Vultr, etc.

### 1. Open ports

> ⚠️ This step is required - without open ports the site won't be accessible from outside.

Open ports in **two places**:

**1. Server firewall:**

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

**2. Your provider's control panel** (Security Group, Firewall, etc.):

Find the network settings for your instance and add inbound rules:

| Port | Protocol | Purpose |
|------|----------|---------|
| 80   | TCP      | HTTP    |
| 443  | TCP      | HTTPS   |

> ⚠️ Opening ports `80` and `443` in your provider's control panel is mandatory. This is the most common reason a site doesn't load after deployment even when everything else is configured correctly.

### 2. Install Docker

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
exit
# Reconnect so group changes take effect
```

### 3. Clone the repository

```bash
git clone https://github.com/YuriiYurchuk/vibecheck.git
cd vibecheck
```

### 4. Set up .env

```bash
nano .env
```

```dotenv
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/vibecheck"
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
BETTER_AUTH_SECRET="generated_secret"
BETTER_AUTH_URL="https://<IP>.nip.io"
NEXT_PUBLIC_HIDE_LOGIN="false"
CRON_SECRET="generated_secret"
SERVER_IP="<IP>"
```

Replace `<IP>` with your server's public IP. For example, if the IP is `44.201.86.95`:

```dotenv
BETTER_AUTH_URL="https://44.201.86.95.nip.io"
SERVER_IP="44.201.86.95"
```

Generate secrets directly on the server:

```bash
openssl rand -hex 32  # for BETTER_AUTH_SECRET
openssl rand -hex 32  # for CRON_SECRET
```

### 5. Set up Spotify

In the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) add a Redirect URI:

```
https://<IP>.nip.io/api/auth/callback/spotify
```

For example: `https://44.201.86.95.nip.io/api/auth/callback/spotify`

### 6. Start

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Caddy will automatically obtain an SSL certificate from Let's Encrypt on first start.

The app will be available at `https://<IP>.nip.io`

---

## Cron Setup

The `/api/cron/sync` endpoint syncs new listening history from Spotify. It needs to be called externally via a scheduler.

### Option 1 - crontab on the server

```bash
crontab -e
```

Add a line (e.g. every hour):

```
0 * * * * curl -s -X GET "https://<IP>.nip.io/api/cron/sync" -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Replace `YOUR_CRON_SECRET` with the value of `CRON_SECRET` from `.env`.

### Option 2 - cron-job.org

Free option with execution monitoring:

1. Sign up at [cron-job.org](https://cron-job.org)
2. Create a new cron job:
   - **URL**: `https://<IP>.nip.io/api/cron/sync`
   - **Schedule**: as needed
   - **Headers**: `Authorization: Bearer YOUR_CRON_SECRET`
3. Save

---

## Useful Commands

```bash
# Start only the database (for local development)
docker compose up postgres -d

# View app logs
docker compose -f docker-compose.prod.yml logs -f app

# View Caddy logs
docker compose -f docker-compose.prod.yml logs -f caddy

# View database logs
docker compose -f docker-compose.prod.yml logs -f postgres

# Container status
docker compose -f docker-compose.prod.yml ps

# Enter the container
docker compose -f docker-compose.prod.yml exec app sh

# Stop containers
docker compose -f docker-compose.prod.yml down

# Stop and delete the database (warning - all data will be lost)
docker compose -f docker-compose.prod.yml down -v

# Clean up unused Docker volumes
docker volume prune -f
```