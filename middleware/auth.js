const jwt = require('jsonwebtoken');
const db = require('../config/database');
const securityConfig = require('../config/security');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { message: 'Access token required' } });
  }

  try {
    const decoded = jwt.verify(token, securityConfig.getJWTSecret());
    
    // Get user from database
    const result = await db.query(
      'SELECT id, email, role, first_name, last_name, email_verified FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    const user = result.rows[0];
    
    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({ error: { message: 'Email verification required' } });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: { message: 'Invalid token' } });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: { message: 'Token expired' } });
    }
    return res.status(403).json({ error: { message: 'Authentication failed' } });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { message: 'Admin access required' } });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
