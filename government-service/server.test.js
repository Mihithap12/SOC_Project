process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');

const Subsidy = mongoose.model('Subsidy');
const Grant = mongoose.model('Grant');
const DiseaseAlert = mongoose.model('DiseaseAlert');
const Regulation = mongoose.model('Regulation');

describe('Government Service API Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('GET /api/subsidies - success', async () => {
    const mockData = [{ title: 'Subvention 1' }];
    jest.spyOn(Subsidy, 'find').mockResolvedValue(mockData);

    const res = await request(app).get('/api/subsidies');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  test('POST /api/subsidies - success', async () => {
    const payload = { title: 'New Subvention' };
    jest.spyOn(Subsidy.prototype, 'save').mockResolvedValue(payload);

    const res = await request(app).post('/api/subsidies').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Subvention');
  });

  test('POST /api/subsidies - error handler', async () => {
    jest.spyOn(Subsidy.prototype, 'save').mockRejectedValue(new Error('Validation error'));

    const res = await request(app).post('/api/subsidies').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
  });

  test('GET /api/grants - success', async () => {
    const mockData = [{ title: 'Grant 1' }];
    jest.spyOn(Grant, 'find').mockResolvedValue(mockData);

    const res = await request(app).get('/api/grants');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  test('POST /api/grants - success', async () => {
    const payload = { title: 'New Grant' };
    jest.spyOn(Grant.prototype, 'save').mockResolvedValue(payload);

    const res = await request(app).post('/api/grants').send(payload);
    expect(res.status).toBe(201);
  });

  test('POST /api/grants - error handler', async () => {
    jest.spyOn(Grant.prototype, 'save').mockRejectedValue(new Error('Save error'));

    const res = await request(app).post('/api/grants').send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/alerts - success', async () => {
    const mockData = [{ diseaseName: 'Blight' }];
    jest.spyOn(DiseaseAlert, 'find').mockResolvedValue(mockData);

    const res = await request(app).get('/api/alerts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  test('POST /api/alerts - success', async () => {
    const payload = { diseaseName: 'Blight' };
    jest.spyOn(DiseaseAlert.prototype, 'save').mockResolvedValue(payload);

    const res = await request(app).post('/api/alerts').send(payload);
    expect(res.status).toBe(201);
  });

  test('POST /api/alerts - error handler', async () => {
    jest.spyOn(DiseaseAlert.prototype, 'save').mockRejectedValue(new Error('Save error'));

    const res = await request(app).post('/api/alerts').send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/regulations - success', async () => {
    const mockData = [{ title: 'Reg 1' }];
    jest.spyOn(Regulation, 'find').mockResolvedValue(mockData);

    const res = await request(app).get('/api/regulations');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  test('POST /api/regulations - success', async () => {
    const payload = { title: 'Reg 1' };
    jest.spyOn(Regulation.prototype, 'save').mockResolvedValue(payload);

    const res = await request(app).post('/api/regulations').send(payload);
    expect(res.status).toBe(201);
  });

  test('POST /api/regulations - error handler', async () => {
    jest.spyOn(Regulation.prototype, 'save').mockRejectedValue(new Error('Save error'));

    const res = await request(app).post('/api/regulations').send({});
    expect(res.status).toBe(400);
  });
});
