# SSL Certificates

Place your SSL certificates here:

- `cert.pem` - Your SSL certificate file
- `key.pem` - Your SSL private key file

## Using Let's Encrypt (Recommended)

For production, use Let's Encrypt certificates with certbot:

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life

# Copy certificates to this directory
sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem
```

## Development/Testing

For development, you can generate self-signed certificates:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=zodiak.life"
```

**Note:** Self-signed certificates will show security warnings in browsers.
