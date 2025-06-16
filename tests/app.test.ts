    import request from 'supertest';
    import app from '../src/app'; // Assuming your Express app is exported from src/app.ts

    describe('ZynConsent API', () => {
      let server: any; // To hold the server instance for cleanup

      // Before all tests, start the server
      beforeAll((done) => {
        server = app.listen(4000, () => { // Use a different port for testing if 3000 is for dev
          done();
        });
      });

      // After all tests, close the server
      afterAll((done) => {
        if (server) {
          server.close(done);
        } else {
          done();
        }
      });

      it('should record a new consent event successfully (POST /consent)', async () => {
        const consentEvent = {
          userId: 'user123',
          consentType: 'marketing_emails',
          status: 'granted',
          timestamp: new Date().toISOString(),
        };

        const res = await request(app)
          .post('/consent')
          .send(consentEvent);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Consent event recorded successfully.');
        expect(res.body.consentEvent).toMatchObject(consentEvent);
      });

      it('should return 400 if required fields are missing (POST /consent)', async () => {
        const invalidConsentEvent = {
          userId: 'user123',
          consentType: 'marketing_emails',
          // status is missing
          timestamp: new Date().toISOString(),
        };

        const res = await request(app)
          .post('/consent')
          .send(invalidConsentEvent);

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toContain('Missing required fields');
      });

      it('should retrieve consent events for an existing user (GET /consent/{userId})', async () => {
        // First, record some consent events for a user
        await request(app)
          .post('/consent')
          .send({
            userId: 'testuser456',
            consentType: 'analytics',
            status: 'granted',
            timestamp: new Date().toISOString(),
          });
        
        await request(app)
          .post('/consent')
          .send({
            userId: 'testuser456',
            consentType: 'data_sharing',
            status: 'revoked',
            timestamp: new Date().toISOString(),
          });

        const res = await request(app)
          .get('/consent/testuser456');

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Consent events for user testuser456.');
        expect(res.body.consentEvents).toBeInstanceOf(Array);
        expect(res.body.consentEvents.length).toBeGreaterThanOrEqual(2); // Might have more if previous tests added
        expect(res.body.consentEvents[0].userId).toEqual('testuser456');
      });

      it('should return 404 for a user with no consent events (GET /consent/{userId})', async () => {
        const res = await request(app)
          .get('/consent/nonexistentuser');

        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toContain('No consent events found for user: nonexistentuser');
      });

      it('should return 200 for health check (GET /health)', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('ok');
        expect(res.body.service).toEqual('ZynConsent MVP');
      });
    });
    
