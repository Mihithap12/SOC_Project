const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8092;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_db';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB in NGO Service');
      seedDatabase();
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

// Schemas & Models
const TrainingSchema = new mongoose.Schema({
  title: String,
  trainer: String,
  date: String,
  location: String,
  maxAttendees: Number,
  registeredCount: { type: Number, default: 0 },
  description: String
});

const AdvisorySchema = new mongoose.Schema({
  title: String,
  author: String,
  topic: String,
  content: String,
  datePublished: String
});

const AssistanceSchema = new mongoose.Schema({
  farmerId: Number,
  farmerName: String,
  requestDetails: String,
  status: { type: String, default: 'PENDING' }, // PENDING, APPROVED, COMPLETED
  requestDate: String
});

const Training = mongoose.model('Training', TrainingSchema);
const Advisory = mongoose.model('Advisory', AdvisorySchema);
const Assistance = mongoose.model('Assistance', AssistanceSchema);

// API Routes
app.get('/api/training', async (req, res) => {
  try {
    const workshops = await Training.find();
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/training', async (req, res) => {
  try {
    const workshop = new Training(req.body);
    await workshop.save();
    res.status(201).json(workshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/training/:id/register', async (req, res) => {
  try {
    const workshop = await Training.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'Training program not found' });
    }
    if (workshop.registeredCount >= workshop.maxAttendees) {
      return res.status(400).json({ error: 'Training program is full' });
    }
    workshop.registeredCount += 1;
    await workshop.save();
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/advisories', async (req, res) => {
  try {
    const articles = await Advisory.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/advisories', async (req, res) => {
  try {
    const article = new Advisory(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/assistance', async (req, res) => {
  try {
    const requests = await Assistance.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/assistance/farmer/:farmerId', async (req, res) => {
  try {
    const requests = await Assistance.find({ farmerId: req.params.farmerId });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assistance', async (req, res) => {
  try {
    const request = new Assistance({
      ...req.body,
      requestDate: new Date().toISOString().split('T')[0]
    });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/assistance/:id/status', async (req, res) => {
  try {
    const request = await Assistance.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed data
async function seedDatabase() {
  const trainingCount = await Training.countDocuments();
  if (trainingCount === 0) {
    await Training.create([
      { title: 'Organic Fertilization & Soil Health', trainer: 'Dr. Keerthi Perera', date: '2026-06-25', location: 'Kandy Town Hall', maxAttendees: 40, registeredCount: 15, description: 'Learn how to blend organic compost and compost tea to enrich your smallholding soil.' },
      { title: 'Modern Harvesting Techniques', trainer: 'Eng. Samantha Silva', date: '2026-07-02', location: 'Ella Community Center', maxAttendees: 30, registeredCount: 8, description: 'Maximize yield and protect crop quality during tea leaf plucking.' }
    ]);
    await Advisory.create([
      { title: 'Managing Monsoonal Runoff', author: 'S. Jayasekara (Agri Advisor)', topic: 'Irrigation', content: 'During heavy monsoons, maintain deep lateral drains (1.5ft deep) across tea terraces. This keeps soil intact and prevents root rot.', datePublished: '2026-06-10' },
      { title: 'Organic Weed Management', author: 'M. Fernando (Soil Scientist)', topic: 'Weeding', content: 'Avoid scraping weeds completely. Instead, slash them to ground level. This retains organic matter and prevents topsoil erosion.', datePublished: '2026-06-11' }
    ]);
    console.log('NGO database seeded successfully');
  }
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`NGO Service running on port ${PORT}`);
  });
}

module.exports = app;
