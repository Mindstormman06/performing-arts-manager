import { execSync } from 'child_process';

async function globalSetup() {
    console.log('🚀 Starting Global Setup: Seeding Database...');
    try {
        execSync('node seed.js', {
            cwd: '../server',
            stdio: 'inherit',
            env: { ...process.env, NODE_ENV: 'test' }
        });
        console.log('✅ Global Setup Complete: Database is ready.');
    } catch (error) {
        console.error('❌ Global Setup Failed:', error);
        process.exit(1);
    }
}

export default globalSetup;