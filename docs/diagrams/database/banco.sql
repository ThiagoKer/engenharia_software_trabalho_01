-- ================================================================
-- Tabela Usuário
-- ================================================================
CREATE TABLE Usuario (
    User_ID INT PRIMARY KEY,
    nomeUsuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    avatar VARCHAR(100) NOT NULL UNIQUE,
    dataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags VARCHAR(255) NOT NULL
);

-- ================================================================
-- Tabela Topico
-- ================================================================

CREATE TABLE Topico (
    Topico_ID INT PRIMARY KEY,
    tituloTopico VARCHAR(100) NOT NULL,
    conteudo VARCHAR(255) NOT NULL,
    dataPublicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantidadeLikes INT DEFAULT 0,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
);

-- ================================================================
-- Tabela Comentario
-- ================================================================

CREATE TABLE Comentario (
    Comentario_ID INT PRIMARY KEY,
    conteudo VARCHAR(255) NOT NULL,
    dataPublicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- ================================================================
-- Tabela Categoria
-- ================================================================

CREATE TABLE Categoria (
    Categoria_ID INT PRIMARY KEY,
    nomeCategoria VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL,
    imagemCapa VARCHAR(100) NOT NULL UNIQUE,
);

-- ================================================================
-- Tabela Administrador
-- ================================================================

CREATE TABLE Administrador (
    Admin_ID INT PRIMARY KEY,
    nivelAcesso INT NOT NULL,
    CONSTRAINT FK_Admin_Usuario FOREIGN KEY (Admin_ID) 
        REFERENCES Usuario(User_ID) ON UPDATE CASCADE ON DELETE CASCADE
        
);

-- ===============================================================
-- Tabela Denuncia
-- ===============================================================

CREATE TABLE Denuncia (
    Denuncia_ID INT PRIMARY KEY,
    motivo VARCHAR(255) NOT NULL,
    dataDenuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'resolvida', 'rejeitada') DEFAULT 'pendente',
    CONSTRAINT FK_Denuncia_Usuario FOREIGN KEY (Denuncia_ID) 
        REFERENCES Usuario(User_ID) ON UPDATE CASCADE ON DELETE CASCADE
);