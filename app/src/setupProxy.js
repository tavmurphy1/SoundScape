//Author: Tavner Murphy
//Date 3/12/2024

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

  // CONCERT LOG PROXY
  app.use('/concertlog', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/concertlog': '/concertlog' },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying /concertlog request: ${proxyReq.method} ${proxyReq.path}`);
    }
  }));

  // USER AUTH PROXY
  app.use('/users', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/users': '/users' }, // Preserves the /users base path
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.method} ${proxyReq.path}`);
    }
  }));

  // SPOTIFY PROXY
  app.use('/spotify', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: { '^/spotify': '/spotify' },  
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.method} ${proxyReq.path}`);
    }
  }));

  app.use('/favorites', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: { '^/favorites': '/favorites' },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.method} ${proxyReq.path}`);
    }
  }));

  // Custom proxy endpoint for Ticketmaster API requests
  app.get('/ticketmaster/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const API_KEY = 'XzpAgIiHS6LYrTkgPButoiw3LK9uBeNW';
    const TICKETMASTER_API = 'https://app.ticketmaster.com/discovery/v2/events';
    try {
      const url = `${TICKETMASTER_API}/${eventId}.json?apikey=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ error: response.statusText });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
