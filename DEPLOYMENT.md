# Deployment Guide 🚀

This guide covers various deployment options for the Zerodha Trading Bot.

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [Traditional Server Deployment](#traditional-server-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Security Considerations](#security-considerations)

## Docker Deployment 🐳

The easiest way to deploy is using Docker Compose.

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

1. **Build and start containers:**
```bash
docker-compose up -d
```

2. **Check logs:**
```bash
docker-compose logs -f
```

3. **Stop containers:**
```bash
docker-compose down
```

### Production Docker Compose

For production, create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - tokens_data:/app
    restart: always
    networks:
      - tradingbot

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    volumes:
      - ./ssl:/etc/nginx/ssl
    restart: always
    networks:
      - tradingbot

volumes:
  tokens_data:

networks:
  tradingbot:
    driver: bridge
```

Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Traditional Server Deployment 🖥️

### Backend Deployment

1. **Install Python and dependencies:**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv nginx
```

2. **Set up the application:**
```bash
cd /opt
sudo git clone <your-repo> zerodha-bot
cd zerodha-bot/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn
```

3. **Create systemd service** (`/etc/systemd/system/zerodha-bot.service`):
```ini
[Unit]
Description=Zerodha Trading Bot Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/zerodha-bot/backend
Environment="PATH=/opt/zerodha-bot/backend/venv/bin"
ExecStart=/opt/zerodha-bot/backend/venv/bin/gunicorn --workers 4 --bind 127.0.0.1:5000 wsgi:app

[Install]
WantedBy=multi-user.target
```

4. **Start the service:**
```bash
sudo systemctl daemon-reload
sudo systemctl start zerodha-bot
sudo systemctl enable zerodha-bot
```

### Frontend Deployment

1. **Build the frontend:**
```bash
cd /opt/zerodha-bot/frontend
npm install
npm run build
```

2. **Configure Nginx** (`/etc/nginx/sites-available/zerodha-bot`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    root /opt/zerodha-bot/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/zerodha-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Set up SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Cloud Deployment ☁️

### AWS Deployment

#### Using EC2

1. **Launch EC2 instance:**
   - Ubuntu 22.04 LTS
   - t2.small or larger
   - Open ports: 22, 80, 443

2. **Follow traditional server deployment steps**

3. **Set up auto-scaling (optional):**
   - Create AMI from your configured instance
   - Set up Auto Scaling Group
   - Configure Load Balancer

#### Using ECS (Docker)

1. **Push images to ECR:**
```bash
aws ecr create-repository --repository-name zerodha-bot-backend
aws ecr create-repository --repository-name zerodha-bot-frontend

# Tag and push
docker tag zerodha-bot-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/zerodha-bot-backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/zerodha-bot-backend:latest
```

2. **Create ECS task definition and service**

3. **Set up Application Load Balancer**

### Google Cloud Platform

#### Using Cloud Run

1. **Build and push to Container Registry:**
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/zerodha-bot-backend ./backend
gcloud builds submit --tag gcr.io/PROJECT-ID/zerodha-bot-frontend ./frontend
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy zerodha-bot-backend --image gcr.io/PROJECT-ID/zerodha-bot-backend --platform managed
gcloud run deploy zerodha-bot-frontend --image gcr.io/PROJECT-ID/zerodha-bot-frontend --platform managed
```

### Heroku

1. **Backend deployment:**
```bash
cd backend
heroku create zerodha-bot-backend
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

2. **Frontend deployment:**
```bash
cd frontend
heroku create zerodha-bot-frontend
# Add buildpack
heroku buildpacks:set heroku/nodejs
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### DigitalOcean App Platform

1. **Connect your GitHub repository**
2. **Configure build settings:**
   - Backend: Python, auto-detect
   - Frontend: Node.js, build command: `npm run build`
3. **Set environment variables**
4. **Deploy**

## Security Considerations 🔒

### Essential Security Measures

1. **Environment Variables:**
```bash
# Never hardcode credentials
export ZERODHA_API_KEY=your_key
export ZERODHA_API_SECRET=your_secret
export SECRET_KEY=random_secret_key
```

2. **HTTPS Only:**
   - Always use SSL/TLS in production
   - Redirect HTTP to HTTPS
   - Use HSTS headers

3. **Firewall Configuration:**
```bash
# UFW example
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

4. **Rate Limiting:**
   - Implement rate limiting on API endpoints
   - Use services like Cloudflare

5. **Token Security:**
   - Encrypt tokens at rest
   - Use secure session management
   - Implement token rotation

6. **Regular Updates:**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Python packages
pip list --outdated
pip install --upgrade <package>

# Update Node packages
npm outdated
npm update
```

### Security Headers

Add to Nginx configuration:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Monitoring & Logging 📊

### Set up logging

1. **Backend logging:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

2. **Use monitoring tools:**
   - Sentry for error tracking
   - New Relic or DataDog for APM
   - CloudWatch (AWS) or Stackdriver (GCP)

3. **Set up alerts:**
   - Server down alerts
   - High error rate alerts
   - Unusual trading activity alerts

## Backup Strategy 💾

1. **Tokens backup:**
```bash
# Cron job for daily backup
0 2 * * * cp /opt/zerodha-bot/backend/tokens.json /backup/tokens-$(date +\%Y\%m\%d).json
```

2. **Database backup** (if you add a database later)

3. **Configuration backup**

## Performance Optimization ⚡

1. **Enable caching:**
   - Redis for session storage
   - CDN for static assets

2. **Optimize database queries** (if using a database)

3. **Use connection pooling**

4. **Enable compression:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

## Troubleshooting 🔧

### Common Issues

1. **502 Bad Gateway:**
   - Check if backend service is running
   - Check gunicorn logs
   - Verify proxy_pass URL

2. **CORS errors:**
   - Check CORS configuration in backend
   - Verify allowed origins

3. **Token expiration:**
   - Implement automatic token refresh
   - Add notification for manual re-login

### Logs Location

- **Nginx:** `/var/log/nginx/`
- **Systemd service:** `sudo journalctl -u zerodha-bot -f`
- **Application:** Check `app.log` in backend directory

---

## Maintenance Checklist ✅

Weekly:
- [ ] Check server resources (CPU, Memory, Disk)
- [ ] Review application logs
- [ ] Test trading functionality

Monthly:
- [ ] Update dependencies
- [ ] Review security patches
- [ ] Backup verification
- [ ] Performance analysis

Quarterly:
- [ ] Security audit
- [ ] Disaster recovery test
- [ ] Review and optimize infrastructure costs

---

Need help? Check the main [README.md](README.md) or create an issue on GitHub.
