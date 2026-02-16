# TechStore India - Production Deployment Guide

Complete guide for deploying TechStore backend on Ubuntu server.

## 🚀 Quick Deployment

### Step 1: Setup Weaviate Database

```bash
cd deployment
chmod +x setup_weaviate.sh
./setup_weaviate.sh
```

This will:
- Install Docker and Docker Compose (if not present)
- Download and start Weaviate database on port 8080
- Configure text vectorization module
- Set up persistent storage

**Verify Weaviate is running:**
```bash
curl http://localhost:8080/v1/.well-known/ready
```

### Step 2: Deploy Backend

```bash
chmod +x deploy_backend.sh
./deploy_backend.sh
```

This will:
- Install Python 3.11 and dependencies
- Create dedicated application user
- Set up virtual environment
- Install backend application
- Configure systemd service
- Start backend on port 8000 (4 workers for ~10 concurrent users)
- Populate sample data automatically

**Verify backend is running:**
```bash
curl http://localhost:8000/health
```

## 📊 Access Your Application

- **Backend API:** http://YOUR_SERVER_IP:8000
- **API Documentation:** http://YOUR_SERVER_IP:8000/docs
- **Weaviate Dashboard:** http://YOUR_SERVER_IP:8080

## 🔧 Service Management

### Backend Service

```bash
# Check status
sudo systemctl status techstore-backend

# View real-time logs
sudo journalctl -u techstore-backend -f

# Restart service
sudo systemctl restart techstore-backend

# Stop service
sudo systemctl stop techstore-backend
```

### Weaviate Database

```bash
# Check status
docker-compose -f /opt/weaviate/docker-compose.yml ps

# View logs
docker-compose -f /opt/weaviate/docker-compose.yml logs -f

# Restart Weaviate
docker-compose -f /opt/weaviate/docker-compose.yml restart
```

## 🔥 Firewall Configuration

```bash
# Allow backend port
sudo ufw allow 8000/tcp

# Allow Weaviate port (if accessing externally)
sudo ufw allow 8080/tcp
```

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check service status
sudo systemctl status techstore-backend

# Check logs
sudo journalctl -u techstore-backend -n 100
```

### Weaviate Issues

```bash
# Check container status
docker ps

# View logs
docker logs weaviate
```

## 📦 System Requirements

- **OS:** Ubuntu 20.04 LTS or newer
- **RAM:** 4GB minimum (8GB recommended)
- **CPU:** 2 cores minimum
- **Disk:** 20GB minimum
- **Python:** 3.11+
- **Docker:** Latest stable version
