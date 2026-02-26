const express = require('express');
const multer = require('multer');
const path = require('path');
const { query } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();


// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE AVATARES

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB é o limite
  fileFilter: (req, file, cb) => {
    // Valida tipos MIME e extensões
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});


// GET /me/topics
// Retorna todos os tópicos criados pelo usuário autenticado
// Inclui contagem de likes e comentários

router.get('/me/topics', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `
      SELECT 
        t.id,
        t.title,
        t.content,
        t.created_at,
        t.updated_at,
        c.name as category,
        c.slug,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT cm.id) as comments_count
      FROM topics t
      JOIN categories c ON t.category_id = c.id
      LEFT JOIN likes l ON t.id = l.topic_id
      LEFT JOIN comments cm ON t.id = cm.topic_id
      WHERE t.user_id = $1
      GROUP BY t.id, c.name, c.slug
      ORDER BY t.created_at DESC
      `,
      [req.user.id]
    );

    res.json({ topics: result.rows });
  } catch (error) {
    console.error('Erro ao buscar tópicos do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar tópicos' });
  }
});


// POST /me
// Atualiza dados do perfil do usuário (username, email, avatar)
// Requer autenticação

router.post('/me', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (username && username !== req.user.username) {
      const existing = await query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, req.user.id]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: 'Nome de usuário já em uso' });
      }
      updates.push(`username = $${paramCount}`);
      params.push(username);
      paramCount++;
    }

    if (email && email !== req.user.email) {
      const existing = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: 'Email já em uso' });
      }
      updates.push(`email = $${paramCount}`);
      params.push(email);
      paramCount++;
    }

    if (req.file) {
      const avatarUrl = `/uploads/${req.file.filename}`;
      updates.push(`avatar_url = $${paramCount}`);
      params.push(avatarUrl);
      paramCount++;
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      params.push(req.user.id);

      const queryText = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}`;
      await query(queryText, params);
    }

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});


// DELETE /me
// Deleta permanentemente a conta do usuário

router.delete('/me', authMiddleware, async (req, res) => {
  try {
    await query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.clearCookie('token');
    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ message: 'Erro ao deletar conta' });
  }
});

module.exports = router;
