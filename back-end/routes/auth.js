const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();


// POST /register
// Registra novo usuário com nome, email e senha
// Retorna: 201 com token JWT no cookie + dados do usuário

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Usuário ou email já cadastrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Apenas HTTPS em produção
      sameSite: 'lax', // Proteção contra CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias - considerar refresh tokens para expiração mais curta
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar conta' });
  }
});


// POST /login
// Autentica usuário com username e senha
// Retorna: 200 com token JWT no cookie

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    const result = await query(
      'SELECT id, username, email, password_hash, avatar_url, is_admin FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      // Retorna o mesmo erro para ambos os casos (usuário não encontrado / senha incorreta)
      // previne enumaração de usuários válidos pelas diferenças de tempo
      return res.status(401).json({ message: 'Usuário ou senha incorretos' });
    }

    const user = result.rows[0];

    // bcrypt.compare usa comparação timing-safe
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Usuário ou senha incorretos' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});


// POST /logout
// Limpa o cookie de autenticação

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado com sucesso' });
});


// GET /me
// Retorna dados do usuário autenticado
// Requer o middleware authMiddleware (token válido)
// Retorna: 200 com dados do usuário do req.user (já validado pela middleware)

router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        avatar_url: req.user.avatar_url,
        is_admin: req.user.is_admin,
        created_at: req.user.created_at,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
  }
});

module.exports = router;
