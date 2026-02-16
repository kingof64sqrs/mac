# Quick Start Guide

## Starting the E-Commerce Platform

### Prerequisites
1. Weaviate database running on `localhost:8080`
2. Python backend dependencies installed
3. Frontend dependencies installed

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd /home/developer/J2W/personal/mac
source .venv/bin/activate
python main.py
```

The backend API will start on `http://localhost:7999`

### Step 2: Start the Frontend

Open a **new terminal** and run:

```bash
cd /home/developer/J2W/personal/mac/admin_frontend
npm run dev
```

The admin dashboard will be available at `http://localhost:3000`

### Step 3: Access the Admin Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

You'll see the admin dashboard with the following sections:
- Dashboard - Overview and statistics
- Site Config - Company settings
- Sections - Manage sections
- Categories - Manage categories  
- Products - Manage products with search
- Orders - View and manage orders

## Quick Commands

### Backend
```bash
# Start backend
cd /home/developer/J2W/personal/mac
source .venv/bin/activate
python main.py

# Initialize database (if needed)
python scripts/init_db.py

# Seed sample data (if needed)
python scripts/seed_data.py

# Run tests
python scripts/test_api.py
```

### Frontend
```bash
# Install dependencies (first time only)
cd admin_frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Ports
- **Weaviate**: `8080`
- **Backend API**: `7999`
- **Frontend Dev Server**: `3000`

## Testing the Setup

1. **Check Backend Health**:
   ```bash
   curl http://localhost:7999/api/v1/health
   ```
   Should return: `{"status":"healthy","version":"1.0.0","weaviate_connected":true}`

2. **Access Frontend**:
   Open `http://localhost:3000` in your browser

3. **Test CRUD Operations**:
   - Go to Sections and create a new section
   - Go to Categories and create a category
   - Go to Products and create a product
   - Go to Orders and create an order

## Troubleshooting

### Backend Issues
- **Error: Weaviate connection failed**
  - Make sure Weaviate is running on port 8080
  - Check with: `curl http://localhost:8080/v1/meta`

- **Error: Port 7999 already in use**
  - Find and kill the process: `lsof -ti:7999 | xargs kill -9`

### Frontend Issues
- **Error: Cannot connect to backend**
  - Ensure backend is running on port 7999
  - Check browser console for CORS errors

- **Error: Port 3000 already in use**
  - Kill the process: `lsof -ti:3000 | xargs kill -9`
  - Or use a different port: `npm run dev -- --port 3001`

## Development Workflow

1. Make changes to backend code → Server auto-reloads
2. Make changes to frontend code → Hot module replacement (instant updates)
3. Test API endpoints → Use the test script or CURL commands
4. Test UI → Use the admin dashboard at localhost:3000

## Production Deployment

### Backend
```bash
# Use a production ASGI server
uvicorn app.main:app --host 0.0.0.0 --port 7999 --workers 4
```

### Frontend
```bash
# Build
npm run build

# Serve with nginx or any static file server
# The build output is in admin_frontend/dist/
```

Enjoy your E-Commerce Admin Dashboard! 🚀
