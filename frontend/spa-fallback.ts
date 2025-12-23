// spa-fallback.ts
import type { Connect } from 'vite';

export default function spaFallback(): Connect.NextHandleFunction {
  return function(req, res, next) {
    if (req.url) {
      // Skip API requests
      if (req.url.startsWith('/api')) {
        return next();
      }
      
      // Skip file requests (assets, etc.)
      if (req.url.match(/\.[a-zA-Z0-9]+$/)) {
        return next();
      }
      
      // For all other routes, serve index.html
      req.url = '/index.html';
    }
    next();
  };
}