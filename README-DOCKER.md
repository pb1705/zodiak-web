# Docker Deployment Quick Reference

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .docker-compose.env.example .env
   # Edit .env with your settings
   ```

2. **Set up SSL certificates** (see `nginx/ssl/README.md`)

3. **Deploy:**
   ```bash
   # Option 1: Use the deployment script
   ./deploy.sh

   # Option 2: Use Make commands
   make deploy

   # Option 3: Manual deployment
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## Common Commands

### Using Makefile
```bash
make help        # Show all available commands
make build       # Build images
make up          # Start services
make down        # Stop services
make restart     # Restart services
make logs        # View all logs
make logs-nextjs # View Next.js logs
make logs-nginx  # View Nginx logs
make status      # Check container status
make health      # Check health endpoints
```

### Using Docker Compose Directly
```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## File Structure

```
.
├── Dockerfile                 # Next.js application Dockerfile
├── docker-compose.yml         # Base docker-compose config
├── docker-compose.prod.yml    # Production configuration
├── docker-compose.dev.yml     # Development configuration
├── .dockerignore             # Files to exclude from Docker build
├── .env                      # Environment variables (create from .docker-compose.env.example)
├── deploy.sh                 # Automated deployment script
├── Makefile                  # Convenience commands
├── nginx/
│   ├── nginx.conf            # Main Nginx configuration
│   ├── conf.d/
│   │   └── default.conf      # Server configuration
│   ├── ssl/                  # SSL certificates directory
│   └── logs/                 # Nginx logs directory
└── DEPLOYMENT.md             # Full deployment guide
```

## Environment Variables

Create a `.env` file with:

```env
NEXT_PUBLIC_BASE_URL=https://zodiak.life
```

## SSL Certificates

Place your SSL certificates in `nginx/ssl/`:
- `cert.pem` - Certificate file
- `key.pem` - Private key file

See `nginx/ssl/README.md` for detailed instructions.

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check if ports are in use
sudo lsof -i :80
sudo lsof -i :443
```

### Rebuild from scratch
```bash
docker-compose -f docker-compose.prod.yml down -v
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build
```

### View container logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f nextjs
docker-compose -f docker-compose.prod.yml logs -f nginx
```

## Production Checklist

- [ ] Domain DNS configured
- [ ] SSL certificates installed
- [ ] Environment variables configured
- [ ] Firewall rules set (ports 80, 443)
- [ ] Health checks passing
- [ ] Logs accessible
- [ ] Backup strategy in place
- [ ] SSL renewal automated (cron job)

For detailed deployment instructions, see `DEPLOYMENT.md`.
