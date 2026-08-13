const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

async function start() {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}

start();