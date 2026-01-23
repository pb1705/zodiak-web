# Quick Fix for Current Issues

## Immediate Steps to Fix

### Step 1: Fix Nginx Config (On Your Server)

The Nginx container can't find the config file. Do this on your server:

```bash
cd ~/zodiak-deployment

# Ensure directories exist
mkdir -p nginx/conf.d nginx/ssl nginx/logs

# Create HTTP-only config for testing (copy this content)
cat > nginx/conf.d/default.conf << 'EOF'
upstream nextjs {
    server nextjs:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name _;

    location /health {
        access_log off;
        proxy_pass http://nextjs/api/health;
        add_header Content-Type application/json;
    }

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://nextjs;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    location /api {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Also ensure nginx.conf exists
cat > nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    include /etc/nginx/conf.d/*.conf;
}
EOF
```

### Step 2: Check Your Docker Image

The Next.js container is running in **development mode**, which means your Docker image wasn't built correctly.

**On your local machine**, rebuild the image:

```bash
# 1. Build the production build locally
npm run build

# 2. Verify build output exists
ls -la .next/standalone
ls -la .next/static

# 3. Build Docker image
docker build -t YOUR_USERNAME/zodiak-website:latest .

# 4. Test it locally first
docker run -p 3000:3000 YOUR_USERNAME/zodiak-website:latest
# Visit http://localhost:3000 - should work

# 5. Push to registry
docker push YOUR_USERNAME/zodiak-website:latest
```

### Step 3: Update and Restart (On Server)

```bash
cd ~/zodiak-deployment

# Pull the new image
docker-compose pull

# Restart everything
docker-compose down
docker-compose up -d

# Watch logs
docker-compose logs -f
```

### Step 4: Verify It Works

```bash
# Check containers are running
docker-compose ps

# Test Next.js directly
curl http://localhost:3000/api/health

# Test through Nginx
curl http://localhost/health

# Check your server IP
curl http://YOUR_SERVER_IP/health
```

## If Next.js Still Shows Dev Mode

Your Docker image needs to be rebuilt. The issue is that the image doesn't contain the production build.

**Check your Dockerfile** - it should:
1. Copy `.next/standalone` directory
2. Copy `.next/static` directory  
3. Run `node server.js` (not `next dev`)

The Dockerfile in the project expects you to run `npm run build` **locally first**, then build the Docker image.

## Alternative: Build in Docker

If you want to build inside Docker, you need a different Dockerfile. Let me know if you want that approach.
