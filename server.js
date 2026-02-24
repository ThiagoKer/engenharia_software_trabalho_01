const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const topicsRoutes = require('./routes/topics');
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log de requisições (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/admin', adminRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gamer Alpha API está funcionando!' });
});

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../front-end')));

// Rota catch-all para SPA (Single Page Application)
// Se não for uma rota da API, serve o index.html
app.get('*', (req, res) => {
  // Se a rota começa com /api, retorna 404 JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Rota não encontrada' });
  }
  // Caso contrário, serve o index.html
  res.sendFile(path.join(__dirname, '../front-end/index.html'));
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'Erro no upload de arquivo' });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});
