# Vue 3 + Vite
# TaskForge - Frontend Complete Implementation Summary

## 📋 Project Overview

TaskForge is a full-stack task management application built with Laravel (backend) and Vue.js (frontend), featuring:

## 🚀 Quick Start Guide
 
### Prerequisites
```bash
# Required
- Node.js 22+
- npm or yarn
```

### Fronted Setup & Installation (5 minutes)

```bash
# 1. Clone & Install
git clone https://github.com/VikasJakasaniya/taskforge-frontend.git
cd taskforge-frontend

# 2. Environment
cp .env.example .env

# 2.2 Configure `.env`:
VITE_API_URL=http://localhost:8000
VITE_WS_HOST=localhost
VITE_WS_PORT=8080
VITE_WS_KEY=local-key
VITE_WS_FORCE_TLS=false

# 3. Install dependencies and Run
npm install
npm run dev
```

### Access Points
- Fronted Access: http://localhost:5173

## 💡 Frontend Usage Example Flow

1. **User Registration/Login**:
   ```
   User → Enter email → Receive OTP → Enter OTP → Dashboard
   ```

2. **Create Task**:
   ```
   Dashboard → Click "New Task" → Fill form → Submit → See in list
   ```

3. **Filter Tasks**:
   ```
   Task List → Select filters → Results update automatically
   ```

4. **Import Tasks**:
   ```
   Go to Imports → Upload CSV → Watch progress bar update live
   ```

5. **Real-time Experience**:
   ```
   Upload CSV → Jobs process in background → Progress updates without refresh
   → Completion toast notification
   ```
