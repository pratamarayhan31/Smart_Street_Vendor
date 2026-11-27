import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'ssv-bandar-lampung-secret-key-2026-dev';

export function signAuthToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      vendorId: user.vendor_id || user.vendorId || null,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Sesi tidak valid atau Anda belum masuk. Silakan login terlebih dahulu.' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Sesi Anda telah berakhir atau token tidak valid. Silakan login kembali.' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Autentikasi diperlukan.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Anda tidak memiliki hak akses untuk tindakan ini.' });
    }
    next();
  };
}

