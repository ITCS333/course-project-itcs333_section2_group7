const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Serve static files from project root
app.use(express.static(path.join(__dirname)));

const DATA_DIR = path.join(__dirname, 'src', 'resources', 'api');
const RES_FILE = path.join(DATA_DIR, 'resources.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

async function readJSON(file) {
  const txt = await fs.readFile(file, 'utf8');
  return JSON.parse(txt || '{}');
}

async function writeJSON(file, data) {
  const txt = JSON.stringify(data, null, 2);
  await fs.writeFile(file, txt, 'utf8');
}

// Resources endpoints
app.get('/api/resources', async (req, res) => {
  try {
    const arr = await readJSON(RES_FILE);
    res.json(arr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read resources' });
  }
});

app.post('/api/resources', async (req, res) => {
  try {
    const { title, description = '', link } = req.body;
    if (!title || !link) return res.status(400).json({ error: 'title and link required' });
    const resources = await readJSON(RES_FILE);
    const id = `res_${Date.now()}`;
    const newRes = { id, title, description, link };
    resources.push(newRes);
    await writeJSON(RES_FILE, resources);
    res.status(201).json(newRes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add resource' });
  }
});

app.put('/api/resources/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description = '', link } = req.body;
    const resources = await readJSON(RES_FILE);
    const idx = resources.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Resource not found' });
    resources[idx] = { ...resources[idx], title, description, link };
    await writeJSON(RES_FILE, resources);
    res.json(resources[idx]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

app.delete('/api/resources/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let resources = await readJSON(RES_FILE);
    const before = resources.length;
    resources = resources.filter(r => r.id !== id);
    if (resources.length === before) return res.status(404).json({ error: 'Not found' });
    await writeJSON(RES_FILE, resources);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// Comments endpoints
app.get('/api/comments', async (req, res) => {
  try {
    const obj = await readJSON(COMMENTS_FILE);
    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read comments' });
  }
});

app.post('/api/comments/:resourceId', async (req, res) => {
  try {
    const resourceId = req.params.resourceId;
    const { author = 'Student', text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const obj = await readJSON(COMMENTS_FILE);
    if (!obj[resourceId]) obj[resourceId] = [];
    const comment = { author, text };
    obj[resourceId].push(comment);
    await writeJSON(COMMENTS_FILE, obj);
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
