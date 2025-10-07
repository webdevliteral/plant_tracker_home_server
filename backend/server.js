const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const multer = require('multer');
const fsSync = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fsSync.existsSync(UPLOAD_DIR)) {
  fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOAD_DIR));

// Multer storage: keep original extension, unique timestamped name
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(
        { plants: [], profiles: [], categories: [], taskAssignments: {} }, // ✅ include categories
        null,
        2
      )
    );
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
    // Ensure categories key always present (in case of older data.json)
    if (!data.categories) data.categories = [];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const current = await readData();
    // Shallow-merge top-level keys so missing keys are preserved
    const merged = {
      plants: current.plants || [],
      profiles: current.profiles || [],
      categories: current.categories || [],
      ...req.body, // only keys provided here overwrite current
    };
    await writeData(merged);
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

app.get('/api/profiles', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.profiles || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read profiles' });
  }
});

app.post('/api/profiles', async (req, res) => {
  try {
    const data = await readData();
    const newProfile = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    if (!data.profiles) {
      data.profiles = [];
    }
    data.profiles.push(newProfile);
    await writeData(data);
    res.json(newProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// ---------- CATEGORIES ROUTES ----------
app.get('/api/categories', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.categories || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const data = await readData();
    if (!data.categories) data.categories = [];
    const newCat = {
      id: Date.now(),
      name: req.body.name ?? 'Unnamed',
      wateringDays: Number(req.body.wateringDays ?? 3),
      feedingDays: Number(req.body.feedingDays ?? 7),
      color: req.body.color ?? '#5a8a5e',
      createdAt: new Date().toISOString()
    };
    data.categories.push(newCat);
    await writeData(data);
    res.json(newCat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const data = await readData();
    const id = parseInt(req.params.id, 10);
    const idx = (data.categories || []).findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    data.categories[idx] = { ...data.categories[idx], ...req.body };
    await writeData(data);
    res.json(data.categories[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const data = await readData();
    const id = parseInt(req.params.id, 10);
    data.categories = (data.categories || []).filter(c => c.id !== id);
    await writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Optional: bulk replace categories (handy for your modal Save)
// Accepts: [{id?, name, wateringDays, feedingDays, color}, ...]
app.put('/api/categories', async (req, res) => {
  try {
    const incoming = Array.isArray(req.body) ? req.body : [];
    const withIds = incoming.map(c => ({
      id: c.id ?? Date.now() + Math.floor(Math.random() * 1000),
      name: c.name ?? 'Unnamed',
      wateringDays: Number(c.wateringDays ?? 3),
      feedingDays: Number(c.feedingDays ?? 7),
      color: c.color ?? '#5a8a5e'
    }));
    const data = await readData();
    data.categories = withIds;
    await writeData(data);
    res.json(data.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to replace categories' });
  }
});

// ------------ TASK ROUTES ------------
app.get('/api/task-assignments', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.taskAssignments || {});
  } catch (e) {
    res.status(500).json({ error: 'Failed to read task assignments' });
  }
});

app.put('/api/task-assignments', async (req, res) => {
  try {
    const incoming = req.body && typeof req.body === 'object' ? req.body : {};
    const data = await readData();
    data.taskAssignments = { ...(data.taskAssignments || {}), ...incoming };
    await writeData(data);
    res.json(data.taskAssignments);
  } catch (e) {
    res.status(500).json({ error: 'Failed to save task assignments' });
  }
});

// --------- FILE IO ROUTES ------------

app.post('/api/upload', upload.array('photos', 10), async (req, res) => {
  try {
    const files = (req.files || []).map(f => ({
      filename: f.filename,
      url: `/uploads/${f.filename}`,
      mimetype: f.mimetype,
      size: f.size
    }));
    res.json({ files });
  } catch (e) {
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Start server
initDataFile().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 Plant Tracker API running on http://0.0.0.0:${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}`);
  });
});
