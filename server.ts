import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory database for demo
let artworks = [
  {
    id: 1,
    title: "Eternal Flow",
    description: "A piece exploring the intersection of light and liquid.",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
    artistName: "Elena Rossi",
    status: "AVAILABLE",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Urban Echo",
    description: "Capturing the rhythm of a bustling metropolis at night.",
    price: 850,
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    artistName: "Marcus Thorne",
    status: "AVAILABLE",
    createdAt: new Date().toISOString()
  }
];

let artists = [
  {
    id: 1,
    name: "Elena Rossi",
    bio: "Contemporary abstract artist based in Milan.",
    specialty: "Oil Painting",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    location: "Milan, Italy",
    exhibitionCount: 12
  }
];

let exhibitions = [
  {
    id: 1,
    title: "Liquid Visions",
    description: "An immersive journey through the theme of fluidity.",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4ce186860d",
    videoUrl: "",
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    location: "Online / Metaverse",
    status: "ACTIVE"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: "UP", database: "OK (IN-MEMORY)" });
  });

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    const userEmail = email || "demo@example.com";
    const isAdmin = userEmail.toLowerCase() === 'vovkin06@gmail.com';
    
    res.json({
      token: `mock_jwt_token_${userEmail}`,
      email: userEmail,
      displayName: isAdmin ? "Administrator" : "Art Collector",
      roles: isAdmin ? ["ROLE_ADMIN", "ROLE_USER"] : ["ROLE_USER"]
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email } = req.body;
    res.json({
      token: `mock_jwt_token_${email}`,
      email: email,
      displayName: "New User",
      roles: ["ROLE_USER"]
    });
  });

  // Artworks
  app.get('/api/artworks', (req, res) => {
    res.json(artworks);
  });

  app.get('/api/artworks/:id', (req, res) => {
    const artwork = artworks.find(a => a.id === parseInt(req.params.id));
    if (artwork) res.json(artwork);
    else res.status(404).json({ error: "Artwork not found" });
  });

  app.post('/api/artworks', (req, res) => {
    const newArtwork = {
      ...req.body,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    artworks.push(newArtwork);
    res.json(newArtwork);
  });

  app.delete('/api/artworks/:id', (req, res) => {
    artworks = artworks.filter(a => a.id !== parseInt(req.params.id));
    res.status(204).send();
  });

  app.put('/api/artworks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = artworks.findIndex(a => a.id === id);
    if (index !== -1) {
      artworks[index] = { ...artworks[index], ...req.body, id };
      res.json(artworks[index]);
    } else {
      res.status(404).json({ error: "Artwork not found" });
    }
  });

  // Artists
  app.get('/api/artists', (req, res) => {
    res.json(artists);
  });

  app.post('/api/artists', (req, res) => {
    const newArtist = { ...req.body, id: Date.now() };
    artists.push(newArtist);
    res.json(newArtist);
  });

  app.delete('/api/artists/:id', (req, res) => {
    artists = artists.filter(a => a.id !== parseInt(req.params.id));
    res.status(204).send();
  });

  app.put('/api/artists/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = artists.findIndex(a => a.id === id);
    if (index !== -1) {
      artists[index] = { ...artists[index], ...req.body, id };
      res.json(artists[index]);
    } else {
      res.status(404).json({ error: "Artist not found" });
    }
  });

  // Exhibitions
  app.get('/api/exhibitions', (req, res) => {
    res.json(exhibitions);
  });

  app.post('/api/exhibitions', (req, res) => {
    const newExhibition = { ...req.body, id: Date.now() };
    exhibitions.push(newExhibition);
    res.json(newExhibition);
  });

  app.delete('/api/exhibitions/:id', (req, res) => {
    exhibitions = exhibitions.filter(e => e.id !== parseInt(req.params.id));
    res.status(204).send();
  });

  app.put('/api/exhibitions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = exhibitions.findIndex(e => e.id === id);
    if (index !== -1) {
      exhibitions[index] = { ...exhibitions[index], ...req.body, id };
      res.json(exhibitions[index]);
    } else {
      res.status(404).json({ error: "Exhibition not found" });
    }
  });

  // Payments
  app.post('/api/payments/checkout', (req, res) => {
    const { artworkId } = req.query;
    res.json(`/success?artworkId=${artworkId}`);
  });

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
    console.log('Backend logic migrated to Express (Java environment not available)');
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
