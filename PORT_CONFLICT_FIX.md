# Port Conflict Fix: Grafana on Port 3000

## Problem

Grafana is running on port 3000 on your server, which conflicts with Next.js trying to use the same port.

## Solution

**Next.js should NOT expose port 3000 to the host.** It should only use port 3000 **inside the Docker container**, and Nginx will proxy to it via the Docker network.

## Architecture

```
Internet → Nginx (port 80/443) → Docker Network → Next.js (port 3000 inside container)
                                    ↓
                              Grafana (port 3000 on host) - No conflict!
```

## What Changed

The `docker-compose.yml` file has been updated to **remove** the port mapping for Next.js:

```yaml
# BEFORE (WRONG - conflicts with Grafana):
nextjs:
  ports:
    - "3000:3000"  # Exposes to host, conflicts!

# AFTER (CORRECT):
nextjs:
  # No ports section - only accessible via Docker network
  networks:
    - zodiak-network
```

## Why This Works

1. **Next.js** runs on port 3000 **inside** the Docker container
2. **Grafana** runs on port 3000 **on the host** machine
3. **Nginx** connects to Next.js via Docker's internal network (`nextjs:3000`)
4. **No conflict** because they're in different network namespaces!

## Apply the Fix

On your server:

```bash
cd ~/zodiak-deployment

# Stop containers
docker-compose down

# Update docker-compose.yml (remove port 3000 mapping if present)
# The file should NOT have:
#   ports:
#     - "3000:3000"
# under the nextjs service

# Restart
docker-compose up -d

# Verify
docker-compose ps
# Should show Next.js with NO port mapping
# Should show Nginx with 80:80 and 443:443
```

## Verify It Works

```bash
# Check Next.js is accessible via Nginx (not direct port)
curl http://localhost/health

# Check Grafana still works
curl http://localhost:3000/api/health
# (or however you access Grafana)

# Check containers
docker-compose ps
```

## Testing Next.js Directly (if needed)

If you need to test Next.js directly (for debugging), you can temporarily expose a different port:

```yaml
nextjs:
  ports:
    - "3001:3000"  # Use 3001 on host, 3000 in container
```

Then access via `http://localhost:3001`, but remember to remove this after testing!

## Summary

- ✅ Next.js: Port 3000 **inside container only** (via Docker network)
- ✅ Grafana: Port 3000 **on host** (no conflict!)
- ✅ Nginx: Ports 80/443 **on host** → proxies to Next.js via Docker network
- ✅ No port conflicts!
