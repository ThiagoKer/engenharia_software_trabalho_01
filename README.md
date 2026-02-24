# Gamer Alpha - Backend

Backend API para o fórum de jogos Gamer Alpha, desenvolvido com Node.js, Express e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via JSON Web Tokens
- **Bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos

## 📋 Pré-requisitos

- Node.js 14+ instalado
- PostgreSQL 12+ instalado e rodando
- npm ou yarn

## ⚙️ Instalação

1. **Clone o repositório e navegue até a pasta do back-end:**
```bash
cd back-end
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=gamer_alpha
JWT_SECRET=seu_secret_jwt_aqui
NODE_ENV=development
```

4. **Crie o banco de dados PostgreSQL:**
```bash
# Entre no PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE gamer_alpha;

# Saia do psql
\q
```

5. **Execute o script SQL para criar as tabelas:**
```bash
psql -U postgres -d gamer_alpha -f database/schema.sql
```

Ou conecte-se ao banco e execute o conteúdo do arquivo `database/schema.sql`.

6. **Crie a pasta de uploads:**
```bash
mkdir uploads
```

## 🏃 Executando o projeto

### Modo Desenvolvimento (com nodemon):
```bash
npm run dev
```

### Modo Produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Tópicos
- `GET /api/topics` - Listar tópicos (query: ?limit=20&category=fps)
- `GET /api/topics/:id` - Obter detalhes de um tópico
- `POST /api/topics` - Criar novo tópico (requer auth)
- `PUT /api/topics/:id` - Editar tópico (requer auth)
- `DELETE /api/topics/:id` - Deletar tópico (requer auth)
- `POST /api/topics/:id/like` - Curtir/descurtir tópico (requer auth)
- `GET /api/topics/:id/comments` - Listar comentários
- `POST /api/topics/:id/comments` - Adicionar comentário (requer auth)

### Usuários
- `GET /api/users/me/topics` - Obter tópicos do usuário (requer auth)
- `POST /api/users/me` - Atualizar perfil (requer auth, suporta upload)
- `DELETE /api/users/me` - Deletar conta (requer auth)

### Categorias
- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/:id` - Obter uma categoria específica

### Admin (requer auth e privilégios de admin)
- `POST /api/admin/categories` - Criar nova categoria
- `PUT /api/admin/categories/:id` - Editar categoria
- `DELETE /api/admin/categories/:id` - Deletar categoria
- `GET /api/admin/reports` - Listar denúncias
- `POST /api/admin/reports/:id/resolve` - Resolver denúncia
- `GET /api/admin/stats` - Obter estatísticas do sistema

## 🗄️ Estrutura do Banco de Dados

### Tabelas:
- **users** - Usuários do sistema
- **categories** - Categorias de tópicos
- **topics** - Tópicos/posts do fórum
- **comments** - Comentários nos tópicos
- **likes** - Curtidas nos tópicos
- **reports** - Denúncias de tópicos

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) armazenados em cookies HTTP-only para autenticação. 
Ao fazer login ou cadastro, um cookie é automaticamente definido no navegador.

## 📂 Estrutura de Pastas

```
back-end/
├── config/          # Configurações (database)
├── database/        # Scripts SQL
├── middleware/      # Middlewares (autenticação)
├── routes/          # Rotas da API
├── uploads/         # Arquivos de upload
├── .env.example     # Exemplo de variáveis de ambiente
├── .gitignore       # Arquivos ignorados pelo git
├── package.json     # Dependências e scripts
└── server.js        # Ponto de entrada da aplicação
```

## 🛠️ Desenvolvido por

Este projeto foi desenvolvido como trabalho acadêmico de Engenharia de Software.

## 📝 Licença

MIT
