// CORS middleware for Vercel serverless functions

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = require('cors');

const corsMiddleware = initMiddleware(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

module.exports = { corsMiddleware };
