const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = './data.json';
const ANALYTICS_FILE = './analytics.json';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function loadAnalytics() {
  if (!fs.existsSync(ANALYTICS_FILE)) return [];
  return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
}

// Middleware admin autentifikatsiya
app.use((req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) return res.status(403).json({ error: 'Forbidden' });
  next();
});

// API: data ko'rish
app.get('/api/data', (req, res) => res.json(loadData()));
// API: data yangilash
app.post('/api/data', (req, res) => {
  saveData(req.body);
  res.json({ success: true });
});
// API: analytics ko'rish
app.get('/api/analytics', (req, res) => res.json(loadAnalytics()));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Admin panel ishlayapti: http://localhost:${PORT}`));
