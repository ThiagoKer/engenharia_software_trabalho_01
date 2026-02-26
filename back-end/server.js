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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gamer Alpha API está funcionando!' });
});

// serve arquivos estáticos do front-end localizado dentro do mesmo repositório
app.use(express.static(path.join(__dirname, '..', 'front-end')));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Rota não encontrada' });
  }
  // agora procura o index.html no diretório correto do front-end
  res.sendFile(path.join(__dirname, '..', 'front-end', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'Erro no upload de arquivo' });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
  });
});

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});
