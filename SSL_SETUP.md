# SSL/TLS Setup Guide - Fix "Not Secure" Warning

## Quick Setup (Automated)

Copy `setup-ssl.sh` to your server and run:

```bash
# On your server
cd ~/zodiak-deployment
# Copy setup-ssl.sh from your local machine, then:
chmod +x setup-ssl.sh
./setup-ssl.sh
```

## Manual Setup Steps

### Prerequisites

1. **Domain DNS pointing to your server** (e.g., `zodiak.life` → your server IP)
2. **Port 80 accessible** from the internet (for Let's Encrypt validation)
3. **Port 443 accessible** (for HTTPS)

### Step 1: Install Certbot

```bash
sudo apt update
sudo apt install -y certbot
```

### Step 2: Stop Nginx Temporarily

```bash
cd ~/zodiak-deployment
docker-compose stop nginx
```

### Step 3: Get SSL Certificate

```bash
# Replace zodiak.life with your domain
sudo certbot certonly --standalone \
    -d zodiak.life \
    -d www.zodiak.life \
    --non-interactive \
    --agree-tos \
    --email your-email@example.com
```

### Step 4: Copy Certificates

```bash
mkdir -p ~/zodiak-deployment/nginx/ssl

sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem ~/zodiak-deployment/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem ~/zodiak-deployment/nginx/ssl/key.pem

sudo chmod 644 ~/zodiak-deployment/nginx/ssl/cert.pem
sudo chmod 600 ~/zodiak-deployment/nginx/ssl/key.pem
sudo chown $USER:$USER ~/zodiak-deployment/nginx/ssl/*.pem
```

### Step 5: Update Nginx Config

Your `nginx/conf.d/default.conf` should already have HTTPS configuration. Just make sure:

1. SSL certificate paths are correct:
   ```nginx
   ssl_certificate /etc/nginx/ssl/cert.pem;
   ssl_certificate_key /etc/nginx/ssl/key.pem;
   ```

2. Server name matches your domain:
   ```nginx
   server_name zodiak.life www.zodiak.life;
   ```

### Step 6: Start Nginx

```bash
docker-compose up -d nginx
```

### Step 7: Test HTTPS

```bash
curl -I https://zodiak.life
```

Should return `200 OK` or `301/302` redirect.

## Verify SSL

Visit in browser:
- ✅ `https://zodiak.life` - Should show 🔒 padlock
- ❌ `http://zodiak.life` - Should redirect to HTTPS

## Auto-Renewal Setup

Certificates expire every 90 days. Set up auto-renewal:

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Add to crontab (runs twice daily)
sudo crontab -e
# Add this line:
0 0,12 * * * certbot renew --quiet && cd ~/zodiak-deployment && docker-compose restart nginx
```

Or use the renewal script from `setup-ssl.sh`.

## Troubleshooting

### "Connection refused" on HTTPS

- Check Nginx logs: `docker-compose logs nginx`
- Verify certificates exist: `ls -la ~/zodiak-deployment/nginx/ssl/`
- Check port 443 is open: `sudo ufw allow 443/tcp`

### "Certificate not found"

- Verify certificate paths in Nginx config
- Check certificates exist: `ls -la /etc/letsencrypt/live/zodiak.life/`
- Ensure files are copied to `nginx/ssl/` directory

### "Domain validation failed"

- Ensure DNS points to your server: `dig zodiak.life`
- Ensure port 80 is accessible: `curl http://your-server-ip`
- Check firewall: `sudo ufw status`

### Still showing "Not Secure"

- Clear browser cache
- Try incognito/private mode
- Check you're accessing `https://` not `http://`
- Verify SSL config: `docker-compose exec nginx nginx -t`

## Current Status

Your `nginx/conf.d/default.conf` already has HTTPS configuration, you just need to:
1. Get the SSL certificates (Step 3-4 above)
2. Ensure they're in the right place
3. Restart Nginx

## Quick Check

```bash
# Check if certificates exist
ls -la ~/zodiak-deployment/nginx/ssl/

# Check Nginx config
docker-compose exec nginx nginx -t

# Check if HTTPS works
curl -I https://zodiak.life
```
