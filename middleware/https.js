const fs = require('fs');
const https = require('https');

/**
 * HTTPS/TLS enforcement middleware
 * Ensures all communications are encrypted in transit
 */

/**
 * Force HTTPS redirect middleware
 */
const forceHTTPS = (req, res, next) => {
  // Skip in development
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Check if request is already HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }

  // Redirect to HTTPS
  const httpsUrl = `https://${req.get('host')}${req.originalUrl}`;
  res.redirect(301, httpsUrl);
};

/**
 * Strict Transport Security (HSTS) middleware
 */
const hsts = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Force HTTPS for 1 year, include subdomains
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
};

/**
 * Enhanced security headers for HTTPS
 */
const secureHeaders = (req, res, next) => {
  // Only send secure cookies over HTTPS
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Set-Cookie', 'Secure; SameSite=Strict');
  }

  // Prevent mixed content (allow payment widget iframes)
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.changelly.com https://*.moonpay.com https://*.transak.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https:; " +
    "font-src 'self' https:; " +
    "object-src 'none'; " +
    "media-src 'self'; " +
    "frame-src https://widget.changelly.com https://*.changelly.com https://*.moonpay.com https://buy.moonpay.com https://wallet.moonpay.com https://*.transak.com https://global.transak.com; " +
    "upgrade-insecure-requests"
  );

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

/**
 * Load SSL certificates for HTTPS server
 */
const loadSSLCredentials = () => {
  try {
    const certPath = process.env.SSL_CERT_PATH;
    const keyPath = process.env.SSL_KEY_PATH;
    
    if (!certPath || !keyPath) {
      console.warn('⚠️  SSL certificate paths not configured');
      return null;
    }

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      console.warn('⚠️  SSL certificate files not found');
      return null;
    }

    return {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    };
  } catch (error) {
    console.error('❌ Failed to load SSL credentials:', error.message);
    return null;
  }
};

/**
 * Create HTTPS server with proper configuration
 */
const createHTTPSServer = (app) => {
  const credentials = loadSSLCredentials();
  
  if (!credentials) {
    console.log('🔓 Running HTTP server (development mode)');
    return null;
  }

  const httpsOptions = {
    ...credentials,
    // Enhanced security options
    secureProtocol: 'TLSv1_2_method',
    ciphers: [
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-SHA256',
      'ECDHE-RSA-AES256-SHA384'
    ].join(':'),
    honorCipherOrder: true
  };

  return https.createServer(httpsOptions, app);
};

/**
 * Validate TLS configuration
 */
const validateTLSConfig = () => {
  const issues = [];

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.SSL_CERT_PATH) {
      issues.push('SSL_CERT_PATH not configured');
    }
    if (!process.env.SSL_KEY_PATH) {
      issues.push('SSL_KEY_PATH not configured');
    }
    if (process.env.FORCE_HTTPS !== 'true') {
      issues.push('FORCE_HTTPS not enabled');
    }
  }

  if (issues.length > 0) {
    console.warn('⚠️  TLS Configuration Issues:');
    issues.forEach(issue => console.warn(`   - ${issue}`));
  }

  return issues.length === 0;
};

module.exports = {
  forceHTTPS,
  hsts,
  secureHeaders,
  createHTTPSServer,
  validateTLSConfig
};
