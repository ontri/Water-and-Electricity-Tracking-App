const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const readings = [];

const SECRET_KEY = 'your_secret_key_here';

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, username });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Save readings endpoint
app.post('/api/readings', authenticateToken, (req, res) => {
  const { prevWater, currWater, prevElectricity, currElectricity } = req.body;
  if (
    prevWater == null || currWater == null ||
    prevElectricity == null || currElectricity == null
  ) {
    return res.status(400).json({ message: 'All readings are required' });
  }
  const waterUsage = currWater - prevWater;
  const electricityUsage = currElectricity - prevElectricity;
  if (waterUsage < 0 || electricityUsage < 0) {
    return res.status(400).json({ message: 'Current readings must be greater than previous readings' });
  }
  const record = {
    username: req.user.username,
    prevWater,
    currWater,
    prevElectricity,
    currElectricity,
    waterUsage,
    electricityUsage,
    timestamp: new Date()
  };
  readings.push(record);
  res.status(201).json({ message: 'Readings saved', record });
});

// Get readings endpoint
app.get('/api/readings', authenticateToken, (req, res) => {
  const userReadings = readings.filter(r => r.username === req.user.username);
  res.json(userReadings);
});

app.get('/', (req, res) => res.send('Backend Running...'));
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
