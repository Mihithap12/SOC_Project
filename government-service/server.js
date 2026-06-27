const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8091;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/govt_db';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB in Government Service');
      seedDatabase();
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

// Schemas & Models
const SubsidySchema = new mongoose.Schema({
  title: String,
  amount: Number,
  eligibilityCriteria: String,
  description: String,
  category: String
});

const GrantSchema = new mongoose.Schema({
  title: String,
  totalFund: Number,
  status: String, // ACTIVE, CLOSED
  deadline: String,
  description: String
});

const DiseaseAlertSchema = new mongoose.Schema({
  crop: String,
  diseaseName: String,
  region: String,
  severity: String, // LOW, MEDIUM, CRITICAL
  description: String,
  alertDate: String
});

const RegulationSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  effectiveDate: String
});

const Subsidy = mongoose.model('Subsidy', SubsidySchema);
const Grant = mongoose.model('Grant', GrantSchema);
const DiseaseAlert = mongoose.model('DiseaseAlert', DiseaseAlertSchema);
const Regulation = mongoose.model('Regulation', RegulationSchema);

// API Routes
app.get('/api/subsidies', async (req, res) => {
  try {
    const subsidies = await Subsidy.find();
    res.json(subsidies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subsidies', async (req, res) => {
  try {
    const subsidy = new Subsidy(req.body);
    await subsidy.save();
    res.status(201).json(subsidy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/grants', async (req, res) => {
  try {
    const grants = await Grant.find();
    res.json(grants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/grants', async (req, res) => {
  try {
    const grant = new Grant(req.body);
    await grant.save();
    res.status(201).json(grant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await DiseaseAlert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    const alert = new DiseaseAlert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/regulations', async (req, res) => {
  try {
    const regulations = await Regulation.find();
    res.json(regulations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/regulations', async (req, res) => {
  try {
    const reg = new Regulation(req.body);
    await reg.save();
    res.status(201).json(reg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Seed data
async function seedDatabase() {
  const subsidyCount = await Subsidy.countDocuments();
  if (subsidyCount === 0) {
    await Subsidy.create([
      { title: 'Fertilizer Subvention 2026', amount: 5000, eligibilityCriteria: 'Tea smallholders with < 2 acres', description: 'Covers 50% of cost for NPK fertilizer bags.', category: 'Fertilizer' },
      { title: 'Drip Irrigation Setup Support', amount: 25000, eligibilityCriteria: 'All registered farmers in dry zone regions', description: 'Assistance for setting up low-water micro-drip systems.', category: 'Equipment' }
    ]);
    await Grant.create([
      { title: 'Organic Tea Farming Grant', totalFund: 500000, status: 'ACTIVE', deadline: '2026-08-31', description: 'Grant to transition traditional tea estates into certified organic estates.' },
      { title: 'Agri-Tech Adoption Grant', totalFund: 300000, status: 'ACTIVE', deadline: '2026-09-15', description: 'Funding for smart moisture sensors and automated greenhouses.' }
    ]);
    await DiseaseAlert.create([
      { crop: 'Tea', diseaseName: 'Blister Blight', region: 'Nuwara Eliya', severity: 'CRITICAL', description: 'Severe fungal outbreak spotted due to high humidity. Apply copper fungicides immediately.', alertDate: new Date().toISOString().split('T')[0] },
      { crop: 'Potato', diseaseName: 'Late Blight', region: 'Badulla', severity: 'MEDIUM', description: 'Watch leaves for brown spots. Reduce overhead watering.', alertDate: new Date().toISOString().split('T')[0] }
    ]);
    await Regulation.create([
      { title: 'Pesticide MRL Restrictions', category: 'Chemicals', description: 'Updated maximum residue limits for exports. Glyphosate strictly banned.', effectiveDate: '2026-07-01' }
    ]);
    console.log('Government database seeded successfully');
  }
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Government Service running on port ${PORT}`);
  });
}

module.exports = app;
