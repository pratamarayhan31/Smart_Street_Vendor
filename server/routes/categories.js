import express from 'express';
import { queryAll, queryOne, runSql } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories
router.get('/', (_req, res) => {
  const categories = queryAll('SELECT * FROM categories');
  return res.json({ categories });
});

// POST /api/categories (Admin only)
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { name, description } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
  }

  const cleanName = String(name).trim();
  const duplicate = queryOne('SELECT id FROM categories WHERE LOWER(name) = ?', [cleanName.toLowerCase()]);
  if (duplicate) {
    return res.status(409).json({ message: 'Kategori dengan nama tersebut sudah ada.' });
  }

  const id = `cat-${Date.now()}`;
  const desc = description || 'Kategori dagangan PKL Kota Bandar Lampung.';

  runSql('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)', [id, cleanName, desc]);
  const created = queryOne('SELECT * FROM categories WHERE id = ?', [id]);

  return res.status(201).json({ message: 'Kategori berhasil ditambahkan.', category: created });
});

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const cat = queryOne('SELECT * FROM categories WHERE id = ?', [id]);
  if (!cat) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
  }

  const used = queryOne('SELECT id FROM vendors WHERE category = ?', [cat.name]);
  if (used) {
    return res.status(409).json({
      message: `Kategori "${cat.name}" sedang digunakan oleh pedagang terdaftar. Tidak dapat dihapus langsung.`,
    });
  }

  runSql('DELETE FROM categories WHERE id = ?', [id]);
  return res.json({ message: 'Kategori berhasil dihapus.' });
});

export default router;

