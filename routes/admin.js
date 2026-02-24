const express = require('express');
const { query } = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas admin requerem autenticação e privilégios de admin
router.use(authMiddleware);
router.use(adminMiddleware);

// POST /api/categories - Criar nova categoria (admin)
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
    }

    // Criar slug a partir do nome
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Verificar se já existe
    const existing = await query(
      'SELECT id FROM categories WHERE slug = $1',
      [slug]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Categoria já existe' });
    }

    const result = await query(
      'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id, name, slug',
      [name, slug]
    );

    res.status(201).json({
      message: 'Categoria criada com sucesso',
      category: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro ao criar categoria' });
  }
});

// PUT /api/categories/:id - Editar categoria (admin)
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
    }

    // Criar novo slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    await query(
      'UPDATE categories SET name = $1, slug = $2 WHERE id = $3',
      [name, slug, id]
    );

    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro ao atualizar categoria' });
  }
});

// DELETE /api/categories/:id - Deletar categoria (admin)
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se existem tópicos usando esta categoria
    const topics = await query(
      'SELECT COUNT(*) as count FROM topics WHERE category_id = $1',
      [id]
    );

    if (topics.rows[0].count > 0) {
      return res.status(400).json({
        message: 'Não é possível deletar categoria com tópicos associados',
      });
    }

    await query('DELETE FROM categories WHERE id = $1', [id]);

    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ message: 'Erro ao deletar categoria' });
  }
});

// GET /api/admin/reports - Listar denúncias
router.get('/reports', async (req, res) => {
  try {
    const result = await query(
      `
      SELECT 
        r.id,
        r.reason,
        r.status,
        r.created_at,
        t.id as topic_id,
        t.title,
        u.username as reporter
      FROM reports r
      JOIN topics t ON r.topic_id = t.id
      JOIN users u ON r.reporter_user_id = u.id
      WHERE r.status = 'pending'
      ORDER BY r.created_at DESC
      `
    );

    res.json({ reports: result.rows });
  } catch (error) {
    console.error('Erro ao listar denúncias:', error);
    res.status(500).json({ message: 'Erro ao listar denúncias' });
  }
});

// POST /api/admin/reports/:id/resolve - Resolver denúncia
router.post('/reports/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'excluir' ou 'ignorar'

    // Buscar o report
    const reportResult = await query(
      'SELECT topic_id FROM reports WHERE id = $1',
      [id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Denúncia não encontrada' });
    }

    if (action === 'excluir') {
      // Deletar o tópico denunciado
      await query('DELETE FROM topics WHERE id = $1', [reportResult.rows[0].topic_id]);
      await query('DELETE FROM reports WHERE id = $1', [id]);
      res.json({ message: 'Tópico deletado com sucesso' });
    } else if (action === 'ignorar') {
      // Marcar denúncia como resolvida
      await query(
        'UPDATE reports SET status = $1 WHERE id = $2',
        ['resolved', id]
      );
      res.json({ message: 'Denúncia ignorada' });
    } else {
      res.status(400).json({ message: 'Ação inválida' });
    }
  } catch (error) {
    console.error('Erro ao resolver denúncia:', error);
    res.status(500).json({ message: 'Erro ao resolver denúncia' });
  }
});

// GET /api/admin/stats - Estatísticas do sistema
router.get('/stats', async (req, res) => {
  try {
    const usersCount = await query('SELECT COUNT(*) as count FROM users');
    const topicsCount = await query('SELECT COUNT(*) as count FROM topics');
    const commentsCount = await query('SELECT COUNT(*) as count FROM comments');
    const categoriesCount = await query('SELECT COUNT(*) as count FROM categories');

    res.json({
      stats: {
        users: parseInt(usersCount.rows[0].count),
        topics: parseInt(topicsCount.rows[0].count),
        comments: parseInt(commentsCount.rows[0].count),
        categories: parseInt(categoriesCount.rows[0].count),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;
