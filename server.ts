import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// In-memory database for demo
let artworks = [
  {
    id: 1,
    title: "Eternal Flow",
    description: "A piece exploring the intersection of light and liquid. The artist captures the essence of movement and reflection, creating a hypnotic visual experience that transcends traditional boundaries.",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
    artistName: "Elena Rossi",
    artistId: 1,
    status: "AVAILABLE",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Urban Echo",
    description: "Capturing the rhythm of a bustling metropolis at night. Steel, glass, and neon light collide in a symphonic display of modern existence.",
    price: 850,
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    artistName: "Marcus Thorne",
    artistId: 2,
    status: "AVAILABLE",
    createdAt: new Date().toISOString()
  }
];

let artists = [
  {
    id: 1,
    name: "Elena Rossi",
    bio: "Contemporary abstract artist based in Milan. With over a decade of experience, Elena's work has been featured in major galleries across Europe. She focuses on the relationship between natural elements and emotional states.",
    specialty: "Oil Painting",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    location: "Milan, Italy",
    exhibitionCount: 12,
    artworks: [1]
  },
  {
    id: 2,
    name: "Marcus Thorne",
    bio: "Visionary storyteller focusing on urban landscapes and digital artifacts. Marcus uses a unique blend of traditional techniques and modern perspectives to capture the fleeting beauty of the city.",
    specialty: "Digital Art",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    location: "Berlin, Germany",
    exhibitionCount: 8,
    artworks: [2]
  }
];

let exhibitions = [
  {
    id: 1,
    title: "Liquid Visions",
    description: "An immersive journey through the theme of fluidity. This exhibition brings together artists from around the world to explore how we perceive change and adaptation in a rapidly shifting world.",
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
  // Serve static files from public/uploads as /uploads
  app.use('/uploads', express.static(uploadsDir));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: "UP", database: "OK (IN-MEMORY)" });
  });

  // Upload endpoint
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    const userEmail = email || "demo@example.com";
    const isAdmin = userEmail.toLowerCase() === 'vovkin06@gmail.com';
    
    // Check if user exists in artists to give proper role
    const artist = artists.find(a => a.name.toLowerCase().includes(userEmail.split('@')[0].toLowerCase()));
    const roles = isAdmin ? ["ROLE_ADMIN", "ROLE_USER"] : (artist ? ["ROLE_ARTIST", "ROLE_USER"] : ["ROLE_USER"]);

    res.json({
      token: `mock_jwt_token_${userEmail}`,
      email: userEmail,
      displayName: isAdmin ? "Administrator" : (artist ? artist.name : "Art Collector"),
      roles: roles
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, role } = req.body;
    const roles = role === 'artist' ? ["ROLE_ARTIST", "ROLE_USER"] : ["ROLE_USER"];
    
    res.json({
      token: `mock_jwt_token_${email}`,
      email: email,
      displayName: "New User",
      roles: roles
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

  app.get('/api/artists/:id', (req, res) => {
    const artist = artists.find(a => a.id === parseInt(req.params.id));
    if (artist) {
      const artistArtworks = artworks.filter(a => a.artistId === artist.id || a.artistName === artist.name);
      res.json({ ...artist, artworks: artistArtworks });
    } else res.status(404).json({ error: "Artist not found" });
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

  app.get('/api/exhibitions/:id', (req, res) => {
    const exhibition = exhibitions.find(e => e.id === parseInt(req.params.id));
    if (exhibition) res.json(exhibition);
    else res.status(404).json({ error: "Exhibition not found" });
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
