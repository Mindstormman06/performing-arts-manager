import request from 'supertest';

import app from './server.js';
import models from './src/models/index.js';
import sequelize from './src/services/db.service.js';

describe('Performing Arts Manager: Auth & Permissions API', () => {
    let authToken;
    let testUserId;
    let testOrgId;
    let testShowId;

    beforeAll(async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync({ alter: true });

            // Seed all required roles for the multi-tenant logic
            const roles = ['admin', 'president', 'actor', 'lead', 'director', 'stage-manager'];
            for (const roleName of roles) {
                await models.Role.findOrCreate({ where: { name: roleName } });
            }
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }, 30000);

    // 1. REGISTRATION & AUTHENTICATION
    it('Setup: Register and Login User', async () => {
        const email = `aiden-${Date.now()}@viu.ca`;
        const password = 'password123';

        // Create User (unprotected)
        const userRes = await request(app).post('/api/users').send({
            fname: 'Aiden',
            lname: 'Tester',
            email: email,
            password: password // Service will hash this
        });
        testUserId = userRes.body.id;

        // Login to get JWT
        const loginRes = await request(app).post('/api/auth/login').send({
            email: email,
            password: password
        });

        expect(userRes.statusCode).toEqual(201);
        expect(loginRes.statusCode).toEqual(200);
        expect(loginRes.body).toHaveProperty('token');
        
        authToken = loginRes.body.token; // Save for later requests
    });

    // 2. ORGANIZATION SETUP
    describe('Organization Permissions', () => {
        it('POST /api/orgs - should create organization', async () => {
            const res = await request(app)
                .post('/api/orgs')
                .set('Authorization', `Bearer ${authToken}`) //
                .send({ name: 'VIU Theatre Dept' });

            expect(res.statusCode).toEqual(201);
            testOrgId = res.body.id;
        });

        it('Elevate User: Join Org and Assign Admin Role', async () => {
            // Join Org
            await request(app).post(`/api/orgs/${testOrgId}/join`).send({ userId: testUserId });
            
            // Assign Admin role so user can create shows
            const res = await request(app)
                .put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ roles: ['admin'] });

            expect(res.statusCode).toEqual(200);
        });
    });

    // 3. SHOW MANAGEMENT (Requires Admin/President of Org)
    describe('Show Operations & Roles', () => {
        it('POST /api/shows - should create show (requires Admin/President)', async () => {
            const res = await request(app)
                .post('/api/shows')
                .set('Authorization', `Bearer ${authToken}`) // Verified by authorizeOrg
                .send({
                    title: 'Macbeth',
                    start_date: '2026-07-01',
                    end_date: '2026-07-15',
                    organization_id: testOrgId
                });

            expect(res.statusCode).toEqual(201);
            testShowId = res.body.id;
        });

        it('PUT .../roles - should assign show roles (actor, lead)', async () => {
            // Join show first
            await request(app).post(`/api/shows/${testShowId}/join`).send({ userId: testUserId });

            const res = await request(app)
                .put(`/api/shows/${testShowId}/users/${testUserId}/roles`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ roles: ['actor', 'lead'] });

            expect(res.statusCode).toEqual(200);
            const roleNames = res.body.data.map(r => r.name);
            expect(roleNames).toContain('actor');
        });
    });

    // 4. CLEANUP
    it('Cleanup: Remove resources', async () => {
        // Delete Show first, then Org, then User
        await request(app).delete(`/api/shows/${testShowId}`).set('Authorization', `Bearer ${authToken}`);
        await request(app).delete(`/api/orgs/${testOrgId}`).set('Authorization', `Bearer ${authToken}`);
        await request(app).delete(`/api/users/${testUserId}`).set('Authorization', `Bearer ${authToken}`);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});