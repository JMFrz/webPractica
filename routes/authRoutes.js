const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/User');
const { signToken } = require('../middlewares/auth');

const router = express.Router();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

// Login con Google: recibe idToken del frontend
router.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, error: 'Falta idToken de Google' });
    if (!googleClient) return res.status(500).json({ success: false, error: 'GOOGLE_CLIENT_ID no configurado' });

    const ticket = await googleClient.verifyIdToken({ idToken, audience: googleClientId });
    const payload = ticket.getPayload();
    const email = payload.email;
    const nombre = payload.name || null;
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, nombre, googleId });
    }

    const jwt = signToken(user);
    return res.json({ success: true, token: jwt, user: { id: user._id, email: user.email, nombre: user.nombre } });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'No se pudo verificar el token de Google' });
  }
});

// Login con GitHub: recibe el code del OAuth flow
router.post('/auth/github', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Falta code de GitHub' });
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) return res.status(500).json({ success: false, error: 'Faltan variables de GitHub' });

    // Intercambiar code por access_token
    const tokenResp = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResp.data.access_token;
    if (!accessToken) return res.status(401).json({ success: false, error: 'No se pudo obtener access_token de GitHub' });

    // Obtener email de GitHub
    const userResp = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const primaryEmail = (userResp.data || []).find((e) => e.primary) || userResp.data[0];
    if (!primaryEmail || !primaryEmail.email) return res.status(401).json({ success: false, error: 'No se pudo obtener email de GitHub' });

    const email = primaryEmail.email;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, githubId: 'github_' + email, nombre: email.split('@')[0] });
    }

    const jwt = signToken(user);
    return res.json({ success: true, token: jwt, user: { id: user._id, email: user.email, nombre: user.nombre } });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'No se pudo verificar el login de GitHub' });
  }
});

// Devuelve datos del usuario autenticado
router.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, error: 'No autorizado' });
  try {
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    return res.json({ success: true, user: payload });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
});

module.exports = router;
