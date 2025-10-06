const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ plants: [], caretakers: [] }, null, 2));
  }
}

// Read data
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write data
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    await writeData(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/api/plants', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.plants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read plants' });
  }
});

app.post('/api/plants', async (req, res) => {
  try {
    const data = await readData();
    const newPlant = {
      id: Date.now(),
      ...req.body,
      activities: [],
      createdAt: new Date().toISOString()
    };
    data.plants.push(newPlant);
    await writeData(data);
    res.json(newPlant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plant' });
  }
});

app.post('/api/plants/:id/activities', async (req, res) => {
  try {
    const data = await readData();
    const plantIndex = data.plants.findIndex(p => p.id === parseInt(req.params.id));
    
    if (plantIndex === -1) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    const newActivity = {
      id: Date.now(),
      ...req.body,
      timestamp: new Date().toISOString()
    };

    data.plants[plantIndex].activities.unshift(newActivity);
    await writeData(data);
    res.json(newActivity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

app.delete('/api/plants/:id', async (req, res) => {
  try {
    const data = await readData();
    data.plants = data.plants.filter(p => p.id !== parseInt(req.params.id));
    await writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plant' });
  }
});

// Start server
initDataFile().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 Plant Tracker API running on http://0.0.0.0:${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}`);
  });
});