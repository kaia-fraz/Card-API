const jwt = require('jsonwebtoken');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  // Get token from request body (since it's coming from a form)
  const token = req.body.token;

  if (!token) {
    return res.status(401).send(`
      <h2>Authentication Error</h2>
      <p>No token provided. Please provide a valid JWT token.</p>
      <a href="/cards/create">Go back</a>
    `);
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send(`
        <h2>Authentication Error</h2>
        <p>Invalid or expired token.</p>
        <a href="/auth">Get a new token</a>
      `);
    }

    // Token is valid, attach user info to request
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
