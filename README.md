# ⚙️ IIoT Machine Monitoring Dashboard

A full-stack Industrial IoT machine monitoring dashboard built with **Node.js + Express + MongoDB** (backend) and **React + Redux Toolkit** (frontend).

> Built as part of a Full Stack Developer (Fresher) Machine Test.

---

## 🌐 Live Deployment

- **Frontend (Vercel):** https://iiot-machine.vercel.app
- **Backend API (Render):** https://iiot-machine-dashboard.onrender.com/api/machines
- **Database:** MongoDB Atlas

*(Note: Render's free tier may take ~30 seconds to wake up on the first request after inactivity.)*

---

## 📁 Project Structure

```
iiot-machine-dashboard/
├── backend/
│   ├── models/
│   │   └── Machine.js     # Mongoose schema
│   ├── db.js              # MongoDB connection
│   ├── seed.js            # Database seeder
│   ├── index.js           # Express server + API routes
│   ├── machines.json      # Seed data reference
│   ├── .env               # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── machinesSlice.js
│   │   └── components/
│   │       ├── Dashboard.jsx
│   │       ├── MachineCard.jsx
│   │       ├── MachineDetail.jsx
│   │       ├── StatusBadge.jsx
│   │       └── FilterBar.jsx
│   └── package.json
└── README.md
```

---

## 🚀 Setup & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally

---

### 1. Clone the repository
```bash
git clone https://github.com/aishasanaa/iiot-machine-dashboard.git
cd iiot-machine-dashboard
```

---

### 2. Start the Backend

Make sure **MongoDB is running** first:
```bash
# Windows — start MongoDB service
net start MongoDB
```

Then install, seed and start:
```bash
cd backend
npm install
npm run seed    # seeds the DB with 4 machines (run once)
node index.js
```

Backend runs on **http://localhost:5000**

> MongoDB URI is configured in `backend/.env` → defaults to `mongodb://localhost:27017/iiot-dashboard`

#### API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/machines` | Get all machines |
| GET | `/api/machines/:id` | Get one machine (404 if not found) |
| PATCH | `/api/machines/:id/status` | Update machine status |

---

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

> Vite proxies all `/api` requests to the backend on port 5000 automatically.

---

## ✨ Features

- 📊 **Dashboard** — card grid showing all machines with live status
- 🟢🟡🔴 **Color-coded status** — green (running), yellow (idle), red (fault)
- 🔍 **Search** — filter machines by name in real time
- 🏷️ **Status filter** — filter by All / Running / Idle / Fault
- 🖱️ **Detail modal** — click any card to see full machine details
- ✅ **Acknowledge Fault** — one-click to resolve a fault (calls PATCH API, updates UI optimistically)
- ⏳ **Loading & error states** — spinner on fetch, error message with retry button
- 🗄️ **MongoDB** — persistent storage with Mongoose ODM
- 📱 **Responsive** — works on mobile and desktop

---

## 🛠️ What I'd Improve With More Time

1. **Real-time updates** — Use WebSockets (Socket.io) so the dashboard auto-refreshes when sensor data changes without manual polling.
2. **Authentication** — Add JWT-based login so only authorized plant supervisors can acknowledge faults.
3. **Unit & integration tests** — Add Jest + React Testing Library for components/Redux thunks and Supertest for API endpoints.
4. **Charts & history** — Show temperature/vibration trend charts per machine using Recharts, with a time-series log of status changes.
5. **Alert thresholds & notifications** — Add configurable temperature/vibration thresholds that automatically trigger fault alerts and email/push notifications for supervisors.

