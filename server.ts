import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const BACKEND_URL = 'http://localhost:8080';

  // Start Java Backend
  console.log('Starting Java Backend...');
  const javaBackend = spawn('mvn', ['spring-boot:run'], {
    cwd: path.join(process.cwd(), 'backend'),
    stdio: 'inherit',
    env: { ...process.env, SERVER_PORT: '8080' }
  });

  javaBackend.on('error', (err) => {
    console.error('Failed to start Java backend:', err);
  });

  // Proxy API requests to Java Backend
  app.use('/api', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('Proxy error:', err);
        // Fallback if backend is not yet started or failing
        if ('statusCode' in res) {
          if (req.url === '/health') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'waiting_for_backend' }));
          } else {
            res.statusCode = 502;
            res.end('Backend server not available');
          }
        }
      }
    }
  }));

  app.use(express.json());

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
