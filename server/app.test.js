import request from 'supertest';
import app from './server.js';
import sequelize from './src/services/db.service.js';

describe('Multi-Tenant Organization & Role API', () => {
    let testUserId;
    let testOrgId;

    beforeAll(async () => {

        try {
            await sequelize.authenticate();
            // Force sync ensures tables are ready before the first test hits an endpoint
            await sequelize.sync({ alter: true }); 
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }, 30000);

    // 1. Setup: Create a User and an Organization
    it('Setup: Create User and Organization', async () => {
        // Create User
        const userRes = await request(app).post('/api/users').send({
            fname: 'Aiden',
            lname: 'Tester',
            email: `test-${Date.now()}@viu.ca`,
            passwordHash: 'password123'
        });
        testUserId = userRes.body.id;

        // Create Organization
        const orgRes = await request(app).post('/api/orgs').send({
            name: 'VIU Theatre'
        });
        testOrgId = orgRes.body.id;

        expect(userRes.statusCode).toEqual(201);
        expect(orgRes.statusCode).toEqual(201);
    });

    // 2. REQUIREMENT 1: Join Organization (No Roles)
    it('POST /api/orgs/:orgId/join - should link user to org without roles', async () => {
        const res = await request(app)
            .post(`/api/orgs/${testOrgId}/join`)
            .send({ userId: testUserId });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        // Verify the assignment_id exists in the junction table
        expect(res.body.data).toHaveProperty('assignment_id');
    });

    // 3. REQUIREMENT 2: Append Roles (Many-to-Many)
    describe('Organization Role Management', () => {
        
        it('PUT .../roles - should append multiple roles (admin, president)', async () => {
            const res = await request(app)
                .put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
                .send({ roles: ['admin', 'president'] }); // Using array as expected

            expect(res.statusCode).toEqual(200);
            const roleNames = res.body.data.map(r => r.name);
            expect(roleNames).toContain('admin');
            expect(roleNames).toContain('president');
        });

        it('GET .../users - should retrieve all users in org with their roles', async () => {
            const res = await request(app).get(`/api/orgs/${testOrgId}/users`);
            
            expect(res.statusCode).toEqual(200);
            // Verify our user is in the list and has the 'assignedRoles' alias
            const userInOrg = res.body.find(m => m.User.id === testUserId);
            expect(userInOrg.assignedRoles.length).toBeGreaterThanOrEqual(2);
        });

        it('DELETE .../roles - should remove multiple roles at once', async () => {
            // Using the new bulk-delete logic
            const res = await request(app)
                .delete(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
                .send({ roles: ['admin', 'president'] });

            expect(res.statusCode).toEqual(200);
            
            // Verify roles are gone
            const verify = await request(app).get(`/api/orgs/${testOrgId}/users/${testUserId}`);
            expect(verify.body.assignedRoles.length).toBe(0);
        });
    });

    // 4. Cleanup: Remove user and organization
    it('Cleanup: Remove User and Organization', async () => {
        const delUser = await request(app).delete(`/api/users/${testUserId}`);
        const delOrg = await request(app).delete(`/api/orgs/${testOrgId}`);
        
        expect(delUser.statusCode).toEqual(204);
        expect(delOrg.statusCode).toEqual(204);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});