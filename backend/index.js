const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store seeded from machines.json
let machines = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'machines.json'), 'utf-8')
);

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/machines — return all machines
app.get('/api/machines', (req, res) => {
  res.json(machines);
});

// GET /api/machines/:id — return one machine, 404 if not found
app.get('/api/machines/:id', (req, res) => {
  const machine = machines.find((m) => m.id === req.params.id);
  if (!machine) {
    return res.status(404).json({ error: `Machine '${req.params.id}' not found.` });
  }
  res.json(machine);
});

// PATCH /api/machines/:id/status — update machine status
app.patch('/api/machines/:id/status', (req, res) => {
  const { status } = req.body;

  // Input validation
  const validStatuses = ['running', 'idle', 'fault'];
  if (!status) {
    return res.status(400).json({ error: "Request body must include a 'status' field." });
  }
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ error: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}.` });
  }

  const index = machines.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: `Machine '${req.params.id}' not found.` });
  }

  // Update status and timestamp
  machines[index] = {
    ...machines[index],
    status,
    lastUpdated: new Date().toISOString(),
  };

  res.json(machines[index]);
});

// ─── 404 catch-all ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Start server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`IIoT Backend running on http://localhost:${PORT}`);
});
