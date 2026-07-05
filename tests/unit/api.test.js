// -----------------------------------------------------------------------------
// Unit-Tests für die Dummy-API (Block 1)
//
// Diese Tests sind bereits fertig und laufen mit "npm test".
// Sie importieren die Express-App direkt (kein echter Server nötig)
// und prüfen die Endpunkte mit supertest.
// -----------------------------------------------------------------------------

const request = require('supertest');
const app = require('../../api/server');

describe('GET /health', () => {
  it('gibt 200 und { status: "ok" } zurück', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /users', () => {
  it('gibt 200 und eine nicht-leere Nutzerliste zurück', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThan(0);
  });
});

describe('POST /users', () => {
  it('erstellt einen Nutzer und gibt 201 zurück', async () => {
    const res = await request(app).post('/users').send({ name: 'Neuer User' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Neuer User');
    expect(res.body.id).toBeDefined();
  });

  it('gibt 400 zurück, wenn kein Name übergeben wird', async () => {
    const res = await request(app).post('/users').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('GET /secret-data', () => {
  it('gibt 401 zurück, wenn kein API-Key gesendet wird', async () => {
    const res = await request(app).get('/secret-data');
    expect(res.status).toBe(401);
  });

  it('gibt 200 zurück, wenn der korrekte API-Key gesendet wird', async () => {
    const res = await request(app)
      .get('/secret-data')
      .set('x-api-key', 'workshop-secret-123');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Access granted');
  });
});
