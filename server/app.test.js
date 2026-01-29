import request from 'supertest';
import app from './server.js';
import sequelize from './src/services/db.service.js';

describe('Initial Server Check', () => {
    // Ensure the database is connected before running tests
    beforeAll(async () => {
        try {
            await sequelize.authenticate();
        } catch (error) {
            console.error('Unable to connect to the database during test:', error);
        }
    });

    it('should return a 200 status for the health check route', async () => {
        const res = await request(app).get('/server-up');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('ok');
    });

    // Clean up the connection so Jest can exit safely
    afterAll(async () => {
        await sequelize.close();
    });
});