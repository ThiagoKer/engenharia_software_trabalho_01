const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const topicsRoutes = require('./routes/topics');
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

/**
// CONFIGURAÇÃO DE CORS
// credentials: true permite envio de cookies entre frontend e backend
 */
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:3000'],
  credentials: true,
}));

// Parsers de corpo de requisição
app.use(express.json()); // Parseia JSON no body
app.use(express.urlencoded({ extended: true })); // Parseia form-data
app.use(cookieParser()); // Acesso a cookies

// Servir arquivos estáticos de upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MIDDLEWARE DE LOGGING (apenas em development)

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

//  REGISTRO DE ROTAS API
// /api/auth - autenticação e login
// /api/topics - tópicos CRUD e interações
// /api/users - dados do usuário
// /api/categories - listar categorias
// /api/admin - operações administrativas (protegidas)

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gamer Alpha API está funcionando!' });
});


// SERVIR FRONTEND COMO SPA
// Tudo que não for /api é servido pelo index.html (react-router, vue-router, etc)

app.use(express.static(path.join(__dirname, '../front-end')));

// Fallback para SPA - redireciona para index.html exceto para /api
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Rota não encontrada' });
  }
  res.sendFile(path.join(__dirname, '../front-end/index.html'));
});


// MIDDLEWARE DE TRATAMENTO DE ERROS
// Captura erros de uploads e outros erros da aplicação

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'Erro no upload de arquivo' });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
  });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});


// GRACEFUL SHUTDOWN
// Permite que requisições em voo sejam concluídas antes de encerrar

process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});
