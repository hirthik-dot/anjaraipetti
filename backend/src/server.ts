import 'dotenv/config';
import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected');

        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🌶️  Anjaraipetti API Server                     ║
║   📍 Running on http://localhost:${PORT}             ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}               ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

start();
