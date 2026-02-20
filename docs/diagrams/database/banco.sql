-- ================================================================
-- Tabela Usuário
-- ================================================================
CREATE TABLE Usuario (
    ID INT PRIMARY KEY,
    nomeUsuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    avatar VARCHAR(100) NOT NULL UNIQUE,
    dataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags VARCHAR(255) NOT NULL,
)
