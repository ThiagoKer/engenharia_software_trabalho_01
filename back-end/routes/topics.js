
const express = require('express');
const { query } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { validarConteudo } = require('../middleware/profanityFilter');

const router = express.Router();

// Denunciar comentário
router.post('/comments/:id/report', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const reporter_user_id = req.user.id;

    // Verifica se comentário existe
    const commentResult = await query('SELECT id FROM comments WHERE id = $1', [id]);
    if (commentResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Comentário não encontrado' });
    }

    // Insere denúncia
    await query(
      'INSERT INTO reports_comments (comment_id, reporter_user_id, reason) VALUES ($1, $2, $3)',
      [id, reporter_user_id, reason]
    );
    res.json({ success: true, message: 'Comentário denunciado com sucesso' });
  } catch (error) {
    console.error('Erro ao denunciar comentário:', error);
    res.status(500).json({ success: false, message: 'Erro ao denunciar comentário' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { limit = 20, category } = req.query;

    let queryText = `
      SELECT 
        t.id,
        t.title,
        t.content,
        t.created_at,
        t.updated_at,
        u.username,
        c.name as category,
        c.slug,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT cm.id) as comments_count
      FROM topics t
      JOIN users u ON t.user_id = u.id
      JOIN categories c ON t.category_id = c.id
      LEFT JOIN likes l ON t.id = l.topic_id
      LEFT JOIN comments cm ON t.id = cm.topic_id
    `;

    const params = [];
    
    if (category) {
      queryText += ' WHERE c.slug = $1';
      params.push(category);
    }

    queryText += `
      GROUP BY t.id, u.username, c.name, c.slug
      ORDER BY t.created_at DESC
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await query(queryText, params);

    res.json({ topics: result.rows });
  } catch (error) {
    console.error('Erro ao listar tópicos:', error);
    res.status(500).json({ message: 'Erro ao listar tópicos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      SELECT 
        t.id,
        t.title,
        t.content,
        t.created_at,
        t.updated_at,
        u.username,
        u.id as user_id,
        c.name as category,
        c.slug,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT cm.id) as comments_count
      FROM topics t
      JOIN users u ON t.user_id = u.id
      JOIN categories c ON t.category_id = c.id
      LEFT JOIN likes l ON t.id = l.topic_id
      LEFT JOIN comments cm ON t.id = cm.topic_id
      WHERE t.id = $1
      GROUP BY t.id, u.username, u.id, c.name, c.slug
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tópico não encontrado' });
    }

    res.json({ topic: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar tópico:', error);
    res.status(500).json({ message: 'Erro ao buscar tópico' });
  }
});

router.post('/', authMiddleware, validarConteudo, async (req, res) => {
  try {
    const { titulo_topico, categoria_topico, conteudo_topico } = req.body;

    if (!titulo_topico || !categoria_topico || !conteudo_topico) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const categoryResult = await query(
      'SELECT id FROM categories WHERE slug = $1',
      [categoria_topico]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({ message: 'Categoria inválida' });
    }

    const categoryId = categoryResult.rows[0].id;

    const result = await query(
      'INSERT INTO topics (title, content, user_id, category_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [titulo_topico, conteudo_topico, req.user.id, categoryId]
    );

    res.status(201).json({
      message: 'Tópico criado com sucesso',
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error('Erro ao criar tópico:', error);
    res.status(500).json({ message: 'Erro ao criar tópico' });
  }
});

router.put('/:id', authMiddleware, validarConteudo, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo_post, categoria_post, conteudo_post } = req.body;

    const topicResult = await query(
      'SELECT user_id FROM topics WHERE id = $1',
      [id]
    );

    if (topicResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tópico não encontrado' });
    }

    if (topicResult.rows[0].user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este tópico' });
    }

    const categoryResult = await query(
      'SELECT id FROM categories WHERE slug = $1',
      [categoria_post]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({ message: 'Categoria inválida' });
    }

    const categoryId = categoryResult.rows[0].id;

    await query(
      'UPDATE topics SET title = $1, content = $2, category_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [titulo_post, conteudo_post, categoryId, id]
    );

    res.json({ message: 'Tópico atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao editar tópico:', error);
    res.status(500).json({ message: 'Erro ao editar tópico' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const topicResult = await query(
      'SELECT user_id FROM topics WHERE id = $1',
      [id]
    );

    if (topicResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tópico não encontrado' });
    }

    if (topicResult.rows[0].user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este tópico' });
    }

    await query('DELETE FROM topics WHERE id = $1', [id]);

    res.json({ message: 'Tópico deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar tópico:', error);
    res.status(500).json({ message: 'Erro ao deletar tópico' });
  }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const existingLike = await query(
      'SELECT id FROM likes WHERE user_id = $1 AND topic_id = $2',
      [req.user.id, id]
    );

    if (existingLike.rows.length > 0) {
      await query(
        'DELETE FROM likes WHERE user_id = $1 AND topic_id = $2',
        [req.user.id, id]
      );
      res.json({ message: 'Curtida removida' });
    } else {
      await query(
        'INSERT INTO likes (user_id, topic_id) VALUES ($1, $2)',
        [req.user.id, id]
      );
      res.json({ message: 'Tópico curtido' });
    }
  } catch (error) {
    console.error('Erro ao curtir tópico:', error);
    res.status(500).json({ message: 'Erro ao curtir tópico' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.topic_id = $1
      ORDER BY c.created_at ASC
      `,
      [id]
    );

    res.json({ comments: result.rows });
  } catch (error) {
    console.error('Erro ao listar comentários:', error);
    res.status(500).json({ message: 'Erro ao listar comentários' });
  }
});

router.post('/:id/comments', authMiddleware, validarConteudo, async (req, res) => {
  try {
    const { id } = req.params;
    const { conteudo_comentario } = req.body;

    if (!conteudo_comentario) {
      return res.status(400).json({ message: 'Conteúdo do comentário é obrigatório' });
    }

    await query(
      'INSERT INTO comments (content, user_id, topic_id) VALUES ($1, $2, $3)',
      [conteudo_comentario, req.user.id, id]
    );

    res.status(201).json({ message: 'Comentário adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ message: 'Erro ao adicionar comentário' });
  }
});

module.exports = router;
