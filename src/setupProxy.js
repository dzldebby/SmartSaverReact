const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up API proxy middleware to http://localhost:3001');
  
  // Add a simple middleware to log all requests
  app.use((req, res, next) => {
    console.log('Frontend received request:', req.method, req.path);
    next();
  });

  const apiProxy = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
    ws: true,
    xfwd: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '/api', // Keep /api prefix when forwarding to the server
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxying request:', {
        method: req.method,
        path: req.path,
        targetUrl: `http://localhost:3001${req.path}`,
        headers: req.headers
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('Proxy response:', {
        status: proxyRes.statusCode,
        path: req.path,
        headers: proxyRes.headers
      });
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
    }
  });

  // Mount the proxy middleware for /api routes
  app.use('/api', apiProxy);
  
  // Also proxy direct chat endpoint
  const chatProxy = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
    ws: true,
    xfwd: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxying chat request:', {
        method: req.method,
        path: req.path,
        targetUrl: `http://localhost:3001${req.path}`,
        headers: req.headers
      });
    },
    onError: (err, req, res) => {
      console.error('Chat proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Chat proxy error', details: err.message }));
    }
  });
  
  // Mount the chat proxy middleware
  app.use('/chat', chatProxy);
  
  // Add a catch-all handler for unmatched routes
  app.use((req, res, next) => {
    console.log('Unmatched route:', req.method, req.path);
    next();
  });
}; 