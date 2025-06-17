import request from 'supertest';
import app from '../src/app'; // Make sure this path is correct

describe('ZynConsent API', () => {
  // Test for POST /consent
  it('should record a new consent event successfully (POST /consent)', async () => {
    const consentEvent = {
      userId: 'user123',
      consentType: 'marketing_emails',
      status: 'granted',
      timestamp: new Date().toISOString(),
    };
    const res = await request(app).post('/consent').send(consentEvent);
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Consent event recorded successfully.');
    expect(res.body.consentEvent).toMatchObject(consentEvent);
  });

  it('should return 400 if required fields are missing (POST /consent)', async () => {
    const consentEvent = {
      userId: 'user123',
      consentType: 'marketing_emails',
      // Missing status and timestamp
    };
    const res = await request(app).post('/consent').send(consentEvent);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
  });

  // Test for GET /consent/{userId}
  it('should retrieve consent events for an existing user (GET /consent/{userId})', async () => {
    // First, record some consent events for a user
    const userId = 'testuser456';
    await request(app).post('/consent').send({
      userId,
      consentType: 'analytics',
      status: 'granted',
      timestamp: new Date().toISOString(),
    });
    await request(app).post('/consent').send({
      userId,
      consentType: 'data_sharing',
      status: 'revoked',
      timestamp: new Date().toISOString(),
    });

    const res = await request(app).get(`/consent/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual(`Consent events for user ${userId}.`);
    expect(res.body.consentEvents).toBeInstanceOf(Array);
    expect(res.body.consentEvents.length).toBeGreaterThanOrEqual(2); // Should have at least the two we added
    expect(res.body.consentEvents[0]).toHaveProperty('userId', userId);
  });

  it('should return 404 for a user with no consent events (GET /consent/{userId})', async () => {
    const res = await request(app).get('/consent/nonexistentuser');
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBeDefined();
  });

  // Test for GET /health
  it('should return 200 for health check (GET /health)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (request as any)(app).get('/health');
    expect(res.statusCode).toEqual(200);
    // Corrected assertion: expecting 'message' field instead of 'service'
    expect(res.body.status).toEqual('ok');
    expect(res.body.message).toEqual('ZynConsent API is running!');
  });
});
