const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const corsOptions = require('./config/cors');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --- Core middleware ---
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// --- Health check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', env: env.nodeEnv });
});

// --- API routes ---
// app.use(`${env.apiPrefix}/auth`, require('./routes/auth.routes'));
// --- API routes (mount these as you build features) ---
 app.use(`${env.apiPrefix}/auth`, require('./routes/auth.routes'));
app.use(`${env.apiPrefix}/products`, require('./routes/product.routes'));

// --- 404 + error handler must stay last, in this order ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;