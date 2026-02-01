# How env is taken into account in Docker

## Current behavior

### Dockerfile / Dockerfile.build

- **No `.env` or env file** is copied or used during the image build.
- Only these are set **inside the image**:
  - `NODE_ENV=production`
  - `NEXT_TLEMETRY_DISABLED=1`
  - `PORT=3000`
  - `HOSTNAME=0.0.0.0`
- **Build time:** `next build` runs without your app env vars (e.g. no `NEXT_PUBLIC_*`, no `ADMIN_SECRET`). So:
  - `NEXT_PUBLIC_BASE_URL` is **not** baked in at build time when using Dockerfile.build.
  - Server-only vars like `ADMIN_SECRET` are only needed at **runtime**, not at build.
- **Runtime:** Any other env (e.g. `ADMIN_SECRET`, `NEXT_PUBLIC_BASE_URL`) must be passed when **running** the container (see below).

### docker-compose

- The `nextjs` service has an **`environment:`** block with fixed values:
  - `NODE_ENV`, `NEXT_PUBLIC_BASE_URL`, `PORT`
- There is **no** `env_file:` and **no** `ADMIN_SECRET` in the compose files, so:
  - A `.env` file in the project is **not** loaded by Docker Compose unless we add it.
  - `ADMIN_SECRET` is never set, so `/admin/leads` will always return 401.

---

## What was changed

1. **docker-compose.yml** and **docker-compose.prod.yml** (and **docker-compose.production.yml** if present):
   - **`env_file: - .env`** added for the `nextjs` service so Compose loads variables from a `.env` file in the same directory as the compose file (create `.env` from `.env.example`, do not commit `.env`).
   - **`ADMIN_SECRET=${ADMIN_SECRET}`** added to the `nextjs` service `environment` so the app gets your admin key at runtime (from `.env` or from your shell).

2. **Using a `.env` file (recommended):**
   - Create `.env` before running docker-compose (Compose requires the file to exist if `env_file: - .env` is set). Copy: `cp .env.example .env`
   - Edit `.env` and set at least:
     - `ADMIN_SECRET=<your-secret-key>`
     - Optionally `NEXT_PUBLIC_BASE_URL=https://zodiak.life`
   - Run: `docker-compose up -d` (or `docker-compose -f docker-compose.prod.yml up -d`). Compose will pass these into the container.

3. **Without a `.env` file:**
   - Export in your shell before starting: `export ADMIN_SECRET=your-secret`
   - Then run docker-compose; `${ADMIN_SECRET}` in the compose file will use that value.

---

## Build-time vs runtime

| Variable                | When needed | How to set in Docker |
|-------------------------|------------|------------------------|
| `NEXT_PUBLIC_BASE_URL`  | Build (if baked in HTML) or runtime | Set in `environment` in compose (already there) or in `.env` |
| `ADMIN_SECRET`          | Runtime only | Set in `.env` and add to compose `environment` (see above) |
| `NODE_ENV`, `PORT`      | Runtime    | Already set in Dockerfile and/or compose |

---

## Optional: build-time NEXT_PUBLIC_* (Dockerfile.build)

If you want `NEXT_PUBLIC_BASE_URL` (or other `NEXT_PUBLIC_*`) to be baked in **during** `docker build -f Dockerfile.build`, you must pass them as build args and set them as ENV in the builder stage, for example:

```dockerfile
# In the builder stage, before RUN npm run build:
ARG NEXT_PUBLIC_BASE_URL=https://zodiak.life
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
RUN npm run build
```

Then build with:

```bash
docker build -f Dockerfile.build --build-arg NEXT_PUBLIC_BASE_URL=https://zodiak.life -t zodiak-website:latest .
```

Right now the compose files pass `NEXT_PUBLIC_BASE_URL` at **runtime**; Next.js standalone can use runtime env for server-side code, but client-side code may have been built with a different or empty value. If you need the correct URL in the browser, either use the build-arg approach above or ensure your build (e.g. CI) runs with `NEXT_PUBLIC_BASE_URL` set before `next build`.
