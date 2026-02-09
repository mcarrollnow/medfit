const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const xss = require('xss');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: { message } },
  standardHeaders: true,
  legacyHeaders: false,
});

// Different rate limits for different endpoints
const rateLimits = {
  // Strict limits for auth endpoints
  auth: createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts, please try again later'),
  
  // General API rate limit
  api: createRateLimit(15 * 60 * 1000, 100, 'Too many requests, please try again later'),
  
  // Stricter limit for sensitive operations
  sensitive: createRateLimit(15 * 60 * 1000, 10, 'Too many requests for sensitive operations'),
};

// Input validation schemas
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().required().min(8).max(128)
  }),
  
  register: Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().required().min(12).max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$'))
      .messages({
        'string.pattern.base': 'Password must be at least 12 characters with uppercase, lowercase, number, and special character (@$!%*?&)',
        'string.min': 'Password must be at least 12 characters long'
      }),
    firstName: Joi.string().required().max(50).pattern(/^[a-zA-Z\s]+$/),
    lastName: Joi.string().optional().max(50).pattern(/^[a-zA-Z\s]+$/),
    first_name: Joi.string().optional().max(50).pattern(/^[a-zA-Z\s]+$/),
    last_name: Joi.string().optional().max(50).pattern(/^[a-zA-Z\s]+$/),
    phone: Joi.string().optional().pattern(/^[\+]?[1-9][\d]{0,15}$/),
    customerType: Joi.string().valid('retail', 'b2b').optional()
  }),
  
  orderId: Joi.object({
    id: Joi.string().uuid().required()
  })
};

// XSS sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
      return xss(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

// Validation middleware factory
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { 
          message: 'Invalid input data',
          details: error.details.map(d => d.message)
        }
      });
    }
    next();
  };
};

// Secure error handler
const secureErrorHandler = (err, req, res, next) => {
  console.error('Security Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      error: { message: 'An internal error occurred' }
    });
  }

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  next();
};

module.exports = {
  rateLimits,
  schemas,
  sanitizeInput,
  validateInput,
  secureErrorHandler,
  securityHeaders
};
