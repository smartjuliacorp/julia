import request from 'supertest';
import { app } from '../src/app'; // Import the Express app

describe('App Routes', () => {
  it('should return a redirect for /connect', async () => {
    const response = await request(app).get('/connect');
    expect(response.status).toBe(302); // Expect redirect status
    expect(response.header.location).toContain('https://auth.truelayer-sandbox.com'); // Check redirection URL
  });

  it('should return 404 for an unknown route', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404); // Expect Not Found status
  });
});
