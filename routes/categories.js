const express = require('express');
const { query } = require('../config/database');

const router = express.Router();


// GET /categories
// Retorna todas as categorias com paginação implícita
// Ordena por nome alfabético

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, slug, description, created_at FROM categories ORDER BY name ASC'
    );

    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ message: 'Erro ao listar categorias' });
  }
});


// GET /categories/:id
// Retorna uma categoria específica por ID
// Erro 404 se categoria não encontrada

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, name, slug, description, created_at FROM categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json({ category: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ message: 'Erro ao buscar categoria' });
  }
});

module.exports = router;
