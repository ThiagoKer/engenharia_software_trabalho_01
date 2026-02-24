const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware para verificar autenticação via JWT no cookie
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco
    const result = await query(
      'SELECT id, username, email, avatar_url, is_admin, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar usuário ao request
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar se o usuário é admin
const adminMiddleware = async (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Middleware opcional - não retorna erro se não autenticado
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await query(
        'SELECT id, username, email, avatar_url, is_admin, created_at FROM users WHERE id = $1',
        [decoded.userId]
      );
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }
  } catch (error) {
    // Ignora erros - autenticação é opcional
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  optionalAuth,
};
