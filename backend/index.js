require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Machine = require('./models/Machine');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── GET /api/machines — return all machines ───────────────────────────────────
app.get('/api/machines', async (req, res) => {
  try {
    const machines = await Machine.find();
    res.json(machines);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching machines.' });
  }
});

// ── GET /api/machines/:id — return one machine, 404 if not found ──────────────
app.get('/api/machines/:id', async (req, res) => {
  try {
    const machine = await Machine.findOne({ id: req.params.id });
    if (!machine) {
      return res
        .status(404)
        .json({ error: `Machine '${req.params.id}' not found.` });
    }
    res.json(machine);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching machine.' });
  }
});

// ── PATCH /api/machines/:id/status — update machine status ───────────────────
app.patch('/api/machines/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['running', 'idle', 'fault'];

  // Input validation
  if (!status) {
    return res
      .status(400)
      .json({ error: "Request body must include a 'status' field." });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}.`,
    });
  }

  try {
    const machine = await Machine.findOneAndUpdate(
      { id: req.params.id },
      { status, lastUpdated: new Date() },
      { new: true } // return updated document
    );

    if (!machine) {
      return res
        .status(404)
        .json({ error: `Machine '${req.params.id}' not found.` });
    }

    res.json(machine);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating machine status.' });
  }
});

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`IIoT Backend running on http://localhost:${PORT}`);
});
