import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = { id: Number(decoded.id), roleId: Number(decoded.roleId) };
    if (req.user.roleId !== 2) return res.status(403).json({ error: 'Forbidden' });
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
