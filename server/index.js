import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import vendorRoutes from './routes/vendors.js';
import categoryRoutes from './routes/categories.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Smart Street Vendor API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/categories', categoryRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Terjadi kesalahan internal pada server.' });
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Smart Street Vendor Backend API berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Gagal menginisialisasi database SQLite:', err);
    process.exit(1);
  });

