process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');

const Training = mongoose.model('Training');
const Advisory = mongoose.model('Advisory');
const Assistance = mongoose.model('Assistance');

describe('NGO Service API Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('GET /api/training - success', async () => {
    const mockWorkshops = [{ title: 'Soil Health' }];
    jest.spyOn(Training, 'find').mockResolvedValue(mockWorkshops);

    const res = await request(app).get('/api/training');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockWorkshops);
  });

  test('POST /api/training - success', async () => {
    const payload = { title: 'New Training' };
    jest.spyOn(Training.prototype, 'save').mockResolvedValue(payload);

    const res = await request(app).post('/api/training').send(payload);
    expect(res.status).toBe(201);
  });

  test('POST /api/training - error handler', async () => {
    jest.spyOn(Training.prototype, 'save').mockRejectedValue(new Error('Save error'));

    const res = await request(app).post('/api/training').send({});
    expect(res.status).toBe(400);
  });

  test('POST /api/training/:id/register - success', async () => {
    const mockWorkshop = {
      _id: '123',
      title: 'Soil Health',
      maxAttendees: 10,
      registeredCount: 5,
      save: jest.fn().mockResolvedValue(true)
    };
    jest.spyOn(Training, 'findById').mockResolvedValue(mockWorkshop);

    const res = await request(app).post('/api/training/123/register');
    expect(res.status).toBe(200);
    expect(mockWorkshop.registeredCount).toBe(6);
  });

  test('POST /api/training/:id/register - not found', async () => {
    jest.spyOn(Training, 'findById').mockResolvedValue(null);

    const res = await request(app).post('/api/training/123/register');
    expect(res.status).toBe(404);
  });

  test('POST /api/training/:id/register - full error', async () => {
    const mockWorkshop = {
      _id: '123',
      title: 'Soil Health',
      maxAttendees: 10,
      registeredCount: 10,
      save: jest.fn()
    };
    jest.spyOn(Training, 'findById').mockResolvedValue(mockWorkshop);

    const res = await request(app).post('/api/training/123/register');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Training program is full');
  });

  test('GET /api/advisories - success', async () => {
    const mockAdvisories = [{ title: 'Advisory 1' }];
    jest.spyOn(Advisory, 'find').mockResolvedValue(mockAdvisories);

    const res = await request(app).get('/api/advisories');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAdvisories);
  });

  test('POST /api/advisories - success', async () => {
    const payload = { title: 'New Advisory' };
    jest.spyOn(Advisory.prototype, 'save').mockResolvedValue(payload);

    const res = await request(app).post('/api/advisories').send(payload);
    expect(res.status).toBe(201);
  });

  test('POST /api/advisories - error handler', async () => {
    jest.spyOn(Advisory.prototype, 'save').mockRejectedValue(new Error('Save error'));

    const res = await request(app).post('/api/advisories').send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/assistance - success', async () => {
    const mockReqs = [{ farmerName: 'Farmer Joe' }];
    jest.spyOn(Assistance, 'find').mockResolvedValue(mockReqs);

    const res = await request(app).get('/api/assistance');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockReqs);
  });

  test('GET /api/assistance/farmer/:farmerId - success', async () => {
    const mockReqs = [{ farmerId: 10, farmerName: 'Farmer Joe' }];
    jest.spyOn(Assistance, 'find').mockResolvedValue(mockReqs);

    const res = await request(app).get('/api/assistance/farmer/10');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockReqs);
  });

  test('POST /api/assistance - success', async () => {
    const payload = { farmerName: 'Farmer Joe', requestDetails: 'Need seeds' };
    jest.spyOn(Assistance.prototype, 'save').mockResolvedValue(payload);

    const res = await request(app).post('/api/assistance').send(payload);
    expect(res.status).toBe(201);
  });

  test('POST /api/assistance - error handler', async () => {
    jest.spyOn(Assistance.prototype, 'save').mockRejectedValue(new Error('Save error'));

    const res = await request(app).post('/api/assistance').send({});
    expect(res.status).toBe(400);
  });

  test('PUT /api/assistance/:id/status - success', async () => {
    const mockUpdated = { _id: '123', status: 'APPROVED' };
    jest.spyOn(Assistance, 'findByIdAndUpdate').mockResolvedValue(mockUpdated);

    const res = await request(app).put('/api/assistance/123/status').send({ status: 'APPROVED' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('APPROVED');
  });
});
