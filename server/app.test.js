import request from 'supertest';
import app from './server.js';
import sequelize from './src/services/db.service.js';

describe('User API Routes (/api/users)', () => {
    let testUserId;

    // Ensure DB is up before starting
    beforeAll(async () => {
        await sequelize.authenticate();
    });

    // 1. CREATE: Use a unique email every time so the DB doesn't block you
    it('POST /api/users - should create a new user', async () => {
        const newUser = {
            fname: 'test',
            lname: 'user',
            email: `test-${Date.now()}@viu.ca`, // Unique email
            passwordHash: 'password123'
        };
        const res = await request(app).post('/api/users').send(newUser);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        testUserId = res.body.id; 
    });

    // 2. GET ALL
    it('GET /api/users - should retrieve all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    // 3. GET ONE
    it('GET /api/users/:id - should retrieve a single user by ID', async () => {
        const res = await request(app).get(`/api/users/${testUserId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBe(testUserId);
    });

    // 4. UPDATE
    it('PUT /api/users/:id - should update user details', async () => {
        const updatedData = { fname: 'updated_test' }; // Use fname, not username
        const res = await request(app).put(`/api/users/${testUserId}`).send(updatedData);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.fname).toBe('updated_test'); // Match the input above
    });

    describe('User Role Management (Many-to-Many)', () => {
        
        it('PUT /api/users/:id/roles - should append new roles (actor, tech)', async () => {
            const res = await request(app)
                .put(`/api/users/${testUserId}/roles`)
                .send({ roles: ['actor', 'tech'] });

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            
            const roleNames = res.body.map(r => r.name);
            expect(roleNames).toContain('actor');
            expect(roleNames).toContain('tech');
        });

        it('PUT /api/users/:id/roles - should append without replacing (stage-manager)', async () => {
            // Adding a third role
            const res = await request(app)
                .put(`/api/users/${testUserId}/roles`)
                .send({ roles: ['stage-manager'] });

            expect(res.statusCode).toEqual(200);
            const roleNames = res.body.map(r => r.name);
            
            // Verify all three exist now
            expect(roleNames).toContain('actor');
            expect(roleNames).toContain('tech');
            expect(roleNames).toContain('stage-manager');
        });

        it('GET /api/users/:id/roles - should retrieve all assigned roles', async () => {
            const res = await request(app).get(`/api/users/${testUserId}/roles`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(3);
        });

        it('DELETE /api/users/:id/roles - should remove a specific role (actor)', async () => {
            // Using the 'role' key as expected by your controller
            const res = await request(app)
                .delete(`/api/users/${testUserId}/roles`)
                .send({ role: 'actor' });

            expect(res.statusCode).toEqual(204);

            // Verify 'actor' is gone but 'tech' remains
            const verify = await request(app).get(`/api/users/${testUserId}/roles`);
            const roleNames = verify.body.map(r => r.name);
            expect(roleNames).not.toContain('actor');
            expect(roleNames).toContain('tech');
        });
    });

    // 5. DELETE
    it('DELETE /api/users/:id - should delete a user', async () => {
        const res = await request(app).delete(`/api/users/${testUserId}`);
        expect(res.statusCode).toEqual(204); // Or 200 depending on your controller

        // Verify it's actually gone
        const verify = await request(app).get(`/api/users/${testUserId}`);
        expect(verify.statusCode).toEqual(404);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});