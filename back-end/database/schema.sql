-- Schema do Banco de Dados para Gamer Alpha Forum

-- Criação do banco de dados (executar separadamente se necessário)
-- CREATE DATABASE gamer_alpha;

-- Conectar ao banco
-- \c gamer_alpha;

-- Extensão para UUID (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tópicos
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de comentários
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de curtidas
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, topic_id)
);

-- Tabela de denúncias
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    reporter_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_topics_user_id ON topics(user_id);
CREATE INDEX idx_topics_category_id ON topics(category_id);
CREATE INDEX idx_comments_topic_id ON comments(topic_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_likes_topic_id ON likes(topic_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- Inserir categorias padrão
INSERT INTO categories (name, slug, description) VALUES
    ('FPS', 'fps', 'Jogos de tiro em primeira pessoa'),
    ('RPG', 'rpg', 'Jogos de interpretação de papéis'),
    ('MOBA', 'moba', 'Multiplayer Online Battle Arena'),
    ('Estratégia', 'estrategia', 'Jogos de estratégia'),
    ('Esports', 'esports', 'Discussões sobre esportes eletrônicos'),
    ('Hardware', 'hardware', 'Discussões sobre equipamentos');

-- Criar usuário admin padrão (senha: admin123)
-- Hash bcrypt de 'admin123'
INSERT INTO users (username, email, password_hash, is_admin) VALUES
    ('admin', 'admin@gameralpha.com', '$2a$10$H6pEu8H0GvBvj4eCJzWYqOu7QCLw2aAWf4C0Mx8/.ceYeh4wDnd3G', TRUE);
