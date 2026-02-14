import sequelize from '../services/db.service.js';
import models from '../models/index.js';

const resetDb = async (req, res) => {
    try {
        // Force sync to drop and recreate tables
        await sequelize.sync({ force: true });
        console.log('Database reset complete!');

        // Seed roles
        const { Role } = models;
        const roles = ['admin', 'president', 'board-member', 'costumes', 'props', 'sets', 'tech', 'director', 'stage-manager', 'actor', 'stagehand', 'lead'];

        for (const roleName of roles) {
            const [role, created] = await Role.findOrCreate({ where: { name: roleName } });
            if (created) {
                console.log(`Created role: ${roleName}`);
            }
        }
        console.log('Roles seeding complete');

        res.json({ success: true, message: 'Database reset and seeded successfully.' });
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).json({ success: false, message: 'Failed to reset database.', error: error.message });
    }
};

export default { resetDb };