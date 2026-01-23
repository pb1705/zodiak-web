# Troubleshooting Deployment Issues

## Issue 1: Next.js Running in Development Mode

**Symptoms:**
- Logs show: `Next.js 15.5.9` with "Local: http://localhost:3000"
- Application not accessible

**Cause:**
The Docker image was built incorrectly or is missing the production build files.

**Solution:**

### Option A: Rebuild the Image Correctly (Recommended)

1. **On your local machine**, ensure you have the production build:

```bash
# In the project directory
npm run build
```

2. **Verify the build output exists:**
```bash
ls -la .next/standalone
ls -la .next/static
```

3. **Build the Docker image:**
```bash
docker build -t YOUR_USERNAME/zodiak-website:latest .
```

4. **Push to registry:**
```bash
docker push YOUR_USERNAME/zodiak-website:latest
```

5. **On your server, pull the new image:**
```bash
docker-compose pull
docker-compose up -d
```

### Option B: Check the Dockerfile

The Dockerfile expects:
- `.next/standalone/` directory (from `npm run build`)
- `.next/static/` directory (from `npm run build`)

If these don't exist, the image won't work correctly.

## Issue 2: Nginx Config File Not Found

**Symptoms:**
- Error: `/etc/nginx/conf.d/default.conf is not a file or does not exist`
- Nginx container starts but doesn't serve content

**Solution:**

1. **On your server**, verify the file structure:
```bash
cd ~/zodiak-deployment
ls -la nginx/conf.d/
```

2. **If the file doesn't exist**, copy it from your local project:
```bash
# From your local machine, copy the nginx configs:
scp -r nginx/ user@your-server:~/zodiak-deployment/
```

3. **Or create the directories and files manually on the server:**
```bash
mkdir -p ~/zodiak-deployment/nginx/conf.d
mkdir -p ~/zodiak-deployment/nginx/ssl
mkdir -p ~/zodiak-deployment/nginx/logs
```

4. **For testing without SSL**, use the HTTP-only config:
```bash
# Rename or copy the HTTP config
cp nginx/conf.d/default-http.conf nginx/conf.d/default.conf
```

5. **Restart Nginx:**
```bash
docker-compose restart nginx
```

## Issue 3: SSL Certificates Missing

**Symptoms:**
- Nginx starts but HTTPS doesn't work
- SSL errors in logs

**Solution:**

### For Testing (HTTP Only):

1. **Use the HTTP-only config:**
```bash
# On server
cd ~/zodiak-deployment
cp nginx/conf.d/default-http.conf nginx/conf.d/default.conf
docker-compose restart nginx
```

2. **Access via HTTP:**
```
http://YOUR_SERVER_IP
```

### For Production (HTTPS):

1. **Install Certbot:**
```bash
sudo apt update
sudo apt install certbot -y
```

2. **Stop Nginx temporarily:**
```bash
docker-compose stop nginx
```

3. **Get Let's Encrypt certificate:**
```bash
sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life
```

4. **Copy certificates:**
```bash
sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem ~/zodiak-deployment/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem ~/zodiak-deployment/nginx/ssl/key.pem
sudo chmod 644 ~/zodiak-deployment/nginx/ssl/cert.pem
sudo chmod 600 ~/zodiak-deployment/nginx/ssl/key.pem
```

5. **Use the HTTPS config:**
```bash
# Copy the HTTPS config (from your local project)
cp nginx/conf.d/default.conf ~/zodiak-deployment/nginx/conf.d/default.conf
```

6. **Start services:**
```bash
docker-compose up -d
```

## Issue 4: Can't Access Website

**Quick Diagnostic Steps:**

1. **Check if containers are running:**
```bash
docker-compose ps
```

2. **Check Next.js logs:**
```bash
docker-compose logs nextjs
```

3. **Check Nginx logs:**
```bash
docker-compose logs nginx
```

4. **Test Next.js directly:**
```bash
# From inside the server
curl http://localhost:3000/api/health
# Or from outside (if firewall allows)
curl http://YOUR_SERVER_IP:3000/api/health
```

5. **Test Nginx:**
```bash
curl http://YOUR_SERVER_IP/health
```

6. **Check Nginx config syntax:**
```bash
docker-compose exec nginx nginx -t
```

7. **Check port bindings:**
```bash
sudo netstat -tlnp | grep -E ':(80|443|3000)'
# Or
sudo ss -tlnp | grep -E ':(80|443|3000)'
```

8. **Check firewall:**
```bash
sudo ufw status
# If needed, allow ports:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Issue 5: Docker Image Build Problems

**If the image doesn't work:**

1. **Verify local build works:**
```bash
npm run build
npm start  # Should work locally
```

2. **Check Dockerfile:**
```bash
cat Dockerfile
# Ensure it copies .next/standalone and .next/static
```

3. **Build with verbose output:**
```bash
docker build --no-cache -t zodiak-website:test .
```

4. **Test the image locally:**
```bash
docker run -p 3000:3000 zodiak-website:test
# Then visit http://localhost:3000
```

## Quick Fix: Start Fresh

If nothing works, start fresh:

```bash
# On server
cd ~/zodiak-deployment

# Stop everything
docker-compose down -v

# Remove old images
docker rmi YOUR_USERNAME/zodiak-website:latest 2>/dev/null || true

# Ensure configs exist
mkdir -p nginx/conf.d nginx/ssl nginx/logs

# Copy HTTP config for testing
# (Copy default-http.conf content to nginx/conf.d/default.conf)

# Pull fresh image
docker-compose pull

# Start
docker-compose up -d

# Watch logs
docker-compose logs -f
```

## Common Commands

```bash
# View logs
docker-compose logs -f
docker-compose logs nextjs
docker-compose logs nginx

# Restart services
docker-compose restart
docker-compose restart nginx
docker-compose restart nextjs

# Rebuild and restart
docker-compose pull
docker-compose up -d --force-recreate

# Check container status
docker-compose ps

# Execute commands in container
docker-compose exec nextjs sh
docker-compose exec nginx sh

# Test Nginx config
docker-compose exec nginx nginx -t

# Reload Nginx config
docker-compose exec nginx nginx -s reload
```
