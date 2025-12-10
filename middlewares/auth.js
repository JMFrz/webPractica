const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Verifica Authorization: Bearer <token>
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, error: 'No autorizado: falta token' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, email, nombre }
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
  }
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      nombre: user.nombre || null,
      googleId: user.googleId || null,
      githubId: user.githubId || null
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

module.exports = {
  requireAuth,
  signToken
};
